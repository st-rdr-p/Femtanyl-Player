const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const playlistEl = document.getElementById('playlist');
const audio = document.getElementById('audio');
const trackTitle = document.getElementById('trackTitle');
const trackStatus = document.getElementById('trackStatus');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let tracks = [];
let activeIndex = -1;
let isElectron = typeof window !== 'undefined' && window.electronAPI;

function formatTime(seconds) {
  if (Number.isNaN(seconds) || seconds === Infinity) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateButtons() {
  prevBtn.disabled = activeIndex <= 0;
  nextBtn.disabled = activeIndex === -1 || activeIndex >= tracks.length - 1;
}

function setActiveTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  activeIndex = index;
  const track = tracks[index];

  playlistEl.querySelectorAll('li').forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });

  audio.src = track.url;
  trackTitle.textContent = track.name;
  trackStatus.textContent = `Track ${index + 1} of ${tracks.length}`;
  audio.play().catch(() => {
    trackStatus.textContent = 'Click play to start';
  });
  updateButtons();
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  tracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.dataset.index = index;
    li.addEventListener('click', () => setActiveTrack(index));
    playlistEl.appendChild(li);
  });
  updateButtons();
}

function handleFiles(fileList) {
  const mp3Files = Array.from(fileList).filter(file => file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3'));
  if (!mp3Files.length) {
    trackStatus.textContent = 'No MP3 files found. Please select MP3 files.';
    return;
  }

  tracks = mp3Files.map(file => ({
    name: file.name,
    file,
    url: URL.createObjectURL(file),
  }));

  renderPlaylist();
  setActiveTrack(0);
}

function loadEmbeddedTracks(musicFiles) {
  if (!musicFiles || !musicFiles.length) {
    trackStatus.textContent = 'No music files found in bundle.';
    return;
  }

  tracks = musicFiles.map(file => ({
    name: file.name,
    url: file.path,
  }));

  renderPlaylist();
  setActiveTrack(0);
}

// Load embedded music files on startup if in Electron
if (isElectron) {
  document.getElementById('loaderSection').style.display = 'none';
  window.electronAPI.getMusicFiles().then(musicFiles => {
    loadEmbeddedTracks(musicFiles);
  });
} else {
  // Show file picker if not in Electron
  fileInput.addEventListener('change', event => {
    handleFiles(event.target.files);
  });

  dropZone.addEventListener('dragenter', event => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragover', event => {
    event.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', event => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(event.dataTransfer.files);
  });
}

audio.addEventListener('timeupdate', () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (activeIndex < tracks.length - 1) {
    setActiveTrack(activeIndex + 1);
  } else {
    trackStatus.textContent = 'Playlist ended.';
  }
});

progressBar.addEv && track.url.startsWith('blob:')) URL.revokeObjectURL(track.url);
  });
});

// Load embedded music files on startup if in Electron
if (isElectron) {
  window.electronAPI.getMusicFiles().then(musicFiles => {
    loadEmbeddedTracks(musicFiles);
  });
}udio.currentTime = (progressBar.value / 100) * audio.duration;
});

prevBtn.addEventListener('click', () => {
  if (activeIndex > 0) setActiveTrack(activeIndex - 1);
});

nextBtn.addEventListener('click', () => {
  if (activeIndex < tracks.length - 1) setActiveTrack(activeIndex + 1);
});

window.addEventListener('beforeunload', () => {
  tracks.forEach(track => {
    if (track.url) URL.revokeObjectURL(track.url);
  });
});
