# ThreadVibe

Transform social media threads into engaging blog posts with AI-powered style adaptation. Choose your vibe, generate SEO metadata, and get an AI image prompt for your blog cover—all with a modern, beautiful UI.

## Features
- **Modern UI**: Glassmorphism, gradients, smooth animations, and responsive design.
- **Vibe Selection**: Choose or customize the tone/style for your blog post.
- **SEO Metadata**: Automatically generates SEO title, description, and slug.
- **AI Image Prompt**: Get a ready-to-use prompt for AI image generators (DALL·E, Midjourney, etc.).
- **Copy/Download**: Easily copy or download your blog post in Markdown format.
- **Share to Platforms**: Quick-share buttons for Hashnode, Medium, Dev.to, Ghost, Notion, and WordPress.
- **Toasts**: Modern, animated notifications for actions and errors.

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Environment Variables
Create a `.env.local` file in the root directory and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Project Structure
- `src/app/` — Main Next.js app directory
- `src/lib/aiResponse.js` — AI prompt and response logic
- `src/app/page.js` — Main landing page and UI logic
- `src/app/api/generate/route.js` — API route for blog generation
- `src/components/ui/` — UI components (Button, Card, etc.)

## Customization
- **Favicon**: Uses the Sparkles logo as favicon (`src/app/favicon.ico`).
- **Branding**: Easily update colors, gradients, and icons in the UI components.

## Deployment
Deploy on [Vercel](https://vercel.com/) or any platform supporting Next.js 15+.

## License
[MIT](LICENSE)

---

**ThreadVibe** — Instantly turn threads into beautiful, SEO-ready blog posts in your own vibe!
