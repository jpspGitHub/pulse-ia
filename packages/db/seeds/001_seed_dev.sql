INSERT INTO tenants (id, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'PulseIA')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, tenant_id, email, name, password_hash)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'admin@pulseia.local',
  'PulseIA Admin',
  crypt('pulseia123', gen_salt('bf'))
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO memberships (user_id, tenant_id, role)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'admin'
)
ON CONFLICT DO NOTHING;

INSERT INTO tenant_domains (id, tenant_id, domain)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'pulseia.local'
)
ON CONFLICT DO NOTHING;
