# Build and Deployment Guide

## Overview

This project can be built as both a **server-side Express application** and a **static site for GitHub Pages**.

## Static Site Build (for GitHub Pages)

### Building Locally

```bash
# Install dependencies
npm install

# Build static site
npm run build

# Output will be in the dist/ directory
```

### What Gets Built

The build process:
1. Converts EJS templates to static HTML files
2. Copies all public assets (CSS, JS, images) to dist/
3. Creates a `.nojekyll` file to prevent Jekyll processing
4. Generates a custom 404 page

### Output Structure

```
dist/
├── index.html           # Main landing page
├── changelog.html       # Changelog page
├── 404.html            # Custom 404 page
├── .nojekyll           # Prevents GitHub Pages Jekyll processing
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── libs/               # Third-party libraries (Bootstrap)
├── images/             # Images and icons
└── manifest.json       # PWA manifest
```

### Deployment to GitHub Pages

The project includes a GitHub Actions workflow (`.github/workflows/html-static.yml`) that automatically:
1. Builds the static site on push to main branch
2. Deploys the dist/ directory to the `gh-pages` branch

#### Manual Deployment

You can also manually deploy:

```bash
# Build the site
npm run build

# Deploy to gh-pages branch (requires gh-pages package)
npx gh-pages -d dist
```

## Server-Side Build (for Node.js hosting)

If you want to run this as an Express server:

```bash
# Build server application
npm run build:server

# Start the server
npm start

# Development mode with hot reload
npm run dev
```

## Available Scripts

- `npm run build` - Build static site (default)
- `npm run build:static` - Build static site explicitly
- `npm run build:server` - Build server-side application
- `npm run clean` - Clean dist/ directory
- `npm start` - Start server (requires build:server first)
- `npm run dev` - Development mode with hot reload
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Environment Variables

For server-side deployment, copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your settings
```

For static site deployment, no environment variables are needed as it's client-side only.

## GitHub Pages Configuration

### Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select branch: `gh-pages`
5. Select folder: `/ (root)`

### Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain in repository settings > Pages > Custom domain
2. Update the workflow file to include your domain:

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    publish_branch: gh-pages
    force_orphan: true
    cname: yourdomain.com  # Add your custom domain here
```

## Troubleshooting

### Build Fails

1. Ensure you're using Node.js 18 or higher
2. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
3. Clean dist directory: `npm run clean`

### Assets Not Loading on GitHub Pages

1. Check that paths in HTML are relative (starting with `/`)
2. Ensure `.nojekyll` file is present in dist/
3. Verify the gh-pages branch has all files from dist/

### Bootstrap CSS Not Loading

The Bootstrap CSS files are referenced but empty by default. They can be:
1. Downloaded from CDN during build (requires network access)
2. Loaded from CDN in the HTML (already configured as fallback)
3. Installed via npm and copied to dist/ (for offline support)

## Development Notes

- EJS templates are in `views/`
- Static assets are in `public/`
- Build script is in `scripts/build-static.js`
- The build process uses the `ejs` package to render templates
- Bootstrap CSS is loaded from CDN as fallback

## License

MIT
