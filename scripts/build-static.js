#!/usr/bin/env node

/**
 * Build script to convert EJS templates to static HTML files
 * for deployment to GitHub Pages
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Configuration
const VIEWS_DIR = path.join(__dirname, '..', 'views');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Template data for rendering
const templateData = {
  title: 'Người bạn đồng hành tài chính thông minh',
  timestamp: Date.now(),
  additionalCSS: [],
  additionalJS: []
};

// Function to render EJS template to HTML
function renderTemplate(templatePath, outputPath, data) {
  try {
    console.log(`Rendering ${templatePath} -> ${outputPath}`);
    
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, data, {
      filename: templatePath,
      root: VIEWS_DIR
    });
    
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`✓ Successfully created ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error rendering ${templatePath}:`, error.message);
    throw error;
  }
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory ${src} does not exist, skipping...`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main build function
async function build() {
  console.log('='.repeat(60));
  console.log('Building static site for GitHub Pages deployment');
  console.log('='.repeat(60));

  try {
    // 1. Render index.ejs to index.html
    console.log('\n1. Rendering templates...');
    renderTemplate(
      path.join(VIEWS_DIR, 'index.ejs'),
      path.join(DIST_DIR, 'index.html'),
      templateData
    );

    // 2. Render changelog.ejs to changelog.html (if exists)
    const changelogPath = path.join(VIEWS_DIR, 'changelog.ejs');
    if (fs.existsSync(changelogPath)) {
      renderTemplate(
        changelogPath,
        path.join(DIST_DIR, 'changelog.html'),
        { ...templateData, title: 'Changelog' }
      );
    }

    // 3. Copy public directory to dist
    console.log('\n2. Copying public assets...');
    if (fs.existsSync(PUBLIC_DIR)) {
      copyDir(PUBLIC_DIR, DIST_DIR);
      console.log('✓ Public assets copied successfully');
    } else {
      console.log('! No public directory found, skipping...');
    }

    // 4. Create .nojekyll file to prevent Jekyll processing
    console.log('\n3. Creating .nojekyll file...');
    fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf-8');
    console.log('✓ .nojekyll file created');

    // 5. Create a simple 404 page
    console.log('\n4. Creating 404 page...');
    const html404 = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | FinTrack</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #4CAF50, #2196F3);
      color: white;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
    }
    h2 {
      font-size: 2rem;
      margin: 1rem 0;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    a {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: white;
      color: #4CAF50;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.3s ease;
    }
    a:hover {
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Trang không tồn tại</h2>
    <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
    <a href="/">Quay về trang chủ</a>
  </div>
</body>
</html>`;
    fs.writeFileSync(path.join(DIST_DIR, '404.html'), html404, 'utf-8');
    console.log('✓ 404 page created');

    console.log('\n' + '='.repeat(60));
    console.log('✓ Build completed successfully!');
    console.log('='.repeat(60));
    console.log(`\nOutput directory: ${DIST_DIR}`);
    console.log('\nYou can now deploy the dist directory to GitHub Pages');
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Build failed!');
    console.error('='.repeat(60));
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

// Run the build
build();
