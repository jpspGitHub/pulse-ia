CREATE OR REPLACE PROCEDURE api_get_tenant(
  IN p_tenant_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, name, slug, status, settings, created_at, updated_at
    FROM tenants
    WHERE id = p_tenant_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_update_tenant_settings(
  IN p_tenant_id uuid,
  IN p_settings jsonb,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    UPDATE tenants
    SET settings = p_settings, updated_at = now()
    WHERE id = p_tenant_id
    RETURNING id, name, slug, status, settings, created_at, updated_at;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_tenant_domains(
  IN p_tenant_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, domain, created_at
    FROM tenant_domains
    WHERE tenant_id = p_tenant_id
    ORDER BY domain;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_user_by_id(
  IN p_user_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, email, full_name, status, preferred_locale, created_at, updated_at
    FROM users
    WHERE id = p_user_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_user_by_email(
  IN p_email text,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, email, full_name, status, preferred_locale, created_at, updated_at
    FROM users
    WHERE email = p_email::citext
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_membership_role(
  IN p_tenant_id uuid,
  IN p_user_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT role
    FROM memberships
    WHERE tenant_id = p_tenant_id AND user_id = p_user_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_auth_local_by_email(
  IN p_email text,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT
      u.id as user_id,
      u.tenant_id,
      u.email,
      u.full_name,
      u.status,
      u.preferred_locale,
      m.role,
      ai.password_hash,
      ai.email_verified
    FROM auth_identities ai
    JOIN users u ON u.id = ai.user_id AND u.tenant_id = ai.tenant_id
    LEFT JOIN memberships m ON m.user_id = u.id AND m.tenant_id = u.tenant_id
    WHERE ai.provider = 'local' AND u.email = p_email::citext
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_dimensions_catalog(
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT key, display_name_es, display_name_en, display_name_pt, description
    FROM dimensions_catalog
    ORDER BY key;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_recommended_actions_catalog(
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, key, category, title_es, title_en, title_pt, description_es, description_en, description_pt,
           suggested_when, created_at, updated_at
    FROM recommended_actions_catalog
    ORDER BY key;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_segments(
  IN p_tenant_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, type, key, display_name, created_at, updated_at
    FROM segments
    WHERE tenant_id = p_tenant_id
    ORDER BY type, display_name;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_segment(
  IN p_tenant_id uuid,
  IN p_segment_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, type, key, display_name, created_at, updated_at
    FROM segments
    WHERE tenant_id = p_tenant_id AND id = p_segment_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_create_segment(
  IN p_tenant_id uuid,
  IN p_type segment_type,
  IN p_key text,
  IN p_display_name text,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    INSERT INTO segments (tenant_id, type, key, display_name)
    VALUES (p_tenant_id, p_type, p_key, p_display_name)
    RETURNING id, tenant_id, type, key, display_name, created_at, updated_at;
END;
$$;

CREATE OR REPLACE PROCEDURE api_create_user_segment_membership(
  IN p_tenant_id uuid,
  IN p_user_id uuid,
  IN p_segment_id uuid,
  IN p_start_date date,
  IN p_end_date date,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    INSERT INTO user_segment_memberships (tenant_id, user_id, segment_id, start_date, end_date)
    VALUES (p_tenant_id, p_user_id, p_segment_id, p_start_date, p_end_date)
    RETURNING id, tenant_id, user_id, segment_id, start_date, end_date;
END;
$$;

CREATE OR REPLACE PROCEDURE api_create_chat_session(
  IN p_tenant_id uuid,
  IN p_user_id uuid,
  IN p_channel chat_channel,
  IN p_flow_type chat_flow_type,
  IN p_locale locale_code,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    INSERT INTO chat_sessions (tenant_id, user_id, channel, flow_type, locale)
    VALUES (p_tenant_id, p_user_id, p_channel, p_flow_type, p_locale)
    RETURNING id, tenant_id, user_id, channel, flow_type, locale, status, started_at, ended_at;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_chat_session(
  IN p_tenant_id uuid,
  IN p_session_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, user_id, channel, flow_type, locale, status, started_at, ended_at
    FROM chat_sessions
    WHERE tenant_id = p_tenant_id AND id = p_session_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_create_message(
  IN p_tenant_id uuid,
  IN p_session_id uuid,
  IN p_sender message_sender,
  IN p_text text,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    INSERT INTO messages (tenant_id, session_id, sender, text)
    VALUES (p_tenant_id, p_session_id, p_sender, p_text)
    RETURNING id, tenant_id, session_id, sender, text, created_at;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_messages_by_session(
  IN p_tenant_id uuid,
  IN p_session_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, session_id, sender, text, created_at
    FROM messages
    WHERE tenant_id = p_tenant_id AND session_id = p_session_id
    ORDER BY created_at ASC;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_message_analysis(
  IN p_tenant_id uuid,
  IN p_message_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, message_id, intent, sentiment, urgency, topics, dimensions, confidence, raw, created_at
    FROM message_analysis
    WHERE tenant_id = p_tenant_id AND message_id = p_message_id
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_scores_by_session(
  IN p_tenant_id uuid,
  IN p_session_id uuid,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, session_id, message_id, dimension_key, score, confidence, created_at
    FROM scores
    WHERE tenant_id = p_tenant_id AND session_id = p_session_id
    ORDER BY created_at ASC;
END;
$$;

CREATE OR REPLACE PROCEDURE api_get_aggregated_metric_global(
  IN p_tenant_id uuid,
  IN p_period_start date,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, period_type, period_start, period_end, segment_id,
           eligible_users_count, responding_users_count, metrics, created_at, updated_at
    FROM aggregated_metrics
    WHERE tenant_id = p_tenant_id AND period_start = p_period_start AND segment_id IS NULL
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_aggregated_metrics_segmented(
  IN p_tenant_id uuid,
  IN p_period_start date,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT
      am.id,
      am.tenant_id,
      am.period_type,
      am.period_start,
      am.period_end,
      am.segment_id,
      am.eligible_users_count,
      am.responding_users_count,
      am.metrics,
      am.created_at,
      am.updated_at,
      s.type as segment_type,
      s.key as segment_key,
      s.display_name as segment_display_name,
      s.created_at as segment_created_at,
      s.updated_at as segment_updated_at
    FROM aggregated_metrics am
    JOIN segments s ON s.id = am.segment_id
    WHERE am.tenant_id = p_tenant_id AND am.period_start = p_period_start
    ORDER BY s.type, s.display_name;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_alerts_by_status(
  IN p_tenant_id uuid,
  IN p_status alert_status,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT id, tenant_id, period_start, segment_id, type, severity, status, summary, details, created_at, updated_at
    FROM alerts
    WHERE tenant_id = p_tenant_id AND status = p_status
    ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE PROCEDURE api_list_recommended_actions_by_period(
  IN p_tenant_id uuid,
  IN p_period_start date,
  INOUT p_cursor refcursor
)
LANGUAGE plpgsql AS $$
BEGIN
  OPEN p_cursor FOR
    SELECT
      rai.id,
      rai.tenant_id,
      rai.period_start,
      rai.segment_id,
      rai.catalog_action_id,
      rai.status,
      rai.rationale,
      rai.created_at,
      rai.updated_at,
      rac.key as catalog_key,
      rac.category as catalog_category,
      rac.title_es,
      rac.title_en,
      rac.title_pt,
      rac.description_es,
      rac.description_en,
      rac.description_pt,
      rac.suggested_when
    FROM recommended_action_instances rai
    JOIN recommended_actions_catalog rac ON rac.id = rai.catalog_action_id
    WHERE rai.tenant_id = p_tenant_id AND rai.period_start = p_period_start
    ORDER BY rai.created_at DESC;
END;
$$;
