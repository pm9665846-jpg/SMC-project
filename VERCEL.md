# Deploying to Vercel

## Fix: "Environment variable not found: DATABASE_URL"

The build is set up to succeed **without** `DATABASE_URL` (a dummy value is used for `prisma generate`). For the app to work at runtime you must add your real database URL in Vercel.

### Steps

1. Open your project on [Vercel](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** Your MySQL connection string, e.g.  
     `mysql://USER:PASSWORD@HOST:3306/SMC_DB`
4. Select **Production**, **Preview**, and **Development** (as needed).
5. Save and **redeploy** (Deployments → … → Redeploy).

### MySQL on Vercel

- Use a hosted MySQL service (e.g. PlanetScale, Railway, Aiven) that allows connections from the internet.
- If your DB is behind a VPN or local, Vercel cannot reach it; use a cloud MySQL instance.
- For connection limits with serverless, consider a connection pooler or PlanetScale.

After `DATABASE_URL` is set and you redeploy, the "Environment variable not found" error should be resolved and the app will use your database.
