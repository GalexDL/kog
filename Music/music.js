document.addEventListener("DOMContentLoaded", () => {

  // ─── MP3 Player State ────────────────────────────────────────────────────
  let albums = [];
  let MP3PAlbumIdx = 0, MP3PTrackIdx = 0;
  let MP3PIsPlaying = false;

  // ─── DOM Elements ────────────────────────────────────────────────────────
  const audioEl       = document.getElementById("MusicQuizAudio");
  const musicBG       = document.getElementById("MusicQuizBG");
  const MP3PArt       = document.getElementById("MP3PArt");
  const MP3PTitleEl   = document.getElementById("MP3PTrackTitle");
  const MP3PAlbumEl   = document.getElementById("MP3PAlbumName");
  const MP3PCurrentEl = document.getElementById("MP3PCurrentTime");
  const MP3PDurEl     = document.getElementById("MP3PDuration");
  const MP3PBarWrap   = document.getElementById("MP3PBarWrap");
  const MP3PBarFill   = document.getElementById("MP3PBarFill");
  const MP3PBarThumb  = document.getElementById("MP3PBarThumb");
  const MP3PPlayPause = document.getElementById("MP3PPlayPauseBtn");
  const MP3PPlayIcon  = document.getElementById("MP3PPlayIcon");
  const MP3PPauseIcon = document.getElementById("MP3PPauseIcon");
  const MP3PPrevBtn   = document.getElementById("MP3PPrevBtn");
  const MP3PNextBtn   = document.getElementById("MP3PNextBtn");
  const MP3PAlbumRail = document.getElementById("MP3PAlbumRail");
  const MP3PTrackList = document.getElementById("MP3PTrackList");

  if (!audioEl) return;
  audioEl.preload = "auto";

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const fmtTime = s => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  function setBackground(bg) {
    if (!musicBG) return;
    musicBG.style.backgroundImage = bg ? `url("${bg}")` : "";
    musicBG.style.opacity = bg ? "0.75" : "0";
  }

  // ─── MP3 Player Logic ────────────────────────────────────────────────────
  function MP3PUpdatePlayBtn() {
    if (MP3PPlayIcon)  MP3PPlayIcon.style.display  = MP3PIsPlaying ? "none" : "";
    if (MP3PPauseIcon) MP3PPauseIcon.style.display = MP3PIsPlaying ? ""     : "none";
  }

  function MP3PLoadTrack(idx, autoplay) {
    MP3PTrackIdx = idx;
    const album = albums[MP3PAlbumIdx];
    const track = album?.tracks[idx];
    if (!track) return;

    if (MP3PTitleEl)   MP3PTitleEl.textContent   = track.title;
    if (MP3PAlbumEl)   MP3PAlbumEl.textContent   = album.album;
    if (MP3PCurrentEl) MP3PCurrentEl.textContent = "0:00";
    if (MP3PDurEl)     MP3PDurEl.textContent     = "0:00";
    if (MP3PBarFill)   MP3PBarFill.style.width   = "0%";
    if (MP3PBarThumb)  MP3PBarThumb.style.left   = "0%";

    MP3PTrackList?.querySelectorAll(".MP3PTrackItem").forEach((row, i) => {
      row.classList.toggle("active", i === idx);
      if (i === idx) row.scrollIntoView({ block: "nearest" });
    });

    audioEl.pause();
    audioEl.src = "assets/" + track.file;
    audioEl.currentTime = 0;

    if (autoplay) {
      audioEl.addEventListener("canplay", () => {
        audioEl.play().then(() => { MP3PIsPlaying = true; MP3PUpdatePlayBtn(); }).catch(() => {});
      }, { once: true });
    } else {
      MP3PIsPlaying = false;
      MP3PUpdatePlayBtn();
    }
  }

  function MP3PLoadAlbum(albumIdx, autoplay) {
    MP3PAlbumIdx = albumIdx;
    const album = albums[albumIdx];
    if (!album) return;

    setBackground(album.background ? "assets/" + album.background : null);
    if (MP3PArt) MP3PArt.src = album.cover ? "assets/" + album.cover : "";

    MP3PAlbumRail?.querySelectorAll(".MP3PAlbumTile").forEach((tile, i) => {
      tile.classList.toggle("active", i === albumIdx);
    });

    if (MP3PTrackList) {
      MP3PTrackList.innerHTML = "";
      (album.tracks || []).forEach((t, i) => {
        const row = document.createElement("div");
        row.className = "MP3PTrackItem";
        row.innerHTML = `<span class="MP3PTrackNum">${i + 1}</span><span class="MP3PTrackName">${t.title}</span>`;
        row.addEventListener("click", () => MP3PLoadTrack(i, true));
        MP3PTrackList.appendChild(row);
      });
    }
    MP3PLoadTrack(0, autoplay);
  }

  function buildAlbumRail() {
    if (!MP3PAlbumRail) return;
    MP3PAlbumRail.innerHTML = "";
    albums.forEach((album, i) => {
      const tile = document.createElement("div");
      tile.className = "MP3PAlbumTile";
      tile.innerHTML = `<img src="assets/${album.cover || ""}" alt=""><div class="MP3PAlbumTileLabel">${album.album}</div>`;
      tile.addEventListener("click", () => MP3PLoadAlbum(i, false));
      MP3PAlbumRail.appendChild(tile);
    });
  }

  // ─── Audio Event Listeners ───────────────────────────────────────────────
  audioEl.addEventListener("timeupdate", () => {
    const cur = audioEl.currentTime, dur = audioEl.duration || 0;
    if (MP3PCurrentEl) MP3PCurrentEl.textContent = fmtTime(cur);
    if (MP3PDurEl)     MP3PDurEl.textContent     = fmtTime(dur);
    const pct = dur > 0 ? (cur / dur * 100) : 0;
    if (MP3PBarFill)   MP3PBarFill.style.width   = pct + "%";
    if (MP3PBarThumb)  MP3PBarThumb.style.left   = pct + "%";
  });

  audioEl.addEventListener("ended", () => {
    const album = albums[MP3PAlbumIdx];
    if (album && MP3PTrackIdx + 1 < album.tracks.length) {
      MP3PLoadTrack(MP3PTrackIdx + 1, true);
    } else {
      MP3PIsPlaying = false;
      MP3PUpdatePlayBtn();
    }
  });

  // ─── Controls Event Listeners ────────────────────────────────────────────
  MP3PPlayPause?.addEventListener("click", () => {
    if (audioEl.paused) {
      audioEl.play().then(() => { MP3PIsPlaying = true; MP3PUpdatePlayBtn(); }).catch(() => {});
    } else {
      audioEl.pause();
      MP3PIsPlaying = false;
      MP3PUpdatePlayBtn();
    }
  });

  MP3PPrevBtn?.addEventListener("click", () => { 
    if (MP3PTrackIdx > 0) MP3PLoadTrack(MP3PTrackIdx - 1, true); 
  });

  MP3PNextBtn?.addEventListener("click", () => {
    const album = albums[MP3PAlbumIdx];
    if (album && MP3PTrackIdx + 1 < album.tracks.length) MP3PLoadTrack(MP3PTrackIdx + 1, true);
  });

  MP3PBarWrap?.addEventListener("click", e => {
    const dur = audioEl.duration || 0;
    if (!dur) return;
    const rect = MP3PBarWrap.getBoundingClientRect();
    audioEl.currentTime = Math.max(0, Math.min((e.clientX - rect.left) / rect.width * dur, dur));
  });

  // ─── Initialization ──────────────────────────────────────────────────────
  function initPlayer() {
    fetch(`assets/tracks.json`)
      .then(r => r.json())
      .then(data => {
        albums = data || [];
        buildAlbumRail();
        if (albums.length > 0) {
          MP3PLoadAlbum(0, false);
        }
      })
      .catch(() => { albums = []; });
  }

  const musicPage = document.getElementById("page-musicquiz");
  if (musicPage) {
    new MutationObserver(() => {
      if (musicPage.style.display !== "none") {
        audioEl.pause();
        initPlayer();
      } else {
        setBackground(null);
        audioEl.pause();
        MP3PIsPlaying = false;
        MP3PUpdatePlayBtn();
      }
    }).observe(musicPage, { attributes: true, attributeFilter: ["style"] });
    initPlayer();
  } else {
    initPlayer();
  }
    // ─── 3D Hover Tilt Logic ──────────────────────────────────────────────────────
    const tiltElements = document.querySelectorAll('.tilt-effect');
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; 
        const rotateY = ((x - centerX) / centerX) * 15;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
});