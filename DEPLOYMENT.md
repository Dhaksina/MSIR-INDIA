# MSIR India - Hosting & GitHub Guide

This guide details how to deploy the **MSIR India** Next.js application to **Firebase Hosting** and push/sync your code with **GitHub**.

---

## Part 1: Save & Push to GitHub

### 1. Initialize Git (If not already initialized)
In your terminal, navigate to the project directory:
```bash
cd "/Users/rohithshankaran/msir india/msir-india"
git init -b main
```

### 2. Check Git Status
Verify that `.gitignore` is properly ignoring `node_modules`, `.next`, and `.env.local`:
```bash
git status
```

### 3. Stage and Commit Files
```bash
git add .
git commit -m "Initial commit: MSIR India Next.js calibration platform"
```

### 4. Link to GitHub and Push
1. Go to [GitHub](https://github.com/new) and create a new repository (e.g., `msir-india`).
2. Do **not** check "Initialize with README" or `.gitignore` (since we already created them).
3. Copy your repository URL and run:
```bash
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

---

## Part 2: Deploy to Firebase Hosting

Your project is already linked to Firebase project **`msir-cf75a`** via:
- `.firebaserc`
- `firebase.json`

### Option A: Deploy via Firebase CLI (Recommended)
From `msir-india/`, simply run:
```bash
npm run build
npx firebase-tools deploy --only hosting
```
Or if you have `firebase` in your PATH:
```bash
firebase deploy --only hosting
```

Your live website will be available at:
👉 **https://msir-cf75a.web.app**  
👉 **https://msir-cf75a.firebaseapp.com**

### Option B: Automated CI/CD Deployment with GitHub Actions
When you push code to GitHub, GitHub Actions can automatically build and deploy your site to Firebase Hosting:
1. Run in your terminal:
   ```bash
   npx firebase-tools init hosting:github
   ```
2. Follow the prompt to authorize GitHub and connect your repo.
3. Firebase will automatically add the deploy secrets and workflow files under `.github/workflows/`.

---

## Key Files Created
- **`firebase.json`**: Firebase hosting rules and framework configuration.
- **`.firebaserc`**: Sets the default Firebase project to `msir-cf75a`.
- **`.gitignore`**: Prevents secrets (`.env.local`), `node_modules/`, and build artifacts from leaking into GitHub.
- **`.env.example`**: Template showing the required Firebase client environment variables.
