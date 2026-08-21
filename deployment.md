# Deploying to Vercel (free plan)

A complete, click-by-click guide for someone who has never deployed a website
before. It takes about 15 minutes.

This site needs no build step, no database, and no server code — it's plain
HTML, CSS and JavaScript. That makes it about as simple as a deployment gets.

---

## Before you start

You'll need two free accounts. Create them now if you don't have them —
everything below assumes you're signed in to both.

1. **GitHub** — [github.com/signup](https://github.com/signup). This is where
   your website's code will live. It's free forever for a project like this.
2. **Vercel** — [vercel.com/signup](https://vercel.com/signup). When it asks
   how you want to sign up, choose **"Continue with GitHub"** — this links the
   two accounts immediately and saves you a step later.

You do **not** need to install anything on your computer for this guide — no
Node.js, no command-line tools. Everything happens in the browser except two
short steps in Terminal to upload your code the first time.

---

## Step 1 — Put the project on GitHub

Vercel deploys from a GitHub repository. First we need to get this folder
onto GitHub.

### 1a. Create the repository on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** `simanpower-website` (or anything you like).
3. Leave it set to **Public** (or Private — either works with Vercel's free
   plan; Private just means strangers can't browse your code on GitHub).
4. **Do not** check "Add a README" or any other initialize option — leave
   the repository completely empty. We already have all the files.
5. Click **Create repository**.
6. GitHub shows you a page with some commands. Leave that tab open — you'll
   need the URL near the top, which looks like:
   `https://github.com/your-username/simanpower-website.git`

### 1b. Upload this folder to it

Open **Terminal** (on a Mac: press `Cmd + Space`, type `Terminal`, press
Enter). Then run these commands one at a time. Replace the URL in the last
command with the one from your own GitHub page.

```bash
cd /Users/abhisheksaurav/Documents/simanpower_v4

git init
git add .
git commit -m "Initial commit — Sagar International Manpower website"
git branch -M main
git remote add origin https://github.com/your-username/simanpower-website.git
git push -u origin main
```

A few notes on what's happening:

- `git init` turns this folder into a project Git can track.
- `git add .` stages every file in the folder to be saved.
- `git commit` takes a snapshot of everything, with a short message describing it.
- `git push` uploads that snapshot to the GitHub repository you just created.

If `git push` asks you to log in, a browser window will usually pop up asking
you to authorize Git — click **Authorize**. If it instead asks for a username
and password in the terminal, GitHub no longer accepts your account password
there; you'll need a **Personal Access Token** instead. GitHub will show a
link to create one right in the error message — follow it, generate a token
with the "repo" permission, and paste that token in as the password.

When it finishes, refresh your GitHub repository page in the browser — you
should see all the project files listed there.

---

## Step 2 — Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Under "Import Git Repository," find `simanpower-website` in the list and
   click **Import**. (If you don't see it, click **Adjust GitHub App
   Permissions** and grant Vercel access to the repository.)
3. On the configuration screen:
   - **Framework Preset:** Vercel usually detects this correctly as
     **"Other"** — leave it as is. Do not pick Next.js, React, or anything
     else from that list; this site isn't built with any of them.
   - **Root Directory:** leave as `./` (the default).
   - **Build Command:** leave this **empty** / toggled off. There is nothing
     to build.
   - **Output Directory:** leave as the default (`./` or blank). Vercel will
     serve the HTML files directly from the repository root.
   - **Environment Variables:** none needed — skip this section entirely.
4. Click **Deploy**.

Vercel will show a short progress screen (this takes well under a minute
since there's no build step) and then a confetti animation with your live
URL — something like `simanpower-website.vercel.app`.

5. Click that URL, or the **Visit** button, to see your live site.

Click through a few pages (Home, About, Contact) to confirm everything loads
and looks right.

---

## Step 3 — Every future update is automatic

This is the part that makes GitHub + Vercel worth the initial setup: from now
on, whenever you want to change something on the site —

1. Edit the file(s) on your computer.
2. In Terminal, from the project folder, run:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push
   ```
3. Vercel notices the push automatically and redeploys the site — usually
   live again within 30–60 seconds. No dashboard clicking required.

You can watch each deployment happen on your project's page at
[vercel.com/dashboard](https://vercel.com/dashboard).

---

## Step 4 (optional) — Use your own domain

Right now the site lives at a free `*.vercel.app` address. To serve it from
**simanpower.in** instead:

1. On your Vercel project page, open the **Settings** tab, then **Domains**.
2. Type `simanpower.in` and click **Add**. Do the same for `www.simanpower.in`
   if you want both to work.
3. Vercel shows you one or two DNS records to add — typically an **A record**
   pointing to an IP address, or a **CNAME** pointing to
   `cname.vercel-dns.com`. The exact values are shown on that screen.
4. Log in to wherever you registered `simanpower.in` (GoDaddy, Namecheap,
   BigRock, or similar — check your original purchase email if you're not
   sure) and find its **DNS settings** or **DNS management** page.
5. Add the record(s) exactly as Vercel showed you.
6. Return to the Vercel Domains screen — it will show a green checkmark once
   the DNS change is detected. This can take anywhere from a few minutes to
   a few hours, depending on your domain registrar.

Vercel issues a free SSL certificate automatically once the domain is
verified — you don't need to do anything extra for `https://` to work.

---

## What's already handled for you

- **`.vercelignore`** is included in this project. It keeps a few internal
  files — the page source templates in `_src/`, `build.py`, the internal
  `updated_company_info.json` data file (which has staff phone numbers and
  the full client list), and this project's `README.md` — out of the public
  deployment. Nothing the live site needs is excluded; only files a visitor
  should never be able to find by guessing a URL.
- **No configuration file (`vercel.json`) is needed.** This is a plain static
  site with `.html` files that link to each other directly
  (`href="about.html"`, etc.), so Vercel's zero-config static hosting handles
  it exactly as-is — no redirects or rewrites to set up.
- **No environment variables, database, or server code** — so there is
  nothing that can leak a secret key or fail because a service is down. It
  is about as low-maintenance as a website can be.

---

## Troubleshooting

**"Repository not found" when importing to Vercel**
Make sure Step 1b actually finished — go back to your GitHub repository page
in the browser and confirm you can see the files. If GitHub's page is still
empty, the `git push` didn't complete; re-run it and check for an error
message in Terminal.

**The deployed site looks broken / images are missing**
Open the live URL, right-click anywhere on the page, choose **Inspect**, and
click the **Console** tab. Any errors about a file failing to load (a red
"404" line) tell you the exact missing file and path — check that the file
exists in the GitHub repository with that exact name and folder. File names
are **case-sensitive** on Vercel even though they may not be on your Mac —
`Logo.png` and `logo.png` are different files there.

**I edited a file but the live site didn't change**
You likely edited the file but didn't run `git add . && git commit && git push`
afterward (Step 3). Only pushed changes reach Vercel — saving the file on
your computer alone does nothing to the live site.

**`git push` asks for a password and rejects it**
See the note at the end of Step 1b — GitHub requires a Personal Access Token
instead of your account password for this. The error message in Terminal
includes a direct link to create one.

**I want to remove the site from the internet**
On the Vercel dashboard, open the project → **Settings** → scroll to the
bottom → **Delete Project**. This does not delete your code — it only stays
on GitHub — so you can redeploy at any time by importing it again.
