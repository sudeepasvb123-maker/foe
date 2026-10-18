/**
 * Faculty of Engineering Announcements & Bulletin Portal
 * University of Sri Jayewardenepura
 */

// Supabase Configuration
const SUPABASE_URL = 'https://zzirxpncvhqxhcjgbuek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aXJ4cG5jdmhxeGhjamdidWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyOTEwMzAsImV4cCI6MjEwNzg2NzAzMH0.oT1wh1i_9J3ly7yJ9Po1okGiUUmlcyUIAaRfxmFSUtM';

// Application State
const state = {
  activeTab: 'overview',
  items: [],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
  bookmarkedIds: new Set(JSON.parse(localStorage.getItem('sjp_bookmarks') || '[]')),
  selectedItem: null,
  isLoading: true
};

// DOM Elements
const grid = document.getElementById('announcements-grid');
const skeleton = document.getElementById('loading-skeleton');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');
const btnResetFilters = document.getElementById('btn-reset-filters');
const btnRefresh = document.getElementById('btn-refresh');
const themeToggle = document.getElementById('theme-toggle');
const syncDot = document.getElementById('sync-dot');
const syncLabel = document.getElementById('sync-label');

// Metric Elements
const statTotal = document.getElementById('stat-total');
const statNotices = document.getElementById('stat-notices');
const statNews = document.getElementById('stat-news');
const statAnnouncements = document.getElementById('stat-announcements');

// Filter Pill Elements
const countAll = document.getElementById('count-all');
const countNotice = document.getElementById('count-notice');
const countNews = document.getElementById('count-news');
const countAnnouncement = document.getElementById('count-announcement');
const countBookmarks = document.getElementById('count-bookmarks');
const pillButtons = document.querySelectorAll('.pill-btn');

// Modal Elements
const modal = document.getElementById('announcement-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalDate = document.getElementById('modal-date');
const modalDescription = document.getElementById('modal-description');
const modalExternalLink = document.getElementById('modal-external-link');
const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
const modalBookmarkText = document.getElementById('modal-bookmark-text');
const modalBookmarkIcon = document.getElementById('modal-bookmark-icon');
const modalShareBtn = document.getElementById('modal-share-btn');
const toastContainer = document.getElementById('toast-container');

import { createClient } from '@supabase/supabase-js';
import { FOE_DATA } from './faculty_data.js';

/**
 * Initialize Supabase Client using the official Supabase JS SDK
 */
export const supabase = (typeof createClient === 'function')
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null);


/**
 * Normalizes item properties to ensure consistent display
 */
function normalizeItem(raw) {
  const desc = raw.description || '';
  let category = 'notice';

  // Extract category from tag or URL
  if (desc.startsWith('[NEWS]') || (raw.link && raw.link.includes('/blog/20'))) {
    category = 'news';
  } else if (desc.startsWith('[ANNOUNCEMENT]') || (raw.link && raw.link.includes('/vacancie/'))) {
    category = 'announcement';
  } else if (desc.startsWith('[NOTICE]') || (raw.link && raw.link.includes('/notice/'))) {
    category = 'notice';
  }

  // 1. Extract image_url from raw column, or embedded [IMG:url] tag, or contextual fallback
  let imageUrl = raw.image_url || null;
  if (!imageUrl && desc) {
    const imgMatch = desc.match(/\[IMG:\s*(https?:\/\/[^\]]+)\]/i);
    if (imgMatch) {
      imageUrl = imgMatch[1];
    }
  }

  // Contextual fallback images (faculty photos, labs, event banners)
  if (!imageUrl) {
    if (category === 'notice') {
      imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg';
    } else if (category === 'announcement') {
      imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';
    } else {
      const t = (raw.title + ' ' + desc).toLowerCase();
      if (t.includes('computer') || t.includes('ict') || t.includes('ai') || t.includes('software')) {
        imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611-1.jpg'; // Computer Engineering Lab
      } else if (t.includes('electronic') || t.includes('electrical') || t.includes('robot') || t.includes('power')) {
        imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250309_1219023342-1.jpg'; // Robotics Lab
      } else if (t.includes('civil') || t.includes('mechanical')) {
        imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg'; // Mechanical Building
      } else {
        imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; // Faculty Complex
      }
    }
  }

  // Clean description text from tags
  let cleanedDesc = desc
    .replace(/^\[(NEWS|NOTICE|ANNOUNCEMENT)\]\s*/i, '')
    .replace(/\[IMG:(https?:\/\/[^\]]+)\]/gi, '')
    .trim();
  if (!cleanedDesc) {
    cleanedDesc = raw.title;
  }

  // Parse published date
  let publishedAt = raw.published_date || raw.created_at;
  const urlMatch = raw.link?.match(/\/blog\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (urlMatch) {
    publishedAt = `${urlMatch[1]}-${urlMatch[2]}-${urlMatch[3]}T00:00:00Z`;
  }

  return {
    id: raw.id || raw.link,
    title: raw.title || 'Untitled Update',
    category,
    description: cleanedDesc,
    image_url: imageUrl,
    link: raw.link || 'https://eng.sjp.ac.lk',
    published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()
  };
}

/**
 * Formats a date into a user-friendly string
 */
function formatDate(isoString) {
  if (!isoString) return 'Recent';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Recent';
  }
}

/**
 * Relative time calculation (e.g., "2 days ago")
 */
function timeAgo(isoString) {
  if (!isoString) return 'Recently';
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    return formatDate(isoString);
  } catch {
    return 'Recently';
  }
}

/**
 * Fetches data from the 'sjp_eng_data' table in Supabase
 * and displays each record as an interactive, responsive card.
 * @returns {Promise<Array<object>>}
 */
export async function fetchAndDisplayAnnouncements() {
  setSyncStatus('syncing', 'Fetching updates...');
  btnRefresh.classList.add('spinning');

  try {
    let records = [];

    // 1. Fetch live records from the 'sjp_eng_data' table in Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('sjp_eng_data')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        records = data;
      }
    }

    // 2. Fallback to cached dataset if network fails or table is empty
    if (records.length === 0) {
      const res = await fetch('initial_data.json');
      if (res.ok) {
        records = await res.json();
      }
    }

    // 3. Normalize records and update state
    state.items = records.map(normalizeItem);
    setSyncStatus('connected', `${state.items.length} updates live`);
  } catch (err) {
    console.error('[Supabase Fetch Error]', err);
    setSyncStatus('error', 'Using offline cache');

    // Attempt to load cached json on error
    try {
      const res = await fetch('initial_data.json');
      if (res.ok) {
        const fallback = await res.json();
        state.items = fallback.map(normalizeItem);
      }
    } catch (e) {
      console.warn('Fallback load error:', e);
    }
  } finally {
    state.isLoading = false;
    skeleton.style.display = 'none';
    btnRefresh.classList.remove('spinning');
    updateCounters();
    render();
  }

  return state.items;
}

// Aliases for compatibility
export const fetchAnnouncements = fetchAndDisplayAnnouncements;
if (typeof window !== 'undefined') {
  window.fetchAndDisplayAnnouncements = fetchAndDisplayAnnouncements;
}


/**
 * Update Status Indicator
 */
function setSyncStatus(type, label) {
  syncLabel.textContent = label;
  syncDot.className = 'sync-dot';
  if (type === 'connected') {
    syncDot.classList.add('pulse');
  } else if (type === 'syncing') {
    syncDot.classList.add('syncing');
  } else if (type === 'error') {
    syncDot.classList.add('error');
  }
}

/**
 * Update Metric Cards & Filter Counters
 */
function updateCounters() {
  const all = state.items.length;
  const notices = state.items.filter(i => i.category === 'notice').length;
  const news = state.items.filter(i => i.category === 'news').length;
  const announcements = state.items.filter(i => i.category === 'announcement').length;
  const bookmarks = state.items.filter(i => state.bookmarkedIds.has(i.id)).length;

  // Stat Strip
  statTotal.textContent = all;
  statNotices.textContent = notices;
  statNews.textContent = news;
  statAnnouncements.textContent = announcements;

  // Filter Pills
  countAll.textContent = all;
  countNotice.textContent = notices;
  countNews.textContent = news;
  countAnnouncement.textContent = announcements;
  countBookmarks.textContent = bookmarks;
}

/**
 * Filter & Sort Data
 */
function getFilteredItems() {
  let list = [...state.items];

  // 1. Category Filter
  if (state.activeCategory === 'bookmarks') {
    list = list.filter(item => state.bookmarkedIds.has(item.id));
  } else if (state.activeCategory !== 'all') {
    list = list.filter(item => item.category === state.activeCategory);
  }

  // 2. Search Query Filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q)
    );
  }

  // 3. Sorting
  if (state.sortBy === 'newest') {
    list.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  } else if (state.sortBy === 'oldest') {
    list.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
  } else if (state.sortBy === 'alphabetical') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  return list;
}

/**
 * Render Cards Grid
 */
function render() {
  const filtered = getFilteredItems();
  grid.innerHTML = '';

  // Results count
  resultsCount.textContent = `Showing ${filtered.length} of ${state.items.length} announcements`;

  if (filtered.length === 0) {
    emptyState.hidden = false;
    grid.hidden = true;
    return;
  }

  emptyState.hidden = true;
  grid.hidden = false;

  const fragment = document.createDocumentFragment();

  filtered.forEach(item => {
    const isSaved = state.bookmarkedIds.has(item.id);
    const card = document.createElement('article');
    // iOS 27 Specular Glassmorphism Card with SJP Maroon & Gold highlights
    card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', item.title);

    let badgeClasses = 'bg-[#5c0919]/90 text-amber-300 border-amber-400/40';
    let badgeLabel = '📢 Notice';
    if (item.category === 'news') {
      badgeClasses = 'bg-[#800d24]/90 text-amber-200 border-amber-300/40';
      badgeLabel = '📰 News';
    } else if (item.category === 'announcement') {
      badgeClasses = 'bg-[#160205]/90 text-emerald-300 border-emerald-400/40';
      badgeLabel = '💼 Opportunity';
    }

    card.innerHTML = `
      <!-- Top Image with Rounded Corners & Specular Glass Glow -->
      <div class="relative w-full h-52 overflow-hidden rounded-t-3xl bg-black/40">
        <img 
          src="${item.image_url}" 
          alt="${item.title}" 
          class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg';" 
        />
        <!-- Ambient Image Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#0e0205] via-transparent to-black/30 pointer-events-none"></div>
        
        <!-- Category Badge (iOS 27 Frosted Specular Pill) -->
        <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl border shadow-lg ${badgeClasses}">
          ${badgeLabel}
        </span>
        
        <!-- Glass Bookmark Action Button -->
        <button 
          class="card-bookmark-btn absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full backdrop-blur-xl bg-black/40 hover:bg-black/70 border border-white/20 hover:border-amber-400/60 text-white hover:text-amber-300 flex items-center justify-center transition-all shadow-md active:scale-90 ${isSaved ? 'text-amber-400 border-amber-400/60 bg-black/70' : ''}" 
          data-id="${item.id}"
          title="${isSaved ? 'Remove from saved' : 'Save announcement'}"
          aria-label="${isSaved ? 'Remove bookmark' : 'Bookmark this announcement'}"
        >
          <span class="text-base leading-none">${isSaved ? '★' : '☆'}</span>
        </button>
      </div>

      <!-- Card Body Content (iOS 27 Glassmorphism) -->
      <div class="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-white/[0.04]">
        <div class="space-y-2.5">
          <h3 class="font-display text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            ${item.title}
          </h3>
          <p class="text-xs sm:text-sm text-slate-300/85 line-clamp-3 leading-relaxed font-normal">
            ${item.description}
          </p>
        </div>

        <!-- Card Footer Info -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
          <span class="inline-flex items-center gap-1.5 text-amber-200/70 font-medium" title="${formatDate(item.published_at)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${timeAgo(item.published_at)}
          </span>
          <button class="card-view-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white backdrop-blur-md bg-white/10 hover:bg-gradient-to-r hover:from-[#5c0919] hover:to-[#800d24] border border-white/20 hover:border-amber-400/50 shadow-sm transition-all" data-id="${item.id}">
            <span>Details</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Event listener to open modal
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking bookmark star
      if (e.target.closest('.card-bookmark-btn')) return;
      openModal(item);
    });

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  // Attach bookmark toggle listeners
  grid.querySelectorAll('.card-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleBookmark(id);
    });
  });
}

/**
 * Toggle Bookmark in state & localStorage
 */
function toggleBookmark(id) {
  // Convert id to string or number to match type
  const targetId = isNaN(id) ? id : Number(id);
  const exists = state.bookmarkedIds.has(targetId);

  if (exists) {
    state.bookmarkedIds.delete(targetId);
    showToast('Removed from saved bookmarks');
  } else {
    state.bookmarkedIds.add(targetId);
    showToast('Saved to bookmarks ⭐');
  }

  localStorage.setItem('sjp_bookmarks', JSON.stringify(Array.from(state.bookmarkedIds)));
  updateCounters();
  render();

  // If modal is currently open for this item, update modal button
  if (state.selectedItem && (state.selectedItem.id === targetId)) {
    updateModalBookmarkBtn();
  }
}

/**
 * Open Detail Modal
 */
function openModal(item) {
  state.selectedItem = item;
  modalTitle.textContent = item.title;
  modalDescription.textContent = item.description;
  modalDate.textContent = `Published: ${formatDate(item.published_at)}`;

  // Category badge styling with Tailwind iOS 27 Glass
  let badgeStyles = 'bg-[#5c0919]/90 text-amber-300 border-amber-400/40';
  if (item.category === 'news') {
    badgeStyles = 'bg-[#800d24]/90 text-amber-200 border-amber-300/40';
  } else if (item.category === 'announcement') {
    badgeStyles = 'bg-[#160205]/90 text-emerald-300 border-emerald-400/40';
  }
  modalCategory.className = `px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xl border shadow-sm ${badgeStyles}`;
  modalCategory.textContent = item.category.toUpperCase();

  // Image in modal dialog
  const modalImgWrap = document.getElementById('modal-image-wrap');
  const modalImg = document.getElementById('modal-image');
  if (modalImgWrap && modalImg) {
    if (item.image_url) {
      modalImg.src = item.image_url;
      modalImgWrap.hidden = false;
    } else {
      modalImgWrap.hidden = true;
    }
  }

  modalExternalLink.href = item.link;

  updateModalBookmarkBtn();

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * Close Detail Modal
 */
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  state.selectedItem = null;
}

/**
 * Update modal bookmark button state
 */
function updateModalBookmarkBtn() {
  if (!state.selectedItem) return;
  const isSaved = state.bookmarkedIds.has(state.selectedItem.id);
  modalBookmarkIcon.textContent = isSaved ? '★' : '☆';
  modalBookmarkText.textContent = isSaved ? 'Saved' : 'Save';
}

/**
 * Display Animated Toast Notification
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'px-4 py-3 rounded-2xl backdrop-blur-xl bg-[#5c0919]/95 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 transition-all duration-300 translate-y-0 opacity-100';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2700);
}

/**
 * Event Handlers Setup
 */
function setupEventHandlers() {
  // Category Filter Pill clicks
  pillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pillButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.activeCategory = btn.getAttribute('data-category');
      render();
    });
  });

  // Search Input Debounced
  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    btnClearSearch.hidden = e.target.value.length === 0;
    debounceTimeout = setTimeout(() => {
      state.searchQuery = e.target.value;
      render();
    }, 180);
  });

  // Clear Search
  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    btnClearSearch.hidden = true;
    searchInput.focus();
    render();
  });

  // Sort Select
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    render();
  });

  // Reset Filters Button
  btnResetFilters.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    btnClearSearch.hidden = true;
    state.activeCategory = 'all';
    pillButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-category') === 'all');
    });
    render();
  });

  // Manual Refresh
  btnRefresh.addEventListener('click', () => {
    fetchAnnouncements();
  });

  // Modal Actions
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  modalBookmarkBtn.addEventListener('click', () => {
    if (state.selectedItem) {
      toggleBookmark(state.selectedItem.id);
    }
  });

  modalShareBtn.addEventListener('click', async () => {
    if (state.selectedItem) {
      try {
        await navigator.clipboard.writeText(state.selectedItem.link);
        showToast('Link copied to clipboard! 📋');
      } catch {
        showToast('Official URL: ' + state.selectedItem.link);
      }
    }
  });

  // Keyboard Shortcuts ('/' to search, 'Esc' to close modal)
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape') {
      if (modal.classList.contains('open')) {
        closeModal();
      } else if (searchInput.value) {
        searchInput.value = '';
        state.searchQuery = '';
        btnClearSearch.hidden = true;
        render();
      }
    }
  });

  // Theme Toggle
  const savedTheme = localStorage.getItem('sjp_theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('sjp_theme', theme);

  if (themeToggle) {
    const sun = themeToggle.querySelector('.sun-icon');
    const moon = themeToggle.querySelector('.moon-icon');
    if (sun && moon) {
      if (theme === 'dark') {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
      } else {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
      }
    }
  }
}

/**
 * =========================================================================
 * SPA (Single Page Application) Navigation & Dynamic View Rendering
 * =========================================================================
 */

/**
 * Switch Active SPA Tab
 * @param {string} tabId ('overview', 'departments', 'facilities', 'news', 'map')
 */
export function switchTab(tabId) {
  const validTabs = ['overview', 'departments', 'facilities', 'news', 'map'];
  if (!validTabs.includes(tabId)) {
    tabId = 'overview';
  }

  state.activeTab = tabId;

  // 1. Update Navigation Buttons
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  navTabs.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabId;
    if (isTarget) {
      btn.classList.add('active-tab');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active-tab');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // 2. Switch Visible Section Panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.add('hidden');
  });

  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) {
    targetPane.classList.remove('hidden');
  }

  // 3. Tab-specific dynamic initializers
  if (tabId === 'departments') {
    renderDepartments();
  } else if (tabId === 'facilities') {
    renderFacilities();
  } else if (tabId === 'news') {
    if (state.items.length === 0 && !state.isLoading) {
      fetchAndDisplayAnnouncements();
    }
  } else if (tabId === 'map') {
    initInteractiveMap();
  }

  // 4. Update URL Hash without full reload
  if (window.location.hash !== `#${tabId}`) {
    history.replaceState(null, '', `#${tabId}`);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make switchTab accessible globally for inline onclick handlers
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
}

/**
 * Render Departments of Study
 */
function renderDepartments() {
  const container = document.getElementById('departments-grid');
  if (!container || container.children.length > 0) return;

  const depts = FOE_DATA.departments || [];
  const fragment = document.createDocumentFragment();

  depts.forEach(dept => {
    const card = document.createElement('article');
    card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2';
    
    card.innerHTML = `
      <div class="relative w-full h-52 overflow-hidden rounded-t-3xl bg-black/40">
        <img 
          src="${dept.image}" 
          alt="${dept.name}" 
          class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0e0205] via-transparent to-black/30 pointer-events-none"></div>
        <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl bg-[#5c0919]/90 text-amber-300 border border-amber-400/40 shadow-lg">
          ${dept.code} • ${dept.degree.includes('IESL') ? 'IESL Recognized' : 'B.Sc. Eng'}
        </span>
      </div>

      <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-white/[0.04]">
        <div class="space-y-3">
          <div>
            <h3 class="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              Department of ${dept.name}
            </h3>
            <p class="text-xs font-semibold text-amber-300/90 mt-0.5">${dept.tagline}</p>
          </div>
          <p class="text-xs sm:text-sm text-slate-300/85 leading-relaxed font-normal">${dept.overview}</p>

          <div class="pt-3 border-t border-white/10 space-y-1.5">
            <span class="text-[11px] font-bold text-amber-200/90 uppercase tracking-wider block">Key Laboratories:</span>
            <ul class="text-xs text-slate-300 space-y-1">
              ${dept.keyLabs.slice(0, 3).map(lab => `<li class="flex items-center gap-1.5"><span class="text-amber-400">⚡</span><span>${lab}</span></li>`).join('')}
            </ul>
          </div>

          <div class="pt-2 flex flex-wrap gap-1.5">
            ${(dept.minorOptions || []).map(opt => `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300">${opt}</span>`).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span class="text-[11px] text-slate-400 font-mono">${dept.degree.includes('IESL') ? '✓ IESL Accredited' : 'SLQF Level 8'}</span>
          <button onclick="switchTab('facilities')" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-gradient-to-r hover:from-[#5c0919] hover:to-[#800d24] border border-white/20 hover:border-amber-400/50 shadow-sm transition-all cursor-pointer">
            <span>Explore Facilities</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/**
 * Render Facilities & Specialized Labs
 */
let currentFacFilter = 'all';

function renderFacilities(category = currentFacFilter) {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  currentFacFilter = category;
  container.innerHTML = '';

  const allFacs = FOE_DATA.facilities || [];
  const filtered = category === 'all' 
    ? allFacs 
    : allFacs.filter(f => f.category === category);

  const fragment = document.createDocumentFragment();

  filtered.forEach(fac => {
    const card = document.createElement('article');
    card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2';

    card.innerHTML = `
      <div class="relative w-full h-52 overflow-hidden rounded-t-3xl bg-black/40">
        <img 
          src="${fac.image}" 
          alt="${fac.title}" 
          class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0e0205] via-transparent to-black/30 pointer-events-none"></div>
        <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl bg-[#5c0919]/90 text-amber-300 border border-amber-400/40 shadow-lg">
          ${fac.badge || fac.categoryName}
        </span>
      </div>

      <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-white/[0.04]">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>${fac.dept}</span>
            <span class="text-slate-400 font-normal">${fac.location.split(',')[0]}</span>
          </div>
          <h3 class="font-display text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
            ${fac.title}
          </h3>
          <p class="text-xs sm:text-sm text-slate-300/85 leading-relaxed font-normal">${fac.shortDesc}</p>

          <div class="pt-3 border-t border-white/10 space-y-1">
            <span class="text-[11px] font-bold text-amber-200/90 uppercase tracking-wider block">Key Highlights:</span>
            <ul class="text-xs text-slate-300 space-y-1">
              ${(fac.features || []).slice(0, 3).map(feat => `<li class="flex items-center gap-1.5"><span class="text-amber-400 font-bold">✓</span><span>${feat}</span></li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>🕒 ${fac.hours.split('|')[0]}</span>
          <button onclick="switchTab('map')" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-white/5 hover:bg-white/15 border border-white/15 transition-all cursor-pointer">
            <span>Locate</span>
            <span>📍</span>
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  // Update category buttons active state
  document.querySelectorAll('#facilities-filter-bar .fac-filter-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-category') === category;
    if (isTarget) {
      btn.className = 'fac-filter-btn active-fac px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md bg-amber-500/25 border border-amber-400 text-amber-300 transition-all cursor-pointer shadow-md';
    } else {
      btn.className = 'fac-filter-btn px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer';
    }
  });
}

/**
 * Interactive Campus Blueprint Map & Inspector
 */
let mapInitialized = false;
let currentMapCategory = 'all';

function initInteractiveMap() {
  const mapZones = FOE_DATA.mapZones || [];
  if (mapZones.length === 0) return;

  const viewport = document.getElementById('campus-map-viewport');
  const beaconsContainer = document.getElementById('map-beacons-container');
  const hoverTooltip = document.getElementById('map-hover-tooltip');
  const quickPillsContainer = document.getElementById('map-quick-pills');
  const categoryFilterBar = document.getElementById('map-category-filter-bar');
  const searchInput = document.getElementById('map-search-input');
  const clearSearchBtn = document.getElementById('map-clear-search');

  // Tooltip DOM Elements
  const tooltipImg = document.getElementById('tooltip-img');
  const tooltipCat = document.getElementById('tooltip-category');
  const tooltipCode = document.getElementById('tooltip-code');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipFloors = document.getElementById('tooltip-floors');

  // Inspector DOM Elements
  const elImg = document.getElementById('inspector-img');
  const elCode = document.getElementById('inspector-code');
  const elTag = document.getElementById('inspector-tag');
  const elHours = document.getElementById('inspector-hours');
  const elName = document.getElementById('inspector-name');
  const elDesc = document.getElementById('inspector-desc');
  const elFloors = document.getElementById('inspector-floors');
  const elHighlights = document.getElementById('inspector-highlights');
  const elBtnDept = document.getElementById('btn-inspector-locate-dept');

  /**
   * Display floating glassmorphism tooltip on beacon or building hover
   */
  const showTooltip = (zone) => {
    if (!hoverTooltip || !zone) return;

    if (tooltipImg) {
      tooltipImg.src = zone.image;
      tooltipImg.onerror = () => { tooltipImg.src = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; };
    }
    if (tooltipCat) tooltipCat.textContent = zone.tag || zone.category;
    if (tooltipCode) tooltipCode.textContent = zone.code;
    if (tooltipTitle) tooltipTitle.textContent = zone.shortName || zone.name;
    if (tooltipDesc) tooltipDesc.textContent = zone.desc;
    if (tooltipFloors) {
      const count = zone.floors ? zone.floors.length : 1;
      tooltipFloors.textContent = `${count} Level${count > 1 ? 's' : ''} Directory`;
    }

    // Position tooltip relative to beacon percentage coordinates
    const posX = zone.x;
    const posY = zone.y;

    hoverTooltip.style.left = `${posX}%`;
    hoverTooltip.style.top = `${posY}%`;

    // Adaptive positioning to avoid clipping viewport edges
    let transformX = '-50%';
    let transformY = '-100%';
    let translateY = '-18px';

    if (posX < 22) {
      transformX = '-15%';
    } else if (posX > 78) {
      transformX = '-85%';
    }

    if (posY < 30) {
      transformY = '0%';
      translateY = '24px';
    }

    hoverTooltip.style.transform = `translate(${transformX}, ${transformY}) translateY(${translateY})`;
    hoverTooltip.classList.remove('hidden-tooltip');
  };

  const hideTooltip = () => {
    if (hoverTooltip) {
      hoverTooltip.classList.add('hidden-tooltip');
    }
  };

  /**
   * Select a zone: update inspector side panel and active UI markers
   */
  const selectZone = (zoneId, shouldScroll = false) => {
    const zone = mapZones.find(z => z.id === zoneId) || mapZones[0];
    if (!zone) return;

    // 1. Update Inspector Banner & Badges
    if (elImg) {
      elImg.src = zone.image;
      elImg.onerror = () => { elImg.src = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; };
    }
    if (elCode) {
      elCode.textContent = zone.code;
      elCode.style.backgroundColor = zone.accent || '#f59e0b';
    }
    if (elTag) elTag.textContent = zone.tag || zone.category;
    if (elHours) {
      elHours.innerHTML = `<span>🕒</span> <span>${zone.hours || 'Mon - Fri: 8:00 AM - 5:00 PM'}</span>`;
    }
    if (elName) elName.textContent = zone.name;
    if (elDesc) elDesc.textContent = zone.desc;

    // 2. Multi-Level Floor Directory
    if (elFloors) {
      elFloors.innerHTML = '';
      const floors = zone.floors && zone.floors.length > 0 
        ? zone.floors 
        : [{ level: "Main Level", desc: zone.desc }];

      floors.forEach(f => {
        const floorItem = document.createElement('div');
        floorItem.className = 'p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all';
        floorItem.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-300 mb-0.5">
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>${f.level}</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">FACULTY ZONE</span>
          </div>
          <p class="text-[11px] text-slate-300/90 font-light leading-relaxed">${f.desc}</p>
        `;
        elFloors.appendChild(floorItem);
      });
    }

    // 3. Highlights & Key Facilities
    if (elHighlights && zone.highlights) {
      elHighlights.innerHTML = zone.highlights
        .map(h => `<li class="flex items-center gap-2 text-xs text-slate-200"><span class="text-amber-400 font-bold">✦</span><span>${h}</span></li>`)
        .join('');
    }

    // 4. Action Button Routing
    if (elBtnDept) {
      if (zone.category === 'department') {
        elBtnDept.innerHTML = `<span>View ${zone.code} Dept</span><span>→</span>`;
        elBtnDept.onclick = () => switchTab('departments');
      } else if (zone.type === 'library' || zone.type === 'gym') {
        elBtnDept.innerHTML = `<span>View Facilities</span><span>→</span>`;
        elBtnDept.onclick = () => switchTab('facilities');
      } else {
        elBtnDept.innerHTML = `<span>Faculty Overview</span><span>→</span>`;
        elBtnDept.onclick = () => switchTab('overview');
      }
    }

    // 5. Highlight Map Beacons
    document.querySelectorAll('.map-beacon').forEach(b => {
      const isTarget = b.getAttribute('data-zone-id') === zone.id;
      b.classList.toggle('active-beacon', isTarget);
    });

    // 6. Highlight SVG Building Footprints
    document.querySelectorAll('.map-svg-building').forEach(b => {
      const isTarget = b.getAttribute('data-zone-id') === zone.id;
      b.classList.toggle('active-zone', isTarget);
      if (isTarget) {
        b.style.filter = `drop-shadow(0 0 14px ${zone.accent || '#f59e0b'})`;
      } else {
        b.style.filter = '';
      }
    });

    // 7. Highlight Quick Selector Pills
    document.querySelectorAll('.map-quick-pill-btn').forEach(btn => {
      const isTarget = btn.getAttribute('data-zone-id') === zone.id;
      if (isTarget) {
        btn.className = 'map-quick-pill-btn active-pill shrink-0 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-gradient-to-r from-amber-500 to-amber-600 text-black border border-amber-300 shadow-md transition-all cursor-pointer';
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.className = 'map-quick-pill-btn shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer';
      }
    });

    // Optional smooth scroll to inspector on small screens
    if (shouldScroll && window.innerWidth < 1024) {
      const inspector = document.getElementById('map-zone-inspector');
      if (inspector) inspector.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Render All 16 Glowing Beacons on the Map Canvas
   */
  const renderBeacons = () => {
    if (!beaconsContainer) return;
    beaconsContainer.innerHTML = '';

    mapZones.forEach(zone => {
      const beacon = document.createElement('div');
      beacon.className = 'map-beacon';
      beacon.setAttribute('data-zone-id', zone.id);
      beacon.setAttribute('data-category', zone.category);
      beacon.style.left = `${zone.x}%`;
      beacon.style.top = `${zone.y}%`;

      beacon.innerHTML = `
        <span class="map-beacon-ping" style="background-color: ${zone.accent || '#f59e0b'};"></span>
        <div class="map-beacon-core" style="background: rgba(22, 2, 5, 0.88); border-color: ${zone.accent || '#f59e0b'};">
          <i class="bi ${zone.icon || 'bi-geo-alt-fill'}" style="color: ${zone.accent || '#f59e0b'}; font-size: 11px;"></i>
        </div>
        <div class="map-beacon-label">${zone.code || zone.shortName}</div>
      `;

      beacon.addEventListener('mouseenter', () => showTooltip(zone));
      beacon.addEventListener('mouseleave', hideTooltip);
      beacon.addEventListener('click', (e) => {
        e.stopPropagation();
        selectZone(zone.id, true);
      });

      beaconsContainer.appendChild(beacon);
    });
  };

  /**
   * Render Quick Selector Pills Strip
   */
  const renderQuickPills = () => {
    if (!quickPillsContainer) return;
    quickPillsContainer.innerHTML = '';

    mapZones.forEach(zone => {
      const btn = document.createElement('button');
      btn.className = 'map-quick-pill-btn shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5';
      btn.setAttribute('data-zone-id', zone.id);
      btn.setAttribute('data-category', zone.category);

      btn.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${zone.accent || '#f59e0b'};"></span>
        <span>${zone.shortName || zone.name}</span>
      `;

      btn.addEventListener('mouseenter', () => showTooltip(zone));
      btn.addEventListener('mouseleave', hideTooltip);
      btn.addEventListener('click', () => selectZone(zone.id));

      quickPillsContainer.appendChild(btn);
    });
  };

  /**
   * Category Filter Logic
   */
  const filterMap = (category) => {
    currentMapCategory = category;

    // Update filter buttons appearance
    if (categoryFilterBar) {
      categoryFilterBar.querySelectorAll('.map-filter-btn').forEach(btn => {
        const isTarget = btn.getAttribute('data-category') === category;
        if (isTarget) {
          btn.className = 'map-filter-btn active-map-filter px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-gradient-to-r from-amber-500 to-amber-600 text-black border border-amber-300 shadow-md transition-all cursor-pointer';
        } else {
          btn.className = 'map-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-white/5 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer';
        }
      });
    }

    let firstMatch = null;

    // Filter Beacons
    document.querySelectorAll('.map-beacon').forEach(beacon => {
      const zoneId = beacon.getAttribute('data-zone-id');
      const zone = mapZones.find(z => z.id === zoneId);
      if (!zone) return;

      const matches = category === 'all' || 
        zone.category === category || 
        (category === 'dining' && (zone.category === 'dining' || zone.category === 'recreation')) ||
        (category === 'sports' && (zone.category === 'sports' || zone.category === 'welfare')) ||
        (category === 'academic' && (zone.category === 'academic')) ||
        (category === 'administrative' && (zone.category === 'administrative' || zone.type === 'auditorium'));

      if (matches) {
        beacon.style.display = 'block';
        beacon.style.opacity = '1';
        beacon.style.pointerEvents = 'auto';
        if (!firstMatch) firstMatch = zoneId;
      } else {
        beacon.style.opacity = '0.2';
        beacon.style.pointerEvents = 'none';
      }
    });

    // Filter SVG Buildings
    document.querySelectorAll('.map-svg-building').forEach(building => {
      const zoneId = building.getAttribute('data-zone-id');
      const zone = mapZones.find(z => z.id === zoneId);
      if (!zone) return;

      const matches = category === 'all' || 
        zone.category === category || 
        (category === 'dining' && (zone.category === 'dining' || zone.category === 'recreation')) ||
        (category === 'sports' && (zone.category === 'sports' || zone.category === 'welfare')) ||
        (category === 'academic' && (zone.category === 'academic')) ||
        (category === 'administrative' && (zone.category === 'administrative' || zone.type === 'auditorium'));

      building.style.opacity = matches ? '1' : '0.25';
    });

    // Filter Quick Pills
    document.querySelectorAll('.map-quick-pill-btn').forEach(pill => {
      const zoneId = pill.getAttribute('data-zone-id');
      const zone = mapZones.find(z => z.id === zoneId);
      if (!zone) return;

      const matches = category === 'all' || 
        zone.category === category || 
        (category === 'dining' && (zone.category === 'dining' || zone.category === 'recreation')) ||
        (category === 'sports' && (zone.category === 'sports' || zone.category === 'welfare')) ||
        (category === 'academic' && (zone.category === 'academic')) ||
        (category === 'administrative' && (zone.category === 'administrative' || zone.type === 'auditorium'));

      pill.style.display = matches ? 'inline-flex' : 'none';
    });

    if (firstMatch) {
      selectZone(firstMatch);
    }
  };

  /**
   * Search Input Filtering
   */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = (e.target.value || '').trim().toLowerCase();
      if (clearSearchBtn) clearSearchBtn.style.display = query ? 'flex' : 'none';

      let firstMatch = null;
      document.querySelectorAll('.map-beacon').forEach(beacon => {
        const zoneId = beacon.getAttribute('data-zone-id');
        const zone = mapZones.find(z => z.id === zoneId);
        if (!zone) return;

        const matches = !query || 
          zone.name.toLowerCase().includes(query) ||
          zone.code.toLowerCase().includes(query) ||
          zone.desc.toLowerCase().includes(query) ||
          (zone.highlights || []).some(h => h.toLowerCase().includes(query));

        if (matches) {
          beacon.style.display = 'block';
          beacon.style.opacity = '1';
          beacon.style.pointerEvents = 'auto';
          if (!firstMatch) firstMatch = zone.id;
        } else {
          beacon.style.opacity = '0.15';
          beacon.style.pointerEvents = 'none';
        }
      });

      if (firstMatch) selectZone(firstMatch);
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        filterMap(currentMapCategory);
      });
    }
  }

  // Setup SVG Building Footprint Click & Hover Listeners
  document.querySelectorAll('.map-svg-building').forEach(building => {
    const zoneId = building.getAttribute('data-zone-id');
    const zone = mapZones.find(z => z.id === zoneId);
    if (!zone) return;

    building.addEventListener('mouseenter', () => showTooltip(zone));
    building.addEventListener('mouseleave', hideTooltip);
    building.addEventListener('click', () => selectZone(zone.id, true));
  });

  // Setup Category Filter Buttons
  if (categoryFilterBar) {
    categoryFilterBar.querySelectorAll('.map-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        filterMap(category);
      });
    });
  }

  // Render Beacons and Quick Pills
  renderBeacons();
  renderQuickPills();

  // Select Admin Block by default
  selectZone('zone-admin');
  mapInitialized = true;
}

/**
 * Tab Navigation Setup
 */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Filter bar for Other Facilities
  document.querySelectorAll('#facilities-filter-bar .fac-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      renderFacilities(cat);
    });
  });

  // Handle URL hash on boot
  const hash = window.location.hash.replace('#', '');
  if (['overview', 'departments', 'facilities', 'news', 'map'].includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('overview');
  }

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (['overview', 'departments', 'facilities', 'news', 'map'].includes(currentHash)) {
      switchTab(currentHash);
    }
  });
}

// Welcome Screen Controller
function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const btnExplore = document.getElementById('btn-explore-now');
  const btnShowWelcome = document.getElementById('btn-show-welcome');

  if (!welcomeScreen) return;

  // Lock body scrolling while welcome screen is active
  document.body.style.overflow = 'hidden';

  const dismissWelcome = () => {
    welcomeScreen.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    document.body.style.overflow = '';
    setTimeout(() => {
      welcomeScreen.style.display = 'none';
    }, 700);
  };

  if (btnExplore) {
    btnExplore.addEventListener('click', dismissWelcome);
  }

  // Re-open welcome intro from footer
  if (btnShowWelcome) {
    btnShowWelcome.addEventListener('click', () => {
      welcomeScreen.style.display = 'flex';
      void welcomeScreen.offsetWidth; // Force reflow
      welcomeScreen.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
      welcomeScreen.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Initial Boot
setupEventHandlers();
initWelcomeScreen();
initTabNavigation();
fetchAndDisplayAnnouncements();

