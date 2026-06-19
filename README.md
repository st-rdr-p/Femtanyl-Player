# Femtanyl Player

A lightweight offline MP3 player for your PC.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your music:**
   Place your MP3 files in the `music/` directory:
   ```
   music/
   ├── Song 1.mp3
   ├── Song 2.mp3
   └── ... (your 25 MP3 files)
   ```

3. **Run the app:**
   ```bash
   npm start
   ```

## Building

Create a standalone executable:

```bash
npm run build
```

This generates `.exe` installer and portable executable in the `out/` directory.

## Features

- 🎵 Play embedded MP3 files offline
- ⏯️ Play, pause, skip, and seek
- 📋 Auto-populated playlist from music directory
- 🎨 Dark theme UI
- 💾 No external dependencies needed

## Requirements

- Node.js 16+
- Your MP3 files
