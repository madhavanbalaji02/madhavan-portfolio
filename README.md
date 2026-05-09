# Madhavan Balaji - Portfolio Website

A modern, professional portfolio website built with React showcasing projects in Data Science, AI/ML, and IoT.

## Features

- ✨ Modern React architecture with hooks
- 🎨 Professional design with smooth animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and optimized performance
- 🎯 SEO-friendly structure
- 🚀 Easy to deploy

## Tech Stack

- **React 18** - UI library
- **React Hooks** - State management
- **CSS3** - Styling with modern features
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   └── [images and assets]
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Skills.js
│   │   ├── Experience.js
│   │   ├── Projects.js
│   │   ├── ProjectCard.js
│   │   ├── Stats.js
│   │   ├── Patent.js
│   │   ├── Contact.js
│   │   ├── Footer.js
│   │   ├── Loader.js
│   │   └── ParticlesCanvas.js
│   ├── hooks/
│   │   ├── useTypingEffect.js
│   │   └── useIntersectionObserver.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Deployment

### Deploy to Cloudflare Pages

1. Build the project:
```bash
npm run build
```

2. Upload the `build` folder to Cloudflare Pages

3. Set the build command: `npm run build`
4. Set the output directory: `build`

### Deploy to Other Platforms

The `build` folder contains static files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Customization

- Update personal information in component files
- Modify colors in `src/index.css` (CSS variables)
- Add/remove projects in `src/components/Projects.js`
- Update skills in `src/components/Skills.js`

## License

© 2026 Madhavan Balaji. All rights reserved.

