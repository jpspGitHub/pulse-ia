CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

DO $$ BEGIN
  CREATE TYPE tenant_status AS ENUM ('active', 'suspended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'invited', 'disabled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE locale_code AS ENUM ('es', 'en', 'pt');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE membership_role AS ENUM ('employee', 'manager', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE auth_provider AS ENUM ('local', 'google', 'microsoft');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE segment_type AS ENUM ('team', 'project', 'client', 'country', 'region');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE chat_channel AS ENUM ('webchat', 'email', 'slack', 'teams');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE chat_flow_type AS ENUM ('checkin', 'venting', 'recognition', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE chat_status AS ENUM ('open', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE message_sender AS ENUM ('user', 'assistant', 'system');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE analysis_intent AS ENUM ('pulse_checkin', 'feedback', 'recognition', 'venting', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE analysis_sentiment AS ENUM ('negative', 'neutral', 'positive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE analysis_urgency AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE period_type AS ENUM ('week');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE alert_type AS ENUM ('pulse_drop', 'pulse_negative_trend', 'fatigue_spike', 'conflict_signal');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE recommended_action_category AS ENUM ('recognition', 'clarity', 'workload', 'communication', 'leadership', 'process', 'psych_safety');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE recommended_action_status AS ENUM ('proposed', 'applied', 'dismissed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS status tenant_status NOT NULL DEFAULT 'active';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS settings jsonb NOT NULL DEFAULT '{"anonymity_threshold":5,"checkin_schedule":{"cadence":"twice_weekly","days":["mon","thu"],"time":"10:00","timezone":"America/Montevideo"},"enabled_dimensions":["mood","motivation","workload","clarity","recognition","leadership","team","psych_safety"]}'::jsonb;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

UPDATE tenants
SET slug = COALESCE(slug, regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE tenants ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS tenants_slug_unique ON tenants (slug);

-- Users
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name text;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name') THEN
    EXECUTE 'UPDATE users SET full_name = COALESCE(full_name, name) WHERE name IS NOT NULL';
    EXECUTE 'ALTER TABLE users DROP COLUMN name';
  END IF;
END $$;

ALTER TABLE users ALTER COLUMN email TYPE citext USING email::citext;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique;
CREATE UNIQUE INDEX IF NOT EXISTS users_tenant_email_unique ON users (tenant_id, email);

ALTER TABLE users ADD COLUMN IF NOT EXISTS status user_status NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_locale locale_code NOT NULL DEFAULT 'es';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Memberships
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
UPDATE memberships SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE memberships SET role = 'employee' WHERE role IS NULL OR role NOT IN ('employee', 'manager', 'admin');
ALTER TABLE memberships ALTER COLUMN role DROP DEFAULT;
ALTER TABLE memberships ALTER COLUMN role TYPE membership_role USING role::membership_role;
ALTER TABLE memberships ALTER COLUMN role SET DEFAULT 'employee';
ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_pkey;
ALTER TABLE memberships ADD PRIMARY KEY (id);
CREATE UNIQUE INDEX IF NOT EXISTS memberships_tenant_user_unique ON memberships (tenant_id, user_id);

-- Tenant domains
ALTER TABLE tenant_domains ALTER COLUMN created_at SET DEFAULT now();

-- Auth identities
DROP TABLE IF EXISTS auth_identities;
CREATE TABLE auth_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL,
  provider_subject text NULL,
  password_hash text NULL,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, provider, user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS auth_identities_provider_subject_unique
  ON auth_identities (tenant_id, provider, provider_subject)
  WHERE provider_subject IS NOT NULL;

-- Dimensions catalog
CREATE TABLE IF NOT EXISTS dimensions_catalog (
  key text PRIMARY KEY,
  display_name_es text NOT NULL,
  display_name_en text NOT NULL,
  display_name_pt text NOT NULL,
  description text NULL
);

-- Segments
CREATE TABLE IF NOT EXISTS segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type segment_type NOT NULL,
  key text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, type, key)
);

-- User segment memberships
CREATE TABLE IF NOT EXISTS user_segment_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES segments(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NULL,
  UNIQUE (tenant_id, user_id, segment_id, start_date)
);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel chat_channel NOT NULL DEFAULT 'webchat',
  flow_type chat_flow_type NOT NULL DEFAULT 'checkin',
  locale locale_code NOT NULL,
  status chat_status NOT NULL DEFAULT 'open',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz NULL
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_tenant_session_created_idx
  ON messages (tenant_id, session_id, created_at);

-- Message analysis
CREATE TABLE IF NOT EXISTS message_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  message_id uuid NOT NULL UNIQUE REFERENCES messages(id) ON DELETE CASCADE,
  intent analysis_intent NOT NULL,
  sentiment analysis_sentiment NOT NULL,
  urgency analysis_urgency NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence numeric(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Scores
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_id uuid NULL REFERENCES messages(id) ON DELETE SET NULL,
  dimension_key text NOT NULL REFERENCES dimensions_catalog(key),
  score int NOT NULL CHECK (score >= 0 AND score <= 100),
  confidence numeric(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS scores_tenant_dimension_created_idx
  ON scores (tenant_id, dimension_key, created_at);

-- Aggregated metrics
CREATE TABLE IF NOT EXISTS aggregated_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_type period_type NOT NULL DEFAULT 'week',
  period_start date NOT NULL,
  period_end date NOT NULL,
  segment_id uuid NULL REFERENCES segments(id) ON DELETE SET NULL,
  eligible_users_count int NOT NULL DEFAULT 0 CHECK (eligible_users_count >= 0),
  responding_users_count int NOT NULL DEFAULT 0 CHECK (responding_users_count >= 0),
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, period_type, period_start, segment_id),
  CHECK (period_end >= period_start)
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  segment_id uuid NULL REFERENCES segments(id) ON DELETE SET NULL,
  type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  status alert_status NOT NULL DEFAULT 'open',
  summary text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS alerts_tenant_status_created_idx
  ON alerts (tenant_id, status, created_at);

-- Recommended actions catalog
CREATE TABLE IF NOT EXISTS recommended_actions_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  category recommended_action_category NOT NULL,
  title_es text NOT NULL,
  title_en text NOT NULL,
  title_pt text NOT NULL,
  description_es text NOT NULL,
  description_en text NOT NULL,
  description_pt text NOT NULL,
  suggested_when jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Recommended action instances
CREATE TABLE IF NOT EXISTS recommended_action_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  segment_id uuid NULL REFERENCES segments(id) ON DELETE SET NULL,
  catalog_action_id uuid NOT NULL REFERENCES recommended_actions_catalog(id) ON DELETE CASCADE,
  status recommended_action_status NOT NULL DEFAULT 'proposed',
  rationale jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, period_start, segment_id, catalog_action_id)
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tenants_set_updated_at ON tenants;
CREATE TRIGGER tenants_set_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS auth_identities_set_updated_at ON auth_identities;
CREATE TRIGGER auth_identities_set_updated_at
  BEFORE UPDATE ON auth_identities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS segments_set_updated_at ON segments;
CREATE TRIGGER segments_set_updated_at
  BEFORE UPDATE ON segments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS aggregated_metrics_set_updated_at ON aggregated_metrics;
CREATE TRIGGER aggregated_metrics_set_updated_at
  BEFORE UPDATE ON aggregated_metrics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS alerts_set_updated_at ON alerts;
CREATE TRIGGER alerts_set_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS recommended_actions_catalog_set_updated_at ON recommended_actions_catalog;
CREATE TRIGGER recommended_actions_catalog_set_updated_at
  BEFORE UPDATE ON recommended_actions_catalog
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS recommended_action_instances_set_updated_at ON recommended_action_instances;
CREATE TRIGGER recommended_action_instances_set_updated_at
  BEFORE UPDATE ON recommended_action_instances
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Anonymity-safe view
CREATE OR REPLACE VIEW aggregated_metrics_safe AS
SELECT am.*
FROM aggregated_metrics am
JOIN tenants t ON t.id = am.tenant_id
WHERE am.segment_id IS NULL
  OR am.eligible_users_count >= COALESCE((t.settings->>'anonymity_threshold')::int, 5);
