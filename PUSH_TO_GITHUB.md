# 📤 Push to GitHub Instructions

Your local repository is ready! Follow these steps to push to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** button in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `movieflix-moengage` (or your preferred name)
   - **Description**: "Full-stack movie discovery platform with Spring Boot backend and React frontend - MoEngage Assignment"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Link Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify the remote was added
git remote -v
```

## Step 3: Push Your Code

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Alternative: Using SSH (Recommended for Regular Use)

If you have SSH keys set up:

```bash
# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Push
git branch -M main
git push -u origin main
```

## Quick Commands (Copy & Paste)

Once you have your repository URL from GitHub:

```bash
# Replace with your actual GitHub URL
git remote add origin https://github.com/YOUR_USERNAME/movieflix-moengage.git
git branch -M main
git push -u origin main
```

## What Gets Pushed

✅ **Included:**
- All backend code (movieflix-backend/)
- All frontend code (movieflix-frontend/)
- Documentation files
- Docker configuration
- .gitignore

❌ **Excluded (by .gitignore):**
- node_modules/
- target/ (Maven build files)
- .env files (sensitive data)
- IDE-specific files
- Build artifacts

## After Pushing

Your repository will be live at:
```
https://github.com/YOUR_USERNAME/REPO_NAME
```

### Add Repository Badges (Optional)

Add these to your README.md for a professional look:

```markdown
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

**Option 1: Use Personal Access Token (PAT)**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use token as password when pushing

**Option 2: Use GitHub CLI**
```bash
gh auth login
```

### Already have a remote?

If you see "remote origin already exists":
```bash
git remote remove origin
git remote add origin YOUR_NEW_URL
```

## Next Steps

After pushing to GitHub:

1. ✅ Enable GitHub Pages for frontend (if needed)
2. ✅ Set up GitHub Actions for CI/CD (optional)
3. ✅ Add collaborators (Settings → Collaborators)
4. ✅ Update README with live demo links
5. ✅ Add topics/tags to your repository

## Example Complete Flow

```bash
# 1. Create repo on GitHub named "movieflix-moengage"
# 2. Run these commands:

git remote add origin https://github.com/YOUR_USERNAME/movieflix-moengage.git
git branch -M main
git push -u origin main

# ✅ Done! Your code is on GitHub!
```

## Need Help?

- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/doc
- GitHub CLI: https://cli.github.com

---

**Note:** Remember to replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repository name!

