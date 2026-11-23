# Pravy's Portfolio Website

This repository contains the code for my personal portfolio website, showcasing my work as an AI Software Developer specializing in Computer Vision and Large Language Models.

## Features

- **Interactive UI** with smooth animations using framer-motion
- **Responsive Design** - Optimized for all devices from desktop to mobile
- **Project Showcase** - Highlighting my key AI and ML projects
- **Education & Publications** - Featuring my academic background and research publications
- **Dark/Light Theme** - Modern and accessible design

## Technologies Used

- **React.js** - Frontend framework
- **Styled Components** - For component-based styling
- **Framer Motion** - For smooth animations and transitions
- **React Router** - For navigation
- **React Particles** - For background particle effects
- **GitHub Pages** - For hosting
- **React Bits, Threads** - The moving threads behind the hero and the closing section of the home page, used as published, with a licence notice added, under its MIT + Commons Clause licence (`src/components/vendor/react-bits/`). The built site carries the notice in the bundle's `.LICENSE.txt` file

## Sections

- **Home** - Introduction and navigation
- **About** - Professional background and expertise
- **Skills** - Technical abilities in AI, Computer Vision, and ML
- **Work** - Professional projects and achievements
- **Education** - Academic background and publications

## Deployment

The website is deployed using GitHub Pages and can be accessed at [impravin22.github.io/logicloomer-website](https://impravin22.github.io/logicloomer-website).

### Site layout

| URL | Source | What it is |
| --- | --- | --- |
| `/logicloomer-website/` | `src/`, `public/` | The portfolio, the React app (the home page) |
| `/logicloomer-website/map/` | `home/` | The Route So Far, the interactive map |
| `/logicloomer-website/Pravy_CV.pdf` | `public/` | The CV |
| `/logicloomer-website/in-short/` | `public/in-short/` | Redirect from the portfolio's earlier address |
| `/logicloomer-website/journey/` | `public/journey/` | Redirect from the map's first address |

`npm run build` runs `react-scripts build`, then `scripts/assemble-site.js` lays out `dist/`: the React build at the root and `home/` under `map/`. `npm run deploy` publishes `dist/`. `npm start` serves only the React app, so its Map link (one level down, under `map/`) does not resolve in development; serve `dist/` under `/logicloomer-website/` to try the whole site. To update the CV, replace `public/Pravy_CV.pdf` and keep the filename, so existing links stay valid. The two redirect pages run no script, so a link to a section under an old address, such as `/in-short/#work`, lands at the top of the page it is sent to.

### Maintaining the Website

To update the website:

1. Make your changes to the codebase
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Deploy the updated site:
   ```bash
   npm run deploy
   ```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Credits

- Original design template by [CodeBucks](https://github.com/codebucks27/react-portfolio-final)
- Modified and customized by Praveen Chittem
- Background photo by [Patrick Tomasso](https://unsplash.com/@impatrickt) on Unsplash
- 3D Spaceman illustration from Figma community

## License

MIT License
