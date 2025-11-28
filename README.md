# Intelligent Home Food Assistant

A React-based web application for managing your home food inventory, tracking expiration dates, and generating recipes based on available ingredients.

## Features

- 📦 **Inventory Management**: Add, view, and manage your food items
- 📅 **Expiration Tracking**: Keep track of items that are expiring soon
- 🍳 **Recipe Generator**: Get recipe suggestions based on your available ingredients
- 🖼️ **Image Recognition**: Use AI to automatically identify food items from photos
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React** + **TypeScript**
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **OpenAI API** - Image recognition and recipe generation
- **Electron** - Desktop app support (optional)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/intelligent-home-food-assistant.git
cd intelligent-home-food-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run electron:dev` - Run Electron app in development
- `npm run electron:build` - Build Electron executable
- `npm run public` - Start public tunnel for sharing

## Deployment

### Vercel

The project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your OpenAI API key as an environment variable
4. Deploy!

### Electron

Build a desktop executable:
```bash
npm run electron:dist
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── services/       # API services
│   └── types.ts        # TypeScript types
├── electron/           # Electron main process
├── public/             # Static assets
└── dist/               # Build output
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

