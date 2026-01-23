# 🌐 The Professional Way: Automated Deployment with GitHub

You asked for a **"more permanent way"**. The industry standard is to link your computer to **GitHub** and connect GitHub to **Netlify**.

## 🌟 Why is this better?
1.  **Automatic Updates**: Every time you save a change on your computer and "push" it, the website updates automatically. No more dragging folders.
2.  **Backup**: Your code is safely stored in the cloud (GitHub). If you lose your computer, you don't lose your website.
3.  **Teamwork**: You can invite others to work on the code.

---

## 🚀 Setup Guide (Takes ~10 Minutes)

### Step 1: Create a GitHub Account
1.  Go to [GitHub.com](https://github.com/) and sign up (free).
2.  Verify your email address.

### Step 2: Create a Repository
1.  Log in to GitHub.
2.  Click the **+** icon in the top right → **New repository**.
3.  **Repository name**: `apex-leads-website` (or similar).
4.  **Visibility**: Choose **Public** (Free) or **Private** (Free).
5.  Click **Create repository**.
6.  **Copy the URL** that looks like: `https://github.com/YourUsername/apex-leads-website.git`

### Step 3: Connect Your Code (Terminal)
Mac has `git` installed by default. Open your **Terminal** and paste these commands one by one:

```bash
# 1. Navitagte to your folder
cd "/Users/moazzinzaman/Desktop/CODING AI/MZ LEAD GEN WEB"

# 2. Add your GitHub URL (Replace URL with your actual one!)
git remote add origin https://github.com/YourUsername/apex-leads-website.git

# 3. Rename branch to main
git branch -M main

# 4. Save your changes locally
git add .
git commit -m "First upload of Apex Leads"

# 5. Push to GitHub (You may be asked to sign in)
git push -u origin main
```

*Note: If `git push` fails due to authentication, you may need to set up a Personal Access Token or use the GitHub Desktop app (easier).*

### Step 4: Connect Netlify to GitHub
1.  Go to your **Netlify Dashboard**.
2.  Click **"Add new site"** → **"Import from an existing project"**.
3.  Click **"GitHub"**.
4.  Authorize Netlify to access your GitHub.
5.  Select your new repository (`apex-leads-website`).
6.  Click **"Deploy Site"**.

## 🎉 Done!
From now on, whenever you make changes:
1.  Open Terminal.
2.  Run: `git add .`
3.  Run: `git commit -m "Updated site"`
4.  Run: `git push`
5.  **Netlify will update your live site automatically in seconds.**
