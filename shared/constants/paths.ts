import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const MONOREPO_ROOT = join(__dirname, '../../');

export const PATHS = {
  MONOREPO_ROOT,
  PUBLIC_DATA: join(MONOREPO_ROOT, 'shared', 'data', 'public'),
  PRIVATE_DATA: join(MONOREPO_ROOT, 'shared', 'data', 'private'),
  ETL_ROOT: join(MONOREPO_ROOT, 'apps', 'etl'),
} as const;

export type PathsType = typeof PATHS;
