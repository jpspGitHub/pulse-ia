INSERT INTO tenants (id, name, slug, status, settings)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'PulseIA',
  'pulseia',
  'active',
  '{"anonymity_threshold":5,"checkin_schedule":{"cadence":"twice_weekly","days":["mon","thu"],"time":"10:00","timezone":"America/Montevideo"},"enabled_dimensions":["mood","motivation","workload","clarity","recognition","leadership","team","psych_safety"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tenant_domains (id, tenant_id, domain)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'pulseia.local'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, tenant_id, email, full_name, status, preferred_locale)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'admin@pulseia.local',
  'PulseIA Admin',
  'active',
  'es'
)
ON CONFLICT (tenant_id, email) DO NOTHING;

INSERT INTO memberships (id, tenant_id, user_id, role)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth_identities (
  id,
  tenant_id,
  user_id,
  provider,
  provider_subject,
  password_hash,
  email_verified
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'local',
  'admin@pulseia.local',
  crypt('pulseia123', gen_salt('bf')),
  true
)
ON CONFLICT (tenant_id, provider, user_id) DO NOTHING;

INSERT INTO dimensions_catalog (key, display_name_es, display_name_en, display_name_pt, description)
VALUES
  ('mood', 'Estado de animo', 'Mood', 'Humor', 'Percepcion general del estado emocional.'),
  ('motivation', 'Motivacion', 'Motivation', 'Motivacao', 'Energia y motivacion para el trabajo.'),
  ('workload', 'Carga de trabajo', 'Workload', 'Carga de trabalho', 'Nivel de carga y balance de tareas.'),
  ('clarity', 'Claridad', 'Clarity', 'Clareza', 'Claridad sobre objetivos y prioridades.'),
  ('recognition', 'Reconocimiento', 'Recognition', 'Reconhecimento', 'Sentimiento de reconocimiento.'),
  ('leadership', 'Liderazgo', 'Leadership', 'Lideranca', 'Confianza en el liderazgo.'),
  ('team', 'Equipo', 'Team', 'Time', 'Relacion con el equipo y colaboracion.'),
  ('psych_safety', 'Seguridad psicologica', 'Psychological safety', 'Seguranca psicologica', 'Seguridad para expresar ideas y preocupaciones.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO segments (id, tenant_id, type, key, display_name)
VALUES
  ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'team', 'engineering', 'Engineering'),
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'project', 'pulseia', 'PulseIA'),
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'client', 'acme', 'ACME'),
  ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'country', 'uy', 'Uruguay'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'region', 'latam', 'LATAM')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_segment_memberships (id, tenant_id, user_id, segment_id, start_date)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '66666666-6666-6666-6666-666666666666',
  '2025-01-01'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recommended_actions_catalog (
  key,
  category,
  title_es,
  title_en,
  title_pt,
  description_es,
  description_en,
  description_pt,
  suggested_when
)
VALUES
  (
    'recognize_wins',
    'recognition',
    'Celebrar logros del equipo',
    'Celebrate team wins',
    'Celebrar conquistas do time',
    'Destinar 10 minutos en la reunion semanal para reconocer logros recientes.',
    'Reserve 10 minutes in the weekly meeting to recognize recent wins.',
    'Reserve 10 minutos na reuniao semanal para reconhecer conquistas recentes.',
    '{"dimension":"recognition","threshold":65}'::jsonb
  ),
  (
    'clarify_priorities',
    'clarity',
    'Clarificar prioridades de la semana',
    'Clarify weekly priorities',
    'Clarificar prioridades da semana',
    'Publicar las 3 prioridades clave y responsables cada lunes.',
    'Publish the 3 key priorities and owners each Monday.',
    'Publicar as 3 prioridades-chave e responsaveis toda segunda-feira.',
    '{"dimension":"clarity","threshold":60}'::jsonb
  ),
  (
    'rebalance_workload',
    'workload',
    'Rebalancear cargas',
    'Rebalance workload',
    'Rebalancear carga',
    'Revisar capacidad y redistribuir tareas criticas.',
    'Review capacity and redistribute critical tasks.',
    'Revisar capacidade e redistribuir tarefas criticas.',
    '{"dimension":"workload","threshold":55}'::jsonb
  ),
  (
    '1on1_checkins',
    'communication',
    'Refuerzo de 1:1',
    'Increase 1:1s',
    'Reforcar 1:1s',
    'Agendar 1:1 breves con quienes reporten baja motivacion.',
    'Schedule brief 1:1s with those reporting low motivation.',
    'Agendar 1:1 breves com quem reporta baixa motivacao.',
    '{"dimension":"motivation","threshold":60}'::jsonb
  ),
  (
    'leadership_visibility',
    'leadership',
    'Mayor visibilidad del liderazgo',
    'Increase leadership visibility',
    'Aumentar visibilidade da lideranca',
    'Compartir actualizaciones semanales del liderazgo en un canal fijo.',
    'Share weekly leadership updates in a fixed channel.',
    'Compartilhar atualizacoes semanais da lideranca em um canal fixo.',
    '{"dimension":"leadership","threshold":60}'::jsonb
  ),
  (
    'process_simplification',
    'process',
    'Simplificar procesos',
    'Simplify processes',
    'Simplificar processos',
    'Identificar un proceso pesado y acordar una mejora rapida.',
    'Identify a heavy process and agree on a quick improvement.',
    'Identificar um processo pesado e combinar uma melhoria rapida.',
    '{"drivers":["process","bureaucracy"]}'::jsonb
  ),
  (
    'psych_safety_rounds',
    'psych_safety',
    'Ronda de seguridad psicologica',
    'Psychological safety round',
    'Roda de seguranca psicologica',
    'Abrir un espacio de 15 minutos para compartir inquietudes sin juicio.',
    'Open a 15-minute space to share concerns without judgment.',
    'Abrir um espaco de 15 minutos para compartilhar preocupacoes sem julgamento.',
    '{"dimension":"psych_safety","threshold":65}'::jsonb
  ),
  (
    'team_retrospective',
    'process',
    'Retrospectiva del equipo',
    'Team retrospective',
    'Retrospectiva do time',
    'Facilitar una retrospectiva corta para identificar bloqueos.',
    'Run a short retro to identify blockers.',
    'Conduzir uma retrospectiva curta para identificar bloqueios.',
    '{"dimension":"team","threshold":60}'::jsonb
  ),
  (
    'peer_shoutouts',
    'recognition',
    'Shoutouts entre pares',
    'Peer shoutouts',
    'Reconhecimento entre pares',
    'Incentivar mensajes de agradecimiento entre companeros.',
    'Encourage peer appreciation messages.',
    'Incentivar mensagens de agradecimento entre colegas.',
    '{"dimension":"recognition","threshold":70}'::jsonb
  ),
  (
    'conflict_resolution',
    'psych_safety',
    'Resolver tensiones',
    'Resolve tensions',
    'Resolver tensoes',
    'Proponer una sesion de mediacion ligera con apoyo de liderazgo.',
    'Propose a light mediation session with leadership support.',
    'Propor uma sessao de mediacao leve com apoio da lideranca.',
    '{"drivers":["conflict","tension"]}'::jsonb
  )
ON CONFLICT (key) DO NOTHING;
