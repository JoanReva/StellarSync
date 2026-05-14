import type { SupabaseClient } from '@supabase/supabase-js';
import { SCOREBOARD } from '../utils/constants';

type SupabaseScoreRow = {
  id: string;
  player_name: string;
  time_remaining: number;
  created_at: string;
};

export type ScoreboardEntry = {
  id: string;
  playerName: string;
  timeRemainingSeconds: number;
  createdAt: string;
};

export type ScoreboardSubmission = {
  playerName: string;
  timeRemainingSeconds: number;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

export const isScoreboardConfigured = Boolean(supabaseUrl && supabasePublishableKey);

let supabase: SupabaseClient | null = null;

const mapScoreRow = (row: SupabaseScoreRow): ScoreboardEntry => ({
  id: row.id,
  playerName: row.player_name,
  timeRemainingSeconds: row.time_remaining,
  createdAt: row.created_at,
});

const getSupabase = async () => {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase is not configured');
  }

  if (!supabase) {
    const { createClient } = await import('@supabase/supabase-js');

    supabase = createClient(supabaseUrl, supabasePublishableKey);
  }

  return supabase;
};

export const fetchScores = async (): Promise<ScoreboardEntry[]> => {
  const client = await getSupabase();
  const { data, error } = await client
    .from(SCOREBOARD.tableName)
    .select('id, player_name, time_remaining, created_at')
    .order('time_remaining', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(SCOREBOARD.limit);

  if (error) {
    throw new Error('Unable to load scores');
  }

  return (data as SupabaseScoreRow[]).map(mapScoreRow);
};

export const submitScore = async ({
  playerName,
  timeRemainingSeconds,
}: ScoreboardSubmission): Promise<ScoreboardEntry> => {
  const trimmedName = playerName.trim().slice(0, SCOREBOARD.playerNameMaxLength);

  if (!trimmedName) {
    throw new Error('Player name is required');
  }

  const client = await getSupabase();
  const { data, error } = await client
    .from(SCOREBOARD.tableName)
    .insert({
      player_name: trimmedName,
      time_remaining: timeRemainingSeconds,
    })
    .select('id, player_name, time_remaining, created_at')
    .single();

  if (error) {
    throw new Error('Unable to submit score');
  }

  if (!data) {
    throw new Error('Score was not returned');
  }

  return mapScoreRow(data as SupabaseScoreRow);
};
