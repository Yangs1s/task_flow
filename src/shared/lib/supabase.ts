import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 테스트 환경이 아닐 때만 환경 변수 체크
const isTestEnv = process.env.NODE_ENV === "test";

let supabase: SupabaseClient;

if (!isTestEnv && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error("Missing Supabase environment variables");
}

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // 테스트 환경에서 mock이 대체할 빈 객체
  supabase = {} as SupabaseClient;
}

export { supabase };
