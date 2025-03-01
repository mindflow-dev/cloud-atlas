# CloudAtlas

CloudAtlas is a sleek, intuitive, frontend-only web application that helps users quickly identify which AWS regions support specific cloud services, powered by real-time data directly from AWS's official regional endpoint JSON.

## Features

- **Real-time AWS Data**: Fetches data directly from AWS's official regional endpoint JSON
- **Intuitive Search**: Quickly find AWS services with autocomplete suggestions
- **Region Filtering**: Filter regions by supported/unsupported status
- **Responsive Design**: Works on desktop and mobile devices
- **Lightweight**: Fast loading and minimal bundle size

## Technology Stack

- **Language**: TypeScript
- **Frontend Framework**: React (Hooks-based)
- **Styling**: Tailwind CSS
- **HTTP Requests**: Axios
- **Icons**: React Icons
- **Font**: Inter (via Google Fonts)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cloudatlas.git
   cd cloudatlas
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```bash
npm run build
# or
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This application is designed to be deployed on static hosting platforms like GitHub Pages, Netlify, or Vercel.

### Deploying to GitHub Pages

1. Update the `base` property in `vite.config.ts` to match your repository name:
   ```typescript
   base: '/cloudatlas/'
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- AWS for providing the regional endpoint data
- The React and Tailwind CSS communities for their excellent documentation
