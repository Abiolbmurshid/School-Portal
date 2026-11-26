# School Portal Starter

A React + Vite + Supabase school portal starter with:
- Public school homepage
- Student registration and login
- Student dashboard
- Admin login and dashboard
- Responsive CSS styling
- Supabase database schema and Row Level Security (RLS)

## 1. Install and run

Open this folder in VS Code. In the VS Code terminal run:

```bash
npm install
```

Create a file named `.env` in the project root (beside `package.json`) and add your Supabase project URL and **publishable/anon key**:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Never put a Supabase `service_role` or secret key in a browser app.

Then run:

```bash
npm run dev
```

Open the local URL Vite prints, usually http://localhost:5173.

## 2. Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor → New query**.
3. Copy and run all of `supabase/schema.sql`.
4. Copy your Project URL and publishable/anon key into `.env`.
5. In Supabase **Authentication → URL Configuration**, set your Site URL to your deployed URL (or `http://localhost:5173` while testing) and add your local/deployed URLs to Redirect URLs.

Email confirmation may be enabled by default. If it is enabled, students must confirm the email sent by Supabase before they can log in. For local testing, you can turn off **Authentication → Providers → Email → Confirm email** in Supabase. This is a project setting, not a code error.

## 3. Create an admin account safely

Admin accounts are NOT created from the public student registration page.

1. Register a normal account using the app, or create a user in Supabase **Authentication → Users**.
2. Confirm the email if email confirmation is enabled.
3. In Supabase **Authentication → Users**, open that user and copy their UUID.
4. In SQL Editor, run this command after replacing the UUID:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE-USER-UUID-HERE';
```

5. Use that account on `/admin-login`.

Do not make the role editable in a public form. The database policies restrict admin data access to accounts whose role is `admin`.

## 4. Pages

- `/` — Homepage
- `/register` — Student registration
- `/student-login` — Student login
- `/student-dashboard` — Student dashboard
- `/admin-login` — Admin login
- `/admin-dashboard` — Admin dashboard

## Notes

- Student registration creates an Auth account; a database trigger creates its profile.
- Students can read/update only their own profile.
- Admins can read all profiles.
- The admin dashboard currently shows registered profile records. Add your own school-specific fields/workflows as needed.
- For production, configure a custom domain, email templates, and backups in Supabase.
