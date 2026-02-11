const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

function parseEnvFileArg(argv = process.argv.slice(2)) {
  const eqArg = argv.find((arg) => arg.startsWith('--env-file='));
  if (eqArg) {
    return eqArg.split('=').slice(1).join('=');
  }

  const index = argv.findIndex((arg) => arg === '--env-file');
  if (index >= 0 && argv[index + 1]) {
    return argv[index + 1];
  }

  return process.env.ENV_FILE;
}

function resolveEnvCandidates() {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const requested = parseEnvFileArg();

  const candidates = [
    requested,
    path.join(repoRoot, '.env'),
    path.join(repoRoot, 'apps', 'api', '.env'),
    path.join(repoRoot, 'infra', 'compose', '.env'),
    path.join(repoRoot, '.env.local'),
    path.join(repoRoot, 'apps', 'api', '.env.local'),
    path.join(repoRoot, 'apps', 'api', '.env.example'),
  ].filter(Boolean);

  return {
    repoRoot,
    candidates: Array.from(new Set(candidates.map((file) => path.resolve(file)))),
  };
}

function loadEnv() {
  const { repoRoot, candidates } = resolveEnvCandidates();
  const loaded = [];

  for (const file of candidates) {
    if (!fs.existsSync(file)) {
      continue;
    }

    const result = dotenv.config({ path: file, override: false });
    if (!result.error) {
      loaded.push(path.relative(repoRoot, file) || file);
    }

    if (process.env.DATABASE_URL) {
      break;
    }
  }

  return {
    repoRoot,
    loaded,
    candidates,
    databaseUrl: process.env.DATABASE_URL,
  };
}

module.exports = {
  loadEnv,
};
