# GitHub Repository Setup

Follow these steps to create and connect your GitHub repository.

## Option 1: Using GitHub CLI (Recommended)

If you have GitHub CLI installed:

```bash
cd /Users/travissmith/nml-workout-selector

# Create repository and push
gh repo create nml-workout-selector --public --source=. --remote=origin --push
```

## Option 2: Manual Setup

### Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `nml-workout-selector` (or your preferred name)
3. Description: "Mobile-first workout picker for Nourish Move Love YouTube videos"
4. Choose **Public** or **Private**
5. **DO NOT** check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (We already have these files)

6. Click **"Create repository"**

### Step 2: Connect Local Repository

After creating the repo, GitHub will show you commands. Use these:

```bash
cd /Users/travissmith/nml-workout-selector

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nml-workout-selector.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify

1. Go to your repository on GitHub
2. You should see all your files
3. The README should be visible

## Next Steps

After pushing to GitHub, proceed to **Vercel Setup** in `SETUP_GUIDE.md`

