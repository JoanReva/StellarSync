import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';

const envPath = '.env.local';

if (!existsSync(envPath)) {
  throw new Error('.env.local was not found');
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

const hostname = new URL(url).hostname;
const supabase = createClient(url, key);

const { data, error, count } = await supabase
  .from('leaderboard')
  .select('id, player_name, time_remaining, created_at', { count: 'exact' })
  .order('time_remaining', { ascending: false })
  .limit(1);

if (error) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        hostname,
        code: error.code,
        message: error.message,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      hostname,
      count,
      sampleRows: data?.length ?? 0,
    },
    null,
    2,
  ),
);
