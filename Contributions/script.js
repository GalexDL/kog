const SOCIAL_ICONS = {
  github: `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>`,
  twitter: `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/></svg>`,
  discord: `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg>`,
};

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildContribRow(member) {
  const socialHTML = (member.socials || [])
    .map((s) => {
      const icon = SOCIAL_ICONS[String(s.platform || "").toLowerCase()] || "";
      return `<a class="contrib-social-link" href="${escapeHtml(s.url || "#")}" target="_blank" rel="noopener noreferrer">${icon}${escapeHtml(s.platform || "Link")}</a>`;
    })
    .join("");

  const avatarHTML = member.avatar
    ? `<img class="contrib-avatar contrib-avatar-img" src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.name || "Contributor")}" loading="lazy">`
    : `<div class="contrib-avatar">${escapeHtml(member.initial || "?")}</div>`;

  const badge = member.badge === "lead" ? "Lead" : "Community";

  return `<div class="contrib-row">
    ${avatarHTML}
    <div class="contrib-info">
      <div class="contrib-name">${escapeHtml(member.name || "Unknown")}</div>
      <div class="contrib-role">${escapeHtml(member.role || "")}</div>
      ${socialHTML ? `<div class="contrib-socials">${socialHTML}</div>` : ""}
    </div>
    <span class="contrib-badge ${escapeHtml(member.badge || "community")}">${badge}</span>
  </div>`;
}

function buildPatchEntry(note) {
  const category = String(note.category || "other").toLowerCase();
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const notesHtml = (note.notes || [])
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");

  return `<div class="patch-entry" data-category="${escapeHtml(category)}">
    <div class="patch-entry-header">
      <span class="patch-version">${escapeHtml(note.version || "v0.0.0")}</span>
      <span class="patch-date">${escapeHtml(note.date || "Unknown date")}</span>
      <span class="patch-category-tag tag-${escapeHtml(category)}">${escapeHtml(categoryLabel)}</span>
    </div>
    <ul class="patch-notes">${notesHtml}</ul>
  </div>`;
}

async function fetchFirstJson(candidates) {
  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (res.ok) {
        return res.json();
      }
    } catch (_) {
      // Ignore and try next candidate.
    }
  }
  return null;
}

function initPatchFilters() {
  const filterBtns = document.querySelectorAll(".patch-filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const entries = document.querySelectorAll(".patch-entry[data-category]");
      entries.forEach((entry) => {
        entry.classList.toggle("hidden", filter !== "all" && entry.dataset.category !== filter);
      });
    });
  });
}

const SOURCE_ICONS = {
  file:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/></svg>`,
  archive:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/></svg>`,
  reference: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/></svg>`,
};

function buildSourceEntry(source) {
  const type = String(source.type || "file").toLowerCase();
  const icon = SOURCE_ICONS[type] || SOURCE_ICONS.file;
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  const nameHtml = source.url
    ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name || "")}</a>`
    : escapeHtml(source.name || "");

  return `<div class="source-entry">
    <div class="source-icon">${icon}</div>
    <div class="source-info">
      <div class="source-name">${nameHtml}</div>
      <div class="source-desc">${escapeHtml(source.description || "")}</div>
    </div>
    <span class="source-type-tag">${escapeHtml(label)}</span>
  </div>`;
}

async function initContributionsPage() {
  const team = await fetchFirstJson(["./team.json", "../Contributions/team.json"]);
  if (Array.isArray(team)) {
    const list = document.getElementById("contrib-list");
    if (list) {
      list.innerHTML = team.map(buildContribRow).join("");
    }

    const realCount = team.filter((m) => m.name !== "You?").length;
    const countEl = document.getElementById("contrib-count");
    if (countEl) {
      countEl.textContent = String(realCount);
    }
  }

  const patchNotes = await fetchFirstJson(["./patchnotes.json", "../Contributions/patchnotes.json"]);
  if (Array.isArray(patchNotes)) {
    const patchList = document.getElementById("patch-list");
    if (patchList) {
      patchList.innerHTML = patchNotes.map(buildPatchEntry).join("");
    }
  }

  const sources = await fetchFirstJson(["./sources.json", "../Contributions/sources.json"]);
  if (Array.isArray(sources)) {
    const sourceList = document.getElementById("source-list");
    if (sourceList) {
      sourceList.innerHTML = sources.map(buildSourceEntry).join("");
    }
  }

  initPatchFilters();
}

document.addEventListener("DOMContentLoaded", initContributionsPage);
