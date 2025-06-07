# Chess Tutor

An interactive chess learning application built with Next.js, featuring puzzles, opening practice, and multiple themes.

## Features

- **🧩 Chess Puzzles**: 20 carefully crafted puzzles covering tactics, openings, and endgames
- **📚 Opening Practice**: Learn major chess openings with interactive practice
- **🎨 Multiple Themes**: 5 beautiful themes (Light, Dark, Ocean Blue, Royal Purple, Forest Green)
- **💡 Hint System**: Get visual hints with arrows pointing to the best moves
- **🤖 Computer Responses**: Automatic opponent moves for realistic puzzle solving
- **📊 Progress Tracking**: Track your puzzle-solving progress
- **♟️ Interactive Chess Board**: Drag-and-drop piece movement with move validation

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **chess.js** - Chess game logic and move validation
- **react-chessboard** - Interactive chess board component

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app/puzzles` - Chess puzzle solving interface
- `/app/openings` - Opening practice system
- `/app/components` - Reusable React components
- `/app/contexts` - React context for theme management

## How to Play

1. **Puzzles**: Select a puzzle from the grid, make the best move for your color
2. **Openings**: Choose an opening family, then a specific variation to practice
3. **Themes**: Use the theme switcher to customize your experience

## Contributing

Feel free to submit issues and pull requests to improve the chess tutor!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
