import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabaseUrl = !!process.env.SUPABASE_URL;
    const serviceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    return NextResponse.json({ supabaseUrl, serviceRole });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
