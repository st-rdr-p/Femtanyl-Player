import { contextBridge, ipcRenderer } from 'electron';
import path from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, 'music');

function getMusicFiles() {
  try {
    const files = readdirSync(musicDir).filter(file =>
      /\.(mp3|wav|flac|m4a)$/i.test(file)
    );
    return files.map(file => ({
      name: file,
      path: `file://${path.join(musicDir, file).replace(/\\/g, '/')}`,
    }));
  } catch (err) {
    console.error('Error reading music directory:', err);
    return [];
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  getMusicFiles,
});
