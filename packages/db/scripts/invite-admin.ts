/**
 * Invites someone to the admin dashboard and gives them the admin role.
 * Supabase emails them a link to /auth/set-password on the admin site, where they choose
 * their own password — nobody else ever handles it. Re-running for an existing user just
 * (re)applies the admin role.
 *
 *   npm run db:invite-admin -- owner@example.com
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and ADMIN_SITE_URL from the root .env.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminSite = (process.env.ADMIN_SITE_URL || "http://localhost:3001").replace(/\/$/, "");
const email = process.argv[2]?.trim().toLowerCase();

if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}
if (!email || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
  console.error(`"${email ?? ""}" is not a valid email address (Latin letters only).`);
  console.error("Usage: npm run db:invite-admin -- someone@example.com");
  process.exit(1);
}

const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: existing, error: lookupError } = await db.from("profiles").select("id, role").eq("email", email).maybeSingle();
if (lookupError) throw new Error(`Profile lookup failed: ${lookupError.message}`);

if (existing) {
  console.log(`${email} already has an account — skipping the invite email.`);
} else {
  const { error } = await db.auth.admin.inviteUserByEmail(email, { redirectTo: `${adminSite}/auth/set-password` });
  if (error) throw new Error(`Invite failed: ${error.message}`);
  console.log(`✓ Invite email sent to ${email} (link opens ${adminSite}/auth/set-password).`);
}

// The on_auth_user_created trigger has created the profile row by now.
const { data: promoted, error: roleError } = await db.from("profiles").update({ role: "admin" }).eq("email", email).select("id");
if (roleError) throw new Error(`Promote failed: ${roleError.message}`);
console.log(promoted?.length ? `✓ ${email} has the admin role.` : `! No profile found for ${email}.`);
