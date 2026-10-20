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
  facilities: [],
  libraryBooks: [],
  liveOpacResults: null,
  isLiveOpacSearching: false,
  libraryFilter: {
    category: 'all',
    status: 'all',
    search: '',
    index: 'catalog'
  },
  selectedBook: null,
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
        imageUrl = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg'; // Electrical & Electronic Engineering Lab
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
    card.id = `announcement-card-${item.id}`;
    // iOS 27 Specular Glassmorphism Card with SJP Maroon & Gold highlights (Adaptive Dark/Light)
    card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/25 border border-slate-200/90 dark:border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', item.title);

    let badgeClasses = 'bg-[#5c0919] text-amber-300 border-amber-400/40';
    let badgeLabel = '📢 Notice';
    if (item.category === 'news') {
      badgeClasses = 'bg-[#800d24] text-amber-200 border-amber-300/40';
      badgeLabel = '📰 News';
    } else if (item.category === 'announcement') {
      badgeClasses = 'bg-[#160205] text-emerald-300 border-emerald-400/40';
      badgeLabel = '💼 Opportunity';
    }

    card.innerHTML = `
      <!-- Top Image with Rounded Corners & Specular Glass Glow -->
      <div class="relative w-full h-52 overflow-hidden rounded-t-3xl bg-slate-900">
        <img 
          src="${item.image_url}" 
          alt="${item.title}" 
          class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg';" 
        />
        <!-- Ambient Image Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
        
        <!-- Category Badge (iOS 27 Frosted Specular Pill) -->
        <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl border shadow-lg ${badgeClasses}">
          ${badgeLabel}
        </span>
        
        <!-- Glass Bookmark Action Button -->
        <button 
          class="card-bookmark-btn absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full backdrop-blur-xl bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/70 border border-slate-300/80 dark:border-white/20 hover:border-amber-400/60 text-slate-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-300 flex items-center justify-center transition-all shadow-md active:scale-90 ${isSaved ? 'text-amber-500 dark:text-amber-400 border-amber-400/60 bg-white/95 dark:bg-black/70' : ''}" 
          data-id="${item.id}"
          title="${isSaved ? 'Remove from saved' : 'Save announcement'}"
          aria-label="${isSaved ? 'Remove bookmark' : 'Bookmark this announcement'}"
        >
          <span class="text-base leading-none">${isSaved ? '★' : '☆'}</span>
        </button>
      </div>

      <!-- Card Body Content (iOS 27 Glassmorphism) -->
      <div class="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-slate-50/50 dark:bg-white/[0.04]">
        <div class="space-y-2.5">
          <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            ${item.title}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 line-clamp-3 leading-relaxed font-normal">
            ${item.description}
          </p>
        </div>

        <!-- Card Footer Info -->
        <div class="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
          <span class="inline-flex items-center gap-1.5 text-slate-500 dark:text-amber-200/70 font-medium" title="${formatDate(item.published_at)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${timeAgo(item.published_at)}
          </span>
          <button class="card-view-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-white backdrop-blur-md bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-gradient-to-r dark:hover:from-[#5c0919] dark:hover:to-[#800d24] border border-slate-300/80 dark:border-white/20 hover:border-amber-400/50 shadow-sm transition-all" data-id="${item.id}">
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

  // Initialize Theme from localStorage or system preference
  const savedTheme = localStorage.getItem('sjp_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(savedTheme);

  // Attach click listeners to all theme toggles (desktop and mobile)
  const allThemeButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle, .theme-toggle-btn');
  allThemeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  // Listen to system color scheme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('sjp_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

/**
 * Top Navigation Bar Auto-Hide on Scroll Down & Reveal on Scroll Up
 * Smooth hardware-accelerated transitions with micro-bounce threshold guards.
 */
export function initScrollNavbar() {
  const header = document.getElementById('app-header');
  if (!header) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  const SCROLL_THRESHOLD = 50; // Threshold from page top before hiding
  const DELTA_MIN = 6; // Minimum pixel delta to eliminate micro-scroll jitter

  const onScroll = () => {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // At or very near the top of the viewport, always keep the navbar visible
    if (currentScrollY <= SCROLL_THRESHOLD) {
      header.classList.remove('nav-hidden');
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    const diff = currentScrollY - lastScrollY;

    // User scrolled DOWN - smoothly hide navigation bar
    if (diff > DELTA_MIN && currentScrollY > SCROLL_THRESHOLD) {
      header.classList.add('nav-hidden');
    }
    // User scrolled UP - smoothly reveal navigation bar
    else if (diff < -DELTA_MIN) {
      header.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Full Dark / Light Theme Controller using Tailwind's dark mode classes
 * @param {'dark'|'light'} theme 
 */
export function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('sjp_theme', theme);

  // Update desktop theme toggle icon state
  const desktopToggle = document.getElementById('theme-toggle');
  if (desktopToggle) {
    desktopToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    desktopToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    const sun = desktopToggle.querySelector('.sun-icon');
    const moon = desktopToggle.querySelector('.moon-icon');
    if (sun && moon) {
      if (isDark) {
        sun.classList.remove('hidden');
        moon.classList.add('hidden');
      } else {
        sun.classList.add('hidden');
        moon.classList.remove('hidden');
      }
    }
  }

  // Update mobile theme toggle icon
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  if (mobileToggle) {
    mobileToggle.textContent = isDark ? '☀️' : '🌙';
    mobileToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    mobileToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Also update any other theme buttons on the page
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });

  // Notify any component listening for theme changes
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, isDark } }));
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  const isCurrentlyDark = document.documentElement.classList.contains('dark') || 
                          document.documentElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isCurrentlyDark ? 'light' : 'dark';
  setTheme(nextTheme);
  return nextTheme;
}

// Expose globally for convenience
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;

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
  const validTabs = ['overview', 'departments', 'facilities', 'library', 'news', 'map'];
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
    fetchDepartmentsFromSupabase();
    const detailView = document.getElementById('department-detail-view');
    const listView = document.getElementById('departments-list-view');
    if (!window.location.hash.startsWith('#departments/')) {
      if (detailView) detailView.classList.add('hidden');
      if (listView) listView.classList.remove('hidden');
    }
  } else if (tabId === 'facilities') {
    renderFacilities();
  } else if (tabId === 'library') {
    fetchAndRenderLibraryBooks();
  } else if (tabId === 'news') {
    if (state.items.length === 0 && !state.isLoading) {
      fetchAndDisplayAnnouncements();
    }
  } else if (tabId === 'map') {
    initInteractiveMap();
  }

  // 4. Update URL Hash without full reload
  if (!window.location.hash.startsWith(`#${tabId}/`) && window.location.hash !== `#${tabId}`) {
    history.replaceState(null, '', `#${tabId}`);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make switchTab accessible globally for inline onclick handlers
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
}

/**
 * Department High-Resolution Photographic Showcase Map
 */
const DEPARTMENT_GALLERIES = {
  civil: [
    {
      title: "Civil Engineering Complex",
      desc: "Dedicated Civil Engineering Building, Mattegoda Campus",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg"
    },
    {
      title: "Advanced Soil & Materials Testing Bay",
      desc: "Hydraulic actuators and geotechnical triaxial suites",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg"
    },
    {
      title: "Mattegoda Permanent Campus View",
      desc: "Faculty complex landscape and academic promenade",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/FOE-1-scaled.jpg"
    }
  ],
  computer: [
    {
      title: "Computer Engineering High-Performance Computing Lab",
      desc: "Central computing hub, server racks, and workstation suites",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135416571.jpg"
    },
    {
      title: "AI, Machine Learning & Robotics Lab",
      desc: "Home to National AI Award Winners 2026",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg"
    },
    {
      title: "MicroMaze & Autonomous Drone Arena",
      desc: "Mobile robot navigation & embedded IoT platforms",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/MicroMaze-3.0-6.jpeg"
    }
  ],
  electrical: [
    {
      title: "Electrical & Electronic Engineering Laboratory",
      desc: "State-of-the-art laboratory for circuit design, testing benches & microelectronics instrumentation",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg"
    },
    {
      title: "Smart Power Grid & Renewable Energy Hub",
      desc: "Solar microgrid emulators & high-voltage benches",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IMG_4366-Nimantha-Madhushan-scaled.jpeg"
    },
    {
      title: "Robotics, Drives & Automation Lab",
      desc: "Motor control benches and PLC industrial automation",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg"
    }
  ],
  mechanical: [
    {
      title: "Mechanical Engineering Main Complex",
      desc: "Dedicated Mechanical Engineering Building, Mattegoda Campus",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Mechanical-Engineering-Building.jpg"
    },
    {
      title: "CNC Machining & Precision Prototyping Bay",
      desc: "Multi-axis milling, industrial lathes & tooling workshop",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg"
    },
    {
      title: "Mattegoda Laboratory & Workshop Complex",
      desc: "Mechanical testing bays and experimental workshops",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/01/FOE-2-scaled.jpg"
    }
  ],
  interdisciplinary: [
    {
      title: "Interdisciplinary Studies & Computational Wing",
      desc: "Academic Lecture Hall & Computational Studio L211A",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/Lecture-Hall-L211A-New.jpg"
    },
    {
      title: "Central Engineering Library & Study Suites",
      desc: "IEEE digital workstation pods and collaborative lounges",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-2.jpg"
    },
    {
      title: "Research Centre for Faculty of Engineering",
      desc: "Multidisciplinary innovation, patents & ConTRE hub",
      url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/10/FOE-Win-Gold-at-National-AI-Awards-2026-1-scaled.jpg"
    }
  ]
};

const DEPT_ID_MAP = {
  'civil': 2,
  'computer': 3,
  'electrical': 4,
  'mechanical': 5,
  'interdisciplinary': 6
};

const DEPT_KEYWORD_MAP = {
  'civil': 'civil',
  'computer': 'computer',
  'electrical': 'electrical',
  'mechanical': 'mechanical',
  'interdisciplinary': 'interdisciplinary'
};

/**
 * Render Departments of Study Cards List
 */
function renderDepartments() {
  const container = document.getElementById('departments-grid');
  if (!container || container.children.length > 0) return;

  const depts = FOE_DATA.departments || [];
  const fragment = document.createDocumentFragment();

  depts.forEach(dept => {
    const card = document.createElement('article');
    card.id = `dept-card-${dept.id}`;
    card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/25 border border-slate-200/90 dark:border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Explore Department of ${dept.name}`);

    card.innerHTML = `
      <div class="relative w-full h-56 overflow-hidden rounded-t-3xl bg-slate-900">
        <img 
          src="${dept.image}" 
          alt="${dept.name}" 
          class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
          loading="lazy" 
          onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none"></div>
        <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl bg-[#5c0919] text-amber-300 border border-amber-400/40 shadow-lg">
          ${dept.code} • ${dept.degree.includes('IESL') ? 'IESL Recognized' : 'B.Sc. Eng'}
        </span>
        <span class="absolute bottom-3 right-3 z-10 text-[11px] font-semibold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-amber-500 group-hover:text-black transition-colors">
          Click to View Details & Staff ↗
        </span>
      </div>

      <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-slate-50/50 dark:bg-white/[0.04]">
        <div class="space-y-3">
          <div>
            <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
              Department of ${dept.name}
            </h3>
            <p class="text-xs font-semibold text-amber-700 dark:text-amber-300/90 mt-0.5">${dept.tagline}</p>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed font-normal">${dept.overview}</p>

          <div class="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
            <span class="text-[11px] font-bold text-amber-700 dark:text-amber-200/90 uppercase tracking-wider block">Key Laboratories:</span>
            <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              ${dept.keyLabs.slice(0, 3).map(lab => `<li class="flex items-center gap-1.5"><span class="text-amber-500">⚡</span><span>${lab}</span></li>`).join('')}
            </ul>
          </div>

          <div class="pt-2 flex flex-wrap gap-1.5">
            ${(dept.minorOptions || []).map(opt => `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">${opt}</span>`).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
          <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">${dept.degree.includes('IESL') ? '✓ IESL Accredited' : 'SLQF Level 8'}</span>
          <button class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 dark:text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md hover:scale-105 transition-all cursor-pointer">
            <span>Explore Details & Staff</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    // Click anywhere on card transitions to wide detailed view
    card.addEventListener('click', () => {
      showDepartmentDetail(dept.id);
    });

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/**
 * Dynamically fetches departments from Supabase 'departments' table
 * and synchronizes live metadata and image URLs across FOE_DATA and the DOM.
 */
export async function fetchDepartmentsFromSupabase() {
  try {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) return;

    const norm = (s) => (s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

    for (const row of data) {
      const rowKey = norm(row.name);
      const dept = (FOE_DATA.departments || []).find(d => {
        const dName = norm(d.name);
        const dId = norm(d.id);
        return dName === rowKey || dId === rowKey || dName.includes(rowKey) || rowKey.includes(dName);
      });

      if (dept && row.image_url) {
        dept.image = row.image_url;
      }

      // Also sync to matching Faculty Map zone
      if (FOE_DATA.mapZones) {
        const zone = FOE_DATA.mapZones.find(z => {
          const zName = norm(z.name || '');
          const zType = norm(z.type || '');
          const zId = norm(z.id || '');
          return zName.includes(rowKey) || rowKey.includes(zType) || zId.includes(rowKey);
        });
        if (zone && row.image_url) {
          zone.image = row.image_url;
          if (rowKey.includes('electrical') || rowKey.includes('ee')) {
            zone.showImageOnMap = true;
          }
        }
      }
    }

    // Update any department card images already rendered in the DOM
    (FOE_DATA.departments || []).forEach(d => {
      const cardImg = document.querySelector(`#dept-card-${d.id} img`);
      if (cardImg && d.image) {
        cardImg.src = d.image;
      }
    });

  } catch (err) {
    console.warn('Error fetching departments from Supabase:', err);
  }
}


/**
 * Transition to Wide Detailed Department View
 * @param {string} slug Department id ('civil', 'computer', etc.)
 */
export async function showDepartmentDetail(rawSlug) {
  const slug = getDeptSlug(rawSlug);
  const depts = FOE_DATA.departments || [];
  const dept = depts.find(d => d.id === slug) || 
               depts.find(d => getDeptSlug(d) === slug) || 
               depts[0];
  if (!dept) return;

  const listView = document.getElementById('departments-list-view');
  const detailView = document.getElementById('department-detail-view');
  if (!detailView) return;

  if (listView) listView.classList.add('hidden');
  detailView.classList.remove('hidden');
  detailView.classList.remove('dept-detail-fade-in');
  void detailView.offsetWidth; // Trigger reflow
  detailView.classList.add('dept-detail-fade-in');

  // Update hash
  if (window.location.hash !== `#departments/${slug}`) {
    history.replaceState(null, '', `#departments/${slug}`);
  }

  // Render detail structure
  renderDepartmentDetailDOM(dept);

  // Smooth scroll to top of section
  const header = document.getElementById('app-header');
  const offset = header ? header.offsetHeight + 20 : 80;
  window.scrollTo({ top: Math.max(0, detailView.offsetTop - offset), behavior: 'smooth' });

  // Fetch staff from Supabase department_staff table
  await fetchAndRenderDepartmentStaff(slug, dept);
}

/**
 * Return from Detailed View to the 5 Departments Grid
 */
export function hideDepartmentDetail() {
  const listView = document.getElementById('departments-list-view');
  const detailView = document.getElementById('department-detail-view');
  if (detailView) detailView.classList.add('hidden');
  if (listView) listView.classList.remove('hidden');

  if (window.location.hash.includes('#departments')) {
    history.replaceState(null, '', '#departments');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Render Department Detailed View DOM (Photos, Descriptions, Gallery)
 */
function renderDepartmentDetailDOM(dept) {
  const container = document.getElementById('department-detail-view');
  if (!container) return;

  const slug = getDeptSlug(dept);
  const galleries = DEPARTMENT_GALLERIES[slug] || [
    { title: `${dept.name} Main Complex`, desc: "Mattegoda Permanent Complex", url: dept.image },
    { title: "Specialized Laboratory Bay", desc: "Instructional & Research Bay", url: "https://eng.sjp.ac.lk/wp-content/uploads/2025/08/PXL_20250609_135249611.jpg" },
    { title: "Academic Facility & Innovation Hub", desc: "Faculty of Engineering", url: "https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg" }
  ];

  const deptsList = FOE_DATA.departments || [];

  container.innerHTML = `
    <!-- Top Bar: Back Button, Breadcrumb & Department Switcher -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center gap-3 flex-wrap">
        <button 
          id="btn-back-to-departments"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/20 text-slate-900 dark:text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer group"
          title="Return to 5 departments overview"
        >
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to All Departments</span>
        </button>

        <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>/</span>
          <span class="font-semibold text-amber-700 dark:text-amber-300">${dept.name}</span>
        </div>
      </div>

      <!-- Quick Department Switcher Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
        <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mr-1 hidden lg:inline">Switch:</span>
        ${deptsList.map(d => {
          const dSlug = getDeptSlug(d);
          const isActive = dSlug === slug;
          return `
            <button 
              class="dept-switcher-btn px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive ? 'bg-amber-500 text-black shadow-md font-bold' : 'bg-slate-200/70 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/10'}"
              data-slug="${dSlug}"
            >
              ${d.code}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Wide Hero Showcase Banner (iOS 27 Specular Glass Maroon) -->
    <div class="ios27-glass-maroon rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-amber-400/30 shadow-2xl">
      <!-- Ambient Glows -->
      <div class="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#800d24]/30 blur-3xl pointer-events-none"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <!-- Hero Details Column -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3.5 py-1 rounded-full backdrop-blur-md bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider shadow-md">
              ${dept.code}
            </span>
            <span class="px-3.5 py-1 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/40 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              ${dept.degree.includes('IESL') ? 'IESL Recognized Degree' : (slug === 'interdisciplinary' ? 'Multidisciplinary Foundation' : 'SLQF Level 8 Program')}
            </span>
            <span class="px-3.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium">
              ${slug === 'interdisciplinary' ? 'All Engineering Streams' : '4 Years Full-Time'}
            </span>
          </div>

          <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Department of <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500">${dept.name}</span>
          </h1>

          <p class="text-sm sm:text-base font-semibold text-amber-700 dark:text-amber-300/95 leading-snug">
            "${dept.tagline}"
          </p>

          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed font-normal">
            ${dept.overview}
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <a 
              href="#dept-staff-section" 
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Meet Department Faculty & Staff</span>
              <span>↓</span>
            </a>
            <a 
              href="${slug === 'interdisciplinary' ? 'https://eng.sjp.ac.lk/departments/interdisciplinary-studies/' : `https://eng.sjp.ac.lk/${slug}-engineering/`}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="px-5 py-2.5 rounded-xl backdrop-blur-xl bg-white/80 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/20 text-slate-900 dark:text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Official Department Portal</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <!-- Hero Photo Column -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="relative w-full max-w-md h-72 sm:h-80 rounded-3xl overflow-hidden p-1.5 bg-gradient-to-tr from-amber-500 via-[#800d24] to-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.3)] ring-4 ring-amber-400/20 group">
            <img 
              src="${dept.image}" 
              alt="Department of ${dept.name}" 
              class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out" 
              onerror="this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20">Mattegoda Permanent Campus</span>
              <p class="text-xs font-bold mt-1 text-amber-200">Department Building & High-Tech Facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- High-Quality Photo Gallery Strip -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📸</span>
          <span>Department Campus, Laboratories & Research Facilities</span>
        </h3>
        <span class="text-xs text-slate-500 dark:text-slate-400">High-Resolution Photographic Showcase</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${galleries.map(g => `
          <div class="ios27-card group relative overflow-hidden rounded-3xl h-64 flex flex-col justify-end p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <img 
              src="${g.url}" 
              alt="${g.title}" 
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              onerror="this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
            <div class="relative z-10 space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/90 text-black">
                Campus Gallery
              </span>
              <h4 class="font-display text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                ${g.title}
              </h4>
              <p class="text-xs text-slate-300 font-normal line-clamp-2">
                ${g.desc}
              </p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- In-Depth Descriptions & Academic Highlights (2-Column Specular Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Full Description & Key Laboratories -->
      <div class="lg:col-span-8 space-y-6">
        <div class="ios27-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div class="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
            <span>📖</span>
            <span>Comprehensive Academic Overview</span>
          </div>
          <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white">
            Engineering Excellence at Department of ${dept.name}
          </h3>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            ${dept.overview} ${slug === 'civil' ? 'The curriculum provides SLQF Level 8 and Washington Accord recognized training in structural mechanics, soil & geotechnical foundations, hydraulic wave flumes, environmental water systems, and transportation infrastructure.' : (slug === 'computer' ? 'The curriculum delivers SLQF Level 8 and IESL recognized mastery across Artificial Intelligence, GPU high-performance clusters, edge robotics, distributed cloud architecture, cyber security, and scalable software systems.' : (slug === 'electrical' ? 'The curriculum delivers SLQF Level 8 training across renewable smart grids, high-voltage stability, industrial power electronic drives, VLSI microelectronics, biomedical instrumentation, and 5G/6G telecommunications.' : (slug === 'mechanical' ? 'The curriculum provides SLQF Level 8 training across precision CNC machining, CAD/CAM prototyping, thermodynamics, IC engines, renewable thermal power, aerodynamics, and mechatronic robotics automation.' : 'Functions as the intellectual cornerstone for all four engineering disciplines, delivering advanced engineering mathematics, computational numerical simulations, operations research, engineering management, entrepreneurship, and environmental law.')))} Undergraduates engage in rigorous experiential learning combining theoretical foundations, specialized laboratory testing, and industrial training.
          </p>
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span class="font-bold block">${slug === 'interdisciplinary' ? 'Academic Program Role:' : 'Degree Awarded:'}</span>
            <p class="font-mono">${dept.degree}</p>
          </div>
        </div>

        <!-- Key Laboratories Card -->
        <div class="ios27-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              <span>🔬</span>
              <span>Research & Instructional Laboratories</span>
            </div>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${dept.keyLabs.length} Specialized Bays</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            ${dept.keyLabs.map(lab => `
              <div class="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-start gap-3 hover:border-amber-400/50 transition-colors">
                <span class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">⚡</span>
                <div>
                  <h4 class="font-bold text-xs text-slate-900 dark:text-white leading-tight">${lab}</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Faculty Complex Mattegoda</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Minors, Careers & Contact -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Minor Options -->
        <div class="ios27-glass rounded-3xl p-6 space-y-3">
          <span class="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">Specialization Minors:</span>
          <div class="flex flex-wrap gap-2">
            ${(dept.minorOptions || []).map(opt => `
              <span class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 shadow-sm">
                ${opt}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Career Pathways -->
        <div class="ios27-glass rounded-3xl p-6 space-y-3">
          <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Career Pathways:</span>
          <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            ${(dept.careerOpportunities || []).map(opp => `
              <li class="flex items-start gap-2">
                <span class="text-emerald-500 font-bold">✓</span>
                <span>${opp}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Department Headquarters Card -->
        <div class="ios27-glass rounded-3xl p-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-white uppercase tracking-wider block">Headquarters:</span>
          <p>Faculty of Engineering, University of Sri Jayewardenepura, Mattegoda, Sri Lanka</p>
          <div class="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1 text-[11px]">
            <p>📞 Phone: +94 11 273 1582</p>
            <p>✉️ Email: foe@sjp.ac.lk</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================================================================
         STAFF SECTION: Live queried from Supabase 'department_staff' table
         Two Distinct Photo Grids: Academic Staff & Non-Academic Staff
         ==================================================================== -->
    <div id="dept-staff-section" class="pt-6 space-y-10">
      
      <!-- Section Title & Supabase Status Badge -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <span class="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Faculty & Staff Directory</span>
          </span>
          <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Department of ${dept.name} Members
          </h2>
        </div>
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
          <span>⚡</span>
          <span>Verified Department Directory</span>
        </div>
      </div>

      <!-- GRID 1: Academic Staff -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎓</span>
              <span>Academic Staff & Scholars</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300" id="academic-staff-count">Loading...</span>
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Professors, Senior Lecturers, and Research Faculty driving world-class engineering education and innovation.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="dept-academic-staff-grid">
          <!-- Injected via fetchAndRenderDepartmentStaff() -->
        </div>
      </div>

      <!-- GRID 2: Non-Academic Staff -->
      <div class="space-y-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚙️</span>
              <span>Technical & Administrative Staff</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-300" id="non-academic-staff-count">Loading...</span>
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Technical officers, lab superintendents, and administrative personnel ensuring smooth operations across all laboratories and workshops.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="dept-non-academic-staff-grid">
          <!-- Injected via fetchAndRenderDepartmentStaff() -->
        </div>
      </div>

    </div>
  `;

  // Attach back button listener
  const backBtn = document.getElementById('btn-back-to-departments');
  if (backBtn) {
    backBtn.addEventListener('click', hideDepartmentDetail);
  }

  // Attach department switcher pills listeners
  container.querySelectorAll('.dept-switcher-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSlug = btn.getAttribute('data-slug');
      showDepartmentDetail(targetSlug);
    });
  });
}

/**
 * Fetch Data from 'department_staff' Table in Supabase & Render Two Photo Grids
 */
async function fetchAndRenderDepartmentStaff(slug, dept) {
  const academicGrid = document.getElementById('dept-academic-staff-grid');
  const nonAcademicGrid = document.getElementById('dept-non-academic-staff-grid');
  const academicCount = document.getElementById('academic-staff-count');
  const nonAcademicCount = document.getElementById('non-academic-staff-count');

  if (!academicGrid || !nonAcademicGrid) return;

  const skeletonHtml = Array(4).fill(0).map(() => `
    <div class="ios27-card rounded-3xl p-5 flex flex-col items-center text-center space-y-3 animate-pulse">
      <div class="w-24 h-24 rounded-2xl bg-slate-300 dark:bg-white/10"></div>
      <div class="w-3/4 h-4 rounded bg-slate-300 dark:bg-white/10"></div>
      <div class="w-1/2 h-3 rounded bg-slate-200 dark:bg-white/5"></div>
      <div class="w-1/3 h-5 rounded-full bg-slate-200 dark:bg-white/5"></div>
    </div>
  `).join('');

  academicGrid.innerHTML = skeletonHtml;
  nonAcademicGrid.innerHTML = skeletonHtml;

  const supabaseDeptId = DEPT_ID_MAP[slug] || 2;
  const keyword = DEPT_KEYWORD_MAP[slug] || slug;

  let staff = [];

  try {
    if (supabase) {
      // 1. Fetch by department_id
      const { data, error } = await supabase
        .from('department_staff')
        .select('*')
        .eq('department_id', supabaseDeptId)
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        staff = data;
      } else {
        // Fallback by designation
        const { data: d2 } = await supabase
          .from('department_staff')
          .select('*')
          .ilike('designation', `%${keyword}%`)
          .order('id', { ascending: true });
        if (d2 && d2.length > 0) staff = d2;
      }
    }
  } catch (err) {
    console.error('Error fetching department_staff from Supabase:', err);
  }

  // Separate staff into Academic and Non-Academic
  const academic = staff.filter(s => (s.staff_type || '').toLowerCase().includes('academic') && !(s.staff_type || '').toLowerCase().includes('non'));
  const nonAcademic = staff.filter(s => (s.staff_type || '').toLowerCase().includes('non'));

  if (academicCount) academicCount.textContent = `${academic.length} Members`;
  if (nonAcademicCount) nonAcademicCount.textContent = `${nonAcademic.length} Members`;

  // Render Academic Staff Grid
  if (academic.length === 0) {
    academicGrid.innerHTML = `
      <div class="col-span-full p-8 text-center text-slate-500 dark:text-slate-400 ios27-card rounded-2xl">
        <p class="text-xs font-semibold">No academic staff records currently listed for this department.</p>
      </div>
    `;
  } else {
    academicGrid.innerHTML = academic.map(person => renderStaffCardHtml(person, 'academic', dept)).join('');
  }

  // Render Non-Academic Staff Grid
  if (nonAcademic.length === 0) {
    nonAcademicGrid.innerHTML = `
      <div class="col-span-full p-8 text-center text-slate-500 dark:text-slate-400 ios27-card rounded-2xl">
        <p class="text-xs font-semibold">No non-academic staff records currently listed for this department.</p>
      </div>
    `;
  } else {
    nonAcademicGrid.innerHTML = nonAcademic.map(person => renderStaffCardHtml(person, 'non-academic', dept)).join('');
  }

  // Attach click listener to each card to open full detailed staff modal
  document.querySelectorAll('.staff-card-trigger').forEach(card => {
    card.addEventListener('click', () => {
      const rawData = card.getAttribute('data-person');
      if (rawData) {
        try {
          const person = JSON.parse(decodeURIComponent(rawData));
          openStaffModal(person);
        } catch (e) {
          console.error(e);
        }
      }
    });
  });
}

/**
 * Check if a URL represents a genuine portrait photo rather than a campus/building asset
 */
function isValidProfilePhoto(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;

  const nonProfileKeywords = [
    'building',
    'b1_new',
    'library',
    'pxl_',
    'micromaze',
    'national-ai-awards',
    'img_4366',
    'image_fjg1',
    'test24',
    'campus',
    'notice',
    'web-notice',
    'placeholder'
  ];
  const lower = trimmed.toLowerCase();
  for (const kw of nonProfileKeywords) {
    if (lower.includes(kw)) return false;
  }
  return true;
}

/**
 * Extract clean initials from person name (e.g. Prof. Chaminda Gallage -> CG)
 */
function getPersonInitials(name) {
  if (!name) return 'FOE';
  const cleanName = name.replace(/^(Prof\.|Dr\.|Eng\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return 'FOE';
}

/**
 * Generate Person Logo HTML markup to convince viewers there is a person
 */
function renderPersonLogoHtml(person, isAcademic) {
  const initials = getPersonInitials(person.name);
  const themeAccent = isAcademic ? 'amber' : 'sky';
  const roleSymbol = isAcademic ? '🎓' : '⚙️';
  const roleLabel = isAcademic ? 'Academic' : 'Technical';

  return `
    <div class="w-full h-full rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800/95 dark:to-slate-900 border border-slate-200 dark:border-white/10 select-none shadow-inner" title="${escapeHtml(person.name)} (${roleLabel} Staff)">
      <!-- Subtle ambient halo -->
      <div class="absolute inset-0 bg-radial from-${themeAccent}-500/15 to-transparent pointer-events-none"></div>

      <!-- Universal Person Profile Silhouette Logo -->
      <div class="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-white/10 text-${themeAccent}-600 dark:text-${themeAccent}-300 border border-${themeAccent}-400/40 shadow-sm">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Person Initials Badge -->
      <span class="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full mt-1.5 bg-${themeAccent}-500/15 text-${themeAccent}-800 dark:text-${themeAccent}-300 border border-${themeAccent}-500/30 flex items-center gap-1 shadow-xs">
        <span>${roleSymbol}</span>
        <span>${initials}</span>
      </span>
    </div>
  `;
}

/**
 * Render Staff Card HTML with Photo or Person Logo, Name, and Designation
 */
function renderStaffCardHtml(person, type, dept) {
  const isAcademic = type === 'academic';
  const roleBadge = isAcademic ? 'Academic Staff' : 'Technical & Admin';
  const badgeClasses = isAcademic 
    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30' 
    : 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-500/30';
  const ringColor = isAcademic ? 'border-amber-400/50 shadow-amber-500/10' : 'border-sky-400/50 shadow-sky-500/10';

  const hasPhoto = isValidProfilePhoto(person.image_url);
  const logoHtml = renderPersonLogoHtml(person, isAcademic);
  const jsonStr = encodeURIComponent(JSON.stringify(person));

  return `
    <article 
      class="staff-photo-card staff-card-trigger ios27-card group relative flex flex-col items-center text-center p-6 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/30 border border-slate-200/90 dark:border-white/15 hover:border-amber-400/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
      data-person="${jsonStr}"
      tabindex="0"
      role="button"
      aria-label="${escapeHtml(person.name)} - ${escapeHtml(person.designation)}"
    >
      <!-- Top Radiant Aura Accent -->
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>

      <!-- Avatar Frame: Displays authentic portrait if available, otherwise renders the person logo -->
      <div class="relative w-28 h-28 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-amber-500/40 via-transparent to-amber-300/40 border-2 ${ringColor} shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500">
        ${hasPhoto ? `
          <img 
            src="${person.image_url}" 
            alt="${escapeHtml(person.name)}" 
            class="w-full h-full object-cover rounded-xl"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');"
          />
          <div class="hidden w-full h-full">
            ${logoHtml}
          </div>
        ` : `
          <div class="w-full h-full">
            ${logoHtml}
          </div>
        `}
      </div>

      <!-- Staff Details: Name and Designation -->
      <div class="space-y-1.5 w-full flex-1 flex flex-col justify-between">
        <div>
          <h4 class="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            ${escapeHtml(person.name)}
          </h4>
          <p class="text-xs text-amber-700 dark:text-amber-300/90 font-medium line-clamp-2 leading-tight mt-1">
            ${escapeHtml(person.designation)}
          </p>
        </div>
      </div>

      <!-- Footer Badge & Profile Action -->
      <div class="pt-3 mt-3 w-full border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px]">
        <span class="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] border ${badgeClasses}">
          ${roleBadge}
        </span>
        <span class="text-amber-600 dark:text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>Profile</span>
          <span>↗</span>
        </span>
      </div>
    </article>
  `;
}

// Make functions accessible globally
if (typeof window !== 'undefined') {
  window.showDepartmentDetail = showDepartmentDetail;
  window.hideDepartmentDetail = hideDepartmentDetail;
}

/**
 * Resolves facility image URLs, automatically converting Google Drive sharing links
 * into high-res direct image links and providing contextual faculty fallbacks.
 * Enforces iconic images for Auditorium (11audi.jpg), Outdoor Theatre (22outaudi.jpg),
 * and Center for Fire Safety Engineering (33fire.jpg).
 */
export function resolveFacilityImageUrl(url, title = '') {
  const t = (title || '').toLowerCase();
  const u = (url || '').toLowerCase();

  // 1. Center for Fire Safety Engineering iconic image
  if (t.includes('fire safety') || t.includes('cfse') || u.includes('33fire')) {
    return '33fire.jpg';
  }
  // 2. Outdoor Theatre / Open-Air Auditorium iconic image
  if (t.includes('outdoor') || t.includes('amphitheatre') || t.includes('open-air') || (t.includes('theatre') && !t.includes('lecture')) || u.includes('22outaudi')) {
    return '22outaudi.jpg';
  }
  // 3. Main Auditorium iconic image
  if (t.includes('auditorium') || u.includes('11audi')) {
    return '11audi.jpg';
  }
  // 4. Gym Canteen iconic AI image
  if (t.includes('gym canteen') || u.includes('gym_canteen')) {
    return 'gym_canteen.jpg';
  }
  // 5. Main Canteen iconic AI image
  if (t.includes('main canteen') || (t.includes('canteen') && !t.includes('gym')) || u.includes('main_canteen')) {
    return 'main_canteen.jpg';
  }
  // 6. Kids Play Area iconic AI image
  if (t.includes('kids') || t.includes('play') || u.includes('kids_play_area')) {
    return 'kids_play_area.jpg';
  }

  if (url === '11audi.jpg' || url === '22outaudi.jpg' || url === '33fire.jpg' || url === 'main_canteen.jpg' || url === 'gym_canteen.jpg' || url === 'kids_play_area.jpg') {
    return url;
  }

  // Allow direct Supabase storage public URLs
  if (url && url.includes('supabase.co/storage/v1/object/public/facilities/')) {
    return url;
  }

  if (!url || url === 'REPLACE_WITH_IMAGE_URL') {
    return getContextualFacilityImage(title);
  }
  // Convert Google Drive share link (e.g., https://drive.google.com/file/d/ID/view) to direct embeddable image
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  // If it's a non-image URL like a Facebook share page, use contextual verified image
  if (url.includes('facebook.com') || url.includes('/share/')) {
    return getContextualFacilityImage(title);
  }
  return url;
}

/**
 * Returns authentic faculty photograph for a given facility title
 */
export function getContextualFacilityImage(title = '') {
  const t = (title || '').toLowerCase();
  if (t.includes('fire safety') || t.includes('cfse')) {
    return '33fire.jpg';
  }
  if (t.includes('outdoor') || t.includes('amphitheatre') || t.includes('open-air') || (t.includes('theatre') && !t.includes('lecture'))) {
    return '22outaudi.jpg';
  }
  if (t.includes('auditorium')) {
    return '11audi.jpg';
  }
  if (t.includes('gym canteen')) {
    return 'gym_canteen.jpg';
  }
  if (t.includes('gym') || t.includes('fitness')) {
    return 'https://lh3.googleusercontent.com/d/1hF9PiVfa6hy_pgaZlqhtxU9Wov1g2iX5';
  }
  if (t.includes('main canteen') || t.includes('canteen')) {
    return 'main_canteen.jpg';
  }
  if (t.includes('food court')) {
    return 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/Image_fjg1tafjg1tafjg1.png';
  }
  if (t.includes('kids') || t.includes('play')) {
    return 'kids_play_area.jpg';
  }
  if (t.includes('library')) {
    return 'https://eng.sjp.ac.lk/wp-content/uploads/2026/09/FOE-Library-1-1.jpg';
  }
  if (t.includes('itc') || t.includes('information tech')) {
    return 'https://eng.sjp.ac.lk/wp-content/uploads/2026/09/IT-Center.jpg';
  }
  return 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';
}

/**
 * Dynamically fetches all facilities from the Supabase 'facilities' table
 * and merges them with rich local metadata (specs, galleries, features).
 */
export async function fetchFacilitiesFromSupabase() {
  try {
    const localList = FOE_DATA.facilities || [];
    if (!supabase) {
      state.facilities = localList;
      return localList;
    }

    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      state.facilities = localList;
      return localList;
    }

    const normKey = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '');
    const mergedMap = new Map();

    // 1. Populate with local definitions so every facility has rich default specs & features
    for (const loc of localList) {
      mergedMap.set(normKey(loc.title), { ...loc });
    }

    // 2. Overlay live Supabase records
    for (const row of data) {
      const key = normKey(row.title);
      const existing = mergedMap.get(key) || {};
      const img = resolveFacilityImageUrl(row.image_url || existing.image, row.title);

      const resolved = {
        ...existing,
        id: existing.id || `fac-${row.id}`,
        supabaseId: row.id,
        title: row.title || existing.title,
        shortDesc: row.description || existing.shortDesc || existing.description || '',
        description: row.description || existing.shortDesc || '',
        fullDesc: row.detailed_content || existing.fullDesc || row.description || '',
        detailed_content: row.detailed_content || existing.fullDesc || row.description || '',
        image: img,
        image_url: img,
        isFeatured: row.is_highlighted || existing.isFeatured || false,
        category: existing.category || (row.title && (row.title.toLowerCase().includes('canteen') || row.title.toLowerCase().includes('food')) ? 'dining' : 'welfare'),
        categoryName: existing.categoryName || (row.title && (row.title.toLowerCase().includes('canteen') || row.title.toLowerCase().includes('food')) ? 'Campus Dining & Cafeteria' : 'Student Welfare & Recreation'),
        dept: existing.dept || 'Faculty of Engineering',
        badge: existing.badge || 'Faculty Facility',
        location: existing.location || 'Mattegoda Complex',
        hours: existing.hours || 'Mon - Fri: 8:00 AM - 5:00 PM',
        features: existing.features || [
          'Modern infrastructure and student-friendly amenities',
          'Supervised by certified faculty administration',
          'Open for undergraduates, academic researchers and staff'
        ],
        specs: existing.specs || [
          { label: 'Campus Location', value: existing.location || 'Mattegoda Complex' },
          { label: 'Administration', value: existing.dept || 'Faculty of Engineering' },
          { label: 'Facility Access', value: 'All Faculty Members & Students' }
        ],
        gallery: (existing.gallery && existing.gallery.length > 0)
          ? existing.gallery.map(g => ({ ...g, url: resolveFacilityImageUrl(g.url, g.title || row.title) }))
          : [
              { url: img, title: row.title, desc: 'Primary Perspective' },
              { url: 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg', title: 'Mattegoda Complex View', desc: 'Exterior and architectural perspective' }
            ]
      };

      mergedMap.set(key, resolved);
    }

    state.facilities = Array.from(mergedMap.values());

    // Synchronize GYM, GYM-CAFE & Electrical Department map images with exact Supabase images
    if (FOE_DATA && FOE_DATA.mapZones) {
      const gymFac = state.facilities.find(f => f.id === 'fac-gym' || (f.title && f.title.toLowerCase().includes('gymnasium')));
      const gymCafeFac = state.facilities.find(f => f.id === 'fac-gym-canteen' || (f.title && f.title.toLowerCase().includes('gym canteen')));
      const zoneGym = FOE_DATA.mapZones.find(z => z.id === 'zone-gym' || z.code === 'GYM');
      if (zoneGym && gymFac && (gymFac.image || gymFac.image_url)) {
        zoneGym.image = gymFac.image || gymFac.image_url;
        zoneGym.showImageOnMap = true;
      }
      const zoneGymCafe = FOE_DATA.mapZones.find(z => z.id === 'zone-gym-canteen' || z.code === 'GYM-CAFE');
      if (zoneGymCafe && gymCafeFac && (gymCafeFac.image || gymCafeFac.image_url)) {
        zoneGymCafe.image = gymCafeFac.image || gymCafeFac.image_url;
        zoneGymCafe.showImageOnMap = true;
      }
      const zoneEE = FOE_DATA.mapZones.find(z => z.id === 'zone-electrical' || z.code === 'EE');
      if (zoneEE) {
        zoneEE.image = 'https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg';
        zoneEE.showImageOnMap = true;
      }
    }

    return state.facilities;
  } catch (err) {
    console.warn('Error fetching facilities from Supabase:', err);
    state.facilities = FOE_DATA.facilities || [];
    return state.facilities;
  }
}

/**
 * Render Facilities & Specialized Labs
 */
let currentFacFilter = 'all';

export async function renderFacilities(category = currentFacFilter) {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  currentFacFilter = category;
  container.innerHTML = '';

  // Ensure facilities are fetched from Supabase
  if (!state.facilities || state.facilities.length === 0) {
    await fetchFacilitiesFromSupabase();
  }

  const allFacs = (state.facilities && state.facilities.length > 0) ? state.facilities : (FOE_DATA.facilities || []);

  // Update total count indicator in category pill
  const countEl = document.getElementById('fac-filter-count-all');
  if (countEl) countEl.textContent = `(${allFacs.length})`;

  let filtered = allFacs;
  if (category === 'featured') {
    filtered = allFacs.filter(f => f.isFeatured || f.id === 'fac-cfse' || f.id === 'fac-auditorium' || (f.title && (f.title.toLowerCase().includes('fire safety') || f.title.toLowerCase().includes('auditorium'))));
  } else if (category === 'dining') {
    filtered = allFacs.filter(f => f.category === 'dining' || (f.title && (f.title.toLowerCase().includes('canteen') || f.title.toLowerCase().includes('food'))));
  } else if (category === 'welfare') {
    filtered = allFacs.filter(f => f.category === 'welfare');
  } else if (category !== 'all') {
    filtered = allFacs.filter(f => f.category === category);
  }

  // Ensure Center for Fire Safety Engineering and Full Functioned Auditorium are always presented prominently at the front when category === 'all'
  if (category === 'all') {
    const fireSafety = filtered.find(f => f.id === 'fac-cfse' || (f.title && f.title.toLowerCase().includes('fire safety')));
    const auditorium = filtered.find(f => f.id === 'fac-auditorium' || (f.title && f.title.toLowerCase().includes('auditorium')));
    const others = filtered.filter(f => f !== fireSafety && f !== auditorium);
    filtered = [fireSafety, auditorium, ...others].filter(Boolean);
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach(fac => {
    const isFireSafety = fac.id === 'fac-cfse' || (fac.title && fac.title.toLowerCase().includes('fire safety'));
    const isAuditorium = fac.id === 'fac-auditorium' || (fac.title && fac.title.toLowerCase().includes('auditorium'));

    const card = document.createElement('article');
    card.id = `facility-card-${fac.id}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View detailed specifications and photo gallery for ${fac.title}`);

    if (isFireSafety) {
      card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-2 cursor-pointer facility-card-featured-fire col-span-1 md:col-span-2 lg:col-span-2';

      card.innerHTML = `
        <div class="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-3xl bg-slate-900">
          <img 
            src="${fac.image}" 
            alt="${fac.title}" 
            class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none"></div>
          
          <div class="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 z-10 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase text-white shadow-xl featured-fire-badge border border-orange-300/50">
              <span class="animate-pulse">🔥</span>
              <span>FEATURED PREMIER RESEARCH CENTER</span>
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/70 text-amber-300 border border-amber-500/40">
              🏛️ Mattegoda Heavy Structures Complex
            </span>
          </div>

          <div class="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 z-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/80 text-white border border-white/20 shadow-lg">
              <span>📸</span>
              <span>${(fac.gallery || []).length || 3} Multi-Angle Photos</span>
            </span>
          </div>

          <div class="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none flex items-end justify-between">
            <div>
              <span class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-orange-600/90 backdrop-blur-md border border-orange-400/40 text-amber-100 font-bold">
                National Fire Resistance & CFD Modeling Authority
              </span>
              <p class="text-xs font-medium text-slate-200 mt-1 hidden sm:block">Conforming to ISO 834, BS 476, ASTM E119 & NFPA 101 Standards</p>
            </div>
            <span class="text-xs text-amber-300 font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-amber-400/30 hidden sm:inline-block">
              Click to Open Full View ➔
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-slate-50/70 dark:bg-white/[0.04]">
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
              <span>${fac.dept}</span>
              <span class="text-slate-500 dark:text-slate-400 font-normal">📍 Mattegoda Campus</span>
            </div>
            
            <h3 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
              ${fac.title}
            </h3>
            
            <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed font-normal">
              ${fac.shortDesc}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div class="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-xs">
                <span class="text-[10px] uppercase font-mono text-orange-800 dark:text-orange-300 font-bold block">🔥 Furnace Capacity</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">Up to 1200°C Time-Temperature Curve</span>
              </div>
              <div class="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 text-xs">
                <span class="text-[10px] uppercase font-mono text-orange-800 dark:text-orange-300 font-bold block">💻 Fire Dynamics Cluster</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">64-Core GPU/CPU FDS & Smokeview Simulation</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
              <span class="text-[11px] font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider block">Key Capabilities & Apparatus:</span>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                ${(fac.features || []).slice(0, 4).map(feat => `<li class="flex items-start gap-1.5"><span class="text-orange-500 font-bold mt-0.5">✓</span><span>${feat}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span class="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span>🕒</span>
              <span>${fac.hours.split('|')[0]}</span>
            </span>
            <div class="flex items-center gap-2">
              <button type="button" data-action="locate" class="locate-btn inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer">
                <span>Map</span>
                <span>📍</span>
              </button>
              <button type="button" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-all">
                <span>Explore Full Details & Photos</span>
                <span class="group-hover:translate-x-1 transition-transform">➔</span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (isAuditorium) {
      card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-2 cursor-pointer facility-card-featured-auditorium col-span-1 md:col-span-2 lg:col-span-2';

      card.innerHTML = `
        <div class="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-3xl bg-slate-900">
          <img 
            src="${fac.image}" 
            alt="${fac.title}" 
            class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none"></div>
          
          <div class="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 z-10 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase text-slate-950 shadow-xl featured-shimmer-badge border border-amber-200/60">
              <span class="animate-pulse">⭐</span>
              <span>FEATURED GRAND AUDITORIUM (650 SEATS)</span>
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/70 text-amber-300 border border-amber-500/40">
              🎭 Grand Performing Arts & Convention Arena
            </span>
          </div>

          <div class="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 z-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-black/80 text-white border border-white/20 shadow-lg">
              <span>📸</span>
              <span>${(fac.gallery || []).length || 3} Multi-Angle Photos</span>
            </span>
          </div>

          <div class="absolute bottom-3.5 left-4 right-4 text-white pointer-events-none flex items-end justify-between">
            <div>
              <span class="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-md border border-amber-400/40 text-slate-950 font-bold">
                ConTRE International Research Symposium Host Venue
              </span>
              <p class="text-xs font-medium text-slate-200 mt-1 hidden sm:block">Acoustic Timber Diffusers (RT60 = 1.1s) & Yamaha Dante Line-Array</p>
            </div>
            <span class="text-xs text-amber-300 font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-amber-400/30 hidden sm:inline-block">
              Click to Open Full View ➔
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-slate-50/70 dark:bg-white/[0.04]">
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <span>${fac.dept}</span>
              <span class="text-slate-500 dark:text-slate-400 font-normal">📍 Central Academic Block</span>
            </div>
            
            <h3 class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-tight">
              ${fac.title}
            </h3>
            
            <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200/90 leading-relaxed font-normal">
              ${fac.shortDesc}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs">
                <span class="text-[10px] uppercase font-mono text-amber-800 dark:text-amber-300 font-bold block">🎭 Seating Capacity</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">650 Tiered Cushioned Theater Seats with VIP Box</span>
              </div>
              <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs">
                <span class="text-[10px] uppercase font-mono text-amber-800 dark:text-amber-300 font-bold block">🔊 Stage Rigging & AV</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">4K Laser 15,000 Lumens & 32-Ch Dante Digital Audio</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
              <span class="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">Key Facilities & Architecture:</span>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                ${(fac.features || []).slice(0, 4).map(feat => `<li class="flex items-start gap-1.5"><span class="text-amber-500 font-bold mt-0.5">✓</span><span>${feat}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span class="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <span>🕒</span>
              <span>${fac.hours.split('|')[0]}</span>
            </span>
            <div class="flex items-center gap-2">
              <button type="button" data-action="locate" class="locate-btn inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all cursor-pointer">
                <span>Map</span>
                <span>📍</span>
              </button>
              <button type="button" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all">
                <span>Explore Full Details & Photos</span>
                <span class="group-hover:translate-x-1 transition-transform">➔</span>
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      const cardImg = resolveFacilityImageUrl(fac.image || fac.image_url, fac.title);
      const locStr = (fac.location || 'Mattegoda Complex').split(',')[0];
      const hoursStr = (fac.hours || 'Mon - Fri: 8:00 AM - 5:00 PM').split('|')[0];
      const featList = (fac.features && fac.features.length) ? fac.features.slice(0, 3) : ['Modern facilities', 'Supervised campus area'];
      const photoCnt = (fac.gallery && fac.gallery.length) || 2;
      const shortD = fac.shortDesc || fac.description || '';

      card.className = 'ios27-card group relative flex flex-col justify-between overflow-hidden rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/25 border border-slate-200/90 dark:border-white/20 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer col-span-1';

      card.innerHTML = `
        <div class="relative w-full h-52 overflow-hidden rounded-t-3xl bg-slate-900">
          <img 
            src="${cardImg}" 
            alt="${escapeHtml(fac.title)}" 
            class="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
          <span class="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-xl bg-[#5c0919] text-amber-300 border border-amber-400/40 shadow-lg">
            ${escapeHtml(fac.badge || fac.categoryName || 'Campus Facility')}
          </span>
          <span class="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-black/60 text-white border border-white/20">
            📸 ${photoCnt} Photos
          </span>
        </div>

        <div class="p-6 flex flex-col flex-1 justify-between gap-4 backdrop-blur-xl bg-slate-50/50 dark:bg-white/[0.04]">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold">
              <span>${escapeHtml(fac.dept || 'Faculty of Engineering')}</span>
              <span class="text-slate-500 dark:text-slate-400 font-normal">${escapeHtml(locStr)}</span>
            </div>
            <h3 class="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
              ${escapeHtml(fac.title)}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300/85 leading-relaxed font-normal">${escapeHtml(shortD)}</p>

            <div class="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1">
              <span class="text-[11px] font-bold text-amber-700 dark:text-amber-200/90 uppercase tracking-wider block">Key Highlights:</span>
              <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                ${featList.map(feat => `<li class="flex items-center gap-1.5"><span class="text-amber-500 font-bold">✓</span><span>${escapeHtml(feat)}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>🕒 ${escapeHtml(hoursStr)}</span>
            <div class="flex items-center gap-2">
              <button type="button" data-action="locate" class="locate-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 transition-all cursor-pointer">
                <span>Map</span>
                <span>📍</span>
              </button>
              <span class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                <span>Details</span>
                <span>➔</span>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    // Attach click handler to card to open detailed view modal
    card.addEventListener('click', (e) => {
      if (e.target.closest('button[data-action="locate"]') || e.target.closest('.locate-btn')) {
        e.stopPropagation();
        switchTab('map');
        return;
      }
      openFacilityModal(fac);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFacilityModal(fac);
      }
    });

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  // Update category buttons active state
  document.querySelectorAll('#facilities-filter-bar .fac-filter-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-category') === category;
    if (isTarget) {
      btn.className = 'fac-filter-btn active-fac px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md bg-amber-500 text-black border border-amber-400 shadow-md transition-all cursor-pointer';
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
  const tooltipImgBox = document.getElementById('tooltip-img-box');
  const tooltipImg = document.getElementById('tooltip-img');
  const tooltipIcon = document.getElementById('tooltip-icon');
  const tooltipCat = document.getElementById('tooltip-category');
  const tooltipCode = document.getElementById('tooltip-code');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipFloors = document.getElementById('tooltip-floors');

  // Inspector DOM Elements
  const elImgBox = document.getElementById('inspector-img-box');
  const elImg = document.getElementById('inspector-img');
  const elIconBadge = document.getElementById('inspector-icon-badge');
  const elCode = document.getElementById('inspector-code');
  const elTag = document.getElementById('inspector-tag');
  const elHours = document.getElementById('inspector-hours');
  const elName = document.getElementById('inspector-name');
  const elDesc = document.getElementById('inspector-desc');
  const elFloors = document.getElementById('inspector-floors');
  const elHighlights = document.getElementById('inspector-highlights');
  const elBtnDept = document.getElementById('btn-inspector-locate-dept');

  /**
   * Synchronize GYM & GYM-CAFE image URLs with exact records from Other Facilities (Supabase)
   */
  const syncGymMapImages = () => {
    const facs = (state.facilities && state.facilities.length > 0) ? state.facilities : (FOE_DATA.facilities || []);
    const gymFac = facs.find(f => f.id === 'fac-gym' || (f.title && f.title.toLowerCase().includes('gymnasium')));
    const gymCafeFac = facs.find(f => f.id === 'fac-gym-canteen' || (f.title && f.title.toLowerCase().includes('gym canteen')));

    const zoneGym = mapZones.find(z => z.id === 'zone-gym' || z.code === 'GYM');
    if (zoneGym) {
      if (gymFac && (gymFac.image || gymFac.image_url)) {
        zoneGym.image = gymFac.image || gymFac.image_url;
      } else {
        zoneGym.image = 'https://lh3.googleusercontent.com/d/1hF9PiVfa6hy_pgaZlqhtxU9Wov1g2iX5';
      }
      zoneGym.showImageOnMap = true;
    }

    const zoneGymCafe = mapZones.find(z => z.id === 'zone-gym-canteen' || z.code === 'GYM-CAFE');
    if (zoneGymCafe) {
      if (gymCafeFac && (gymCafeFac.image || gymCafeFac.image_url)) {
        zoneGymCafe.image = gymCafeFac.image || gymCafeFac.image_url;
      } else {
        zoneGymCafe.image = 'https://zzirxpncvhqxhcjgbuek.supabase.co/storage/v1/object/public/facilities/gym_canteen.jpg';
      }
      zoneGymCafe.showImageOnMap = true;
    }

    const zoneEE = mapZones.find(z => z.id === 'zone-electrical' || z.code === 'EE');
    if (zoneEE) {
      const eeDept = (FOE_DATA.departments || []).find(d => d.id === 'electrical');
      zoneEE.image = (eeDept && eeDept.image) || 'https://eng.sjp.ac.lk/wp-content/uploads/2025/01/deptee.jpg';
      zoneEE.showImageOnMap = true;
    }
  };

  syncGymMapImages();

  /**
   * Helper to return clean, modern, ultra-crisp SVG icons for map zones
   */
  const getZoneSvg = (zone, size = 24) => {
    if (!zone) return '';
    const type = (zone.type || '').toLowerCase();
    const id = (zone.id || '').toLowerCase();
    const category = (zone.category || '').toLowerCase();

    // 1. Laboratories & Advanced Research (Erlenmeyer lab flask with bubbling molecules)
    if (type === 'research' || id.includes('research') || id.includes('rcfe')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M10 2v5.5L4.4 17.5A2.8 2.8 0 0 0 6.8 22h10.4a2.8 2.8 0 0 0 2.4-4.5L14 7.5V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
        <circle cx="10" cy="18.5" r="1" fill="currentColor" />
        <circle cx="14" cy="18" r="1.5" fill="currentColor" />
        <path d="M11 12h2" />
        <path d="M10 9.5h4" />
      </svg>`;
    }

    // 2. Central Engineering Library (Open academic tome with bookmark)
    if (type === 'library' || id.includes('library')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        <path d="M6 8h2" />
        <path d="M6 12h2" />
        <path d="M16 8h2" />
        <path d="M16 12h2" />
      </svg>`;
    }

    // 3. Civil Engineering (Tower Crane & Structural Heavy Testing Bay)
    if (type === 'civil' || id.includes('civil')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M4 21V4l16-2v4H8" />
        <path d="M4 11h16" />
        <path d="M4 16h12" />
        <path d="M8 4l8 7" />
        <path d="M8 11l8 5" />
        <path d="M2 21h8" />
        <circle cx="18" cy="9" r="2" />
        <path d="M18 11v6" />
        <polygon points="16 17 20 17 18 20" fill="currentColor" />
      </svg>`;
    }

    // 4. Mechanical Engineering (Precision Dual Interlocking Gears)
    if (type === 'mechanical' || id.includes('mech')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <circle cx="9" cy="9" r="3" />
        <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.05 4.05l1.41 1.41M12.54 12.54l1.41 1.41M4.05 13.95l1.41-1.41M12.54 5.46l1.41-1.41" />
        <circle cx="17.5" cy="17.5" r="2" />
        <path d="M17.5 12.5v1.5M17.5 21v1.5M12.5 17.5h1.5M21 17.5h1.5M14 14l1 1M20 20l1 1M14 21l1-1M20 15l1-1" />
      </svg>`;
    }

    // 5. Computer Engineering (Silicon Microchip CPU Processor)
    if (type === 'computer' || id.includes('computer')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="8.5" y="8.5" width="7" height="7" rx="1" fill="currentColor" fill-opacity="0.25" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>`;
    }

    // 6. Electrical & Electronic Engineering (High-Voltage Lightning Energy Shield)
    if (type === 'electrical' || id.includes('electrical')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.2" />
        <circle cx="12" cy="12" r="9.5" stroke-dasharray="3 3" opacity="0.6" />
      </svg>`;
    }

    // 7. Interdisciplinary Studies (Multi-disciplinary Connected Nodes)
    if (type === 'interdisciplinary' || id.includes('dis') || id.includes('is')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <circle cx="12" cy="5" r="2.5" fill="currentColor" fill-opacity="0.25" />
        <circle cx="5" cy="18" r="2.5" fill="currentColor" fill-opacity="0.25" />
        <circle cx="19" cy="18" r="2.5" fill="currentColor" fill-opacity="0.25" />
        <circle cx="12" cy="13" r="1.5" fill="currentColor" />
        <path d="M12 7.5v4M10.7 13.8L6.8 16.5M13.3 13.8l3.9 2.7M6.8 16.5h10.4" />
      </svg>`;
    }

    // 8. Administration & Dean's Secretariat (Colonnaded Classical Portico)
    if (type === 'admin' || category === 'administrative' || id.includes('admin')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <polygon points="12 2 2 7 22 7" fill="currentColor" fill-opacity="0.2" />
        <path d="M4 7v11M8 7v11M12 7v11M16 7v11M20 7v11" />
        <path d="M2 18h20" />
        <path d="M1 21h22" />
        <circle cx="12" cy="5" r="0.8" fill="currentColor" />
      </svg>`;
    }

    // 9. Auditorium (Grand Tiered Lecture Amphitheatre)
    if (type === 'auditorium' || id.includes('aud')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <path d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5" />
        <path d="M10 20c0-1.1.9-2 2-2s2 .9 2 2" />
        <rect x="9.5" y="4" width="5" height="4" rx="1" fill="currentColor" fill-opacity="0.25" />
        <path d="M12 8v2" />
        <path d="M3 3l3 3M21 3l-3 3" />
      </svg>`;
    }

    // 10. Student Common Room (SCR Club Lounge & Armchair)
    if (type === 'scr' || id.includes('scr')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M7 19v2M17 19v2" />
        <path d="M4 11a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <path d="M4 13h16" />
        <path d="M2 12a2 2 0 0 1 2-2h1v5H3a1 1 0 0 1-1-1z" fill="currentColor" fill-opacity="0.2" />
        <path d="M22 12a2 2 0 0 0-2-2h-1v5h2a1 1 0 0 0 1-1z" fill="currentColor" fill-opacity="0.2" />
        <circle cx="12" cy="5" r="1.5" />
      </svg>`;
    }

    // 11. Open-Air Outdoor Theatre
    if (type === 'theatre' || id.includes('theatre')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M2 19c1.5-6 8-9 10-9s8.5 3 10 9" />
        <path d="M5 20c1.2-3.8 5-6 7-6s5.8 2.2 7 6" />
        <path d="M8 21c1-1.8 2.5-3 4-3s3 1.2 4 3" />
        <polygon points="12 2 15 7 9 7" fill="currentColor" fill-opacity="0.3" />
        <circle cx="12" cy="7" r="1" />
      </svg>`;
    }

    // 12. Main Student Canteen (Dining Cloche & Cutlery)
    if (type === 'canteen' || id.includes('canteen')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M3 18h18" />
        <path d="M4 18a8 8 0 0 1 16 0" fill="currentColor" fill-opacity="0.2" />
        <circle cx="12" cy="8" r="1.5" />
        <path d="M12 9.5V10" />
        <path d="M8 5c0 1.5 1 2 1 3" />
        <path d="M12 4c0 1.5 1 2 1 3" />
        <path d="M16 5c0 1.5 1 2 1 3" />
        <path d="M2 21h20" />
      </svg>`;
    }

    // 13. Food Court & Pavilion (Cafe Canopy & Dining)
    if (type === 'food-court' || id.includes('foodcourt')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M3 4h18l-2 5H5L3 4z" fill="currentColor" fill-opacity="0.2" />
        <path d="M5 9v11h14V9" />
        <path d="M9 14h6" />
        <path d="M12 12v4" />
        <circle cx="12" cy="14" r="2.5" />
      </svg>`;
    }

    // 14. Health & Medical Centre (Medical Cross & ECG Pulse)
    if (type === 'medical' || id.includes('medical') || category === 'welfare') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M12 7v10" stroke-width="2.4" />
        <path d="M7 12h10" stroke-width="2.4" />
        <circle cx="12" cy="12" r="1" fill="#fff" />
      </svg>`;
    }

    // 15. Gymnasium & Fitness Centre (Athletic Heavy Dumbbell)
    if (type === 'gym' || id.includes('gym') || category === 'sports') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M6 5v14M18 5v14" stroke-width="2.5" />
        <path d="M3 8v8M21 8v8" stroke-width="2" />
        <path d="M6 12h12" stroke-width="2.5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>`;
    }

    // 16. Gym Canteen & Sports Refreshments (Sports Shaker Bottle)
    if (type === 'gym-canteen' || id.includes('gym-cafe')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
        <path d="M6 7h12l-1.5 13a2 2 0 0 1-2 1.8H9.5a2 2 0 0 1-2-1.8L6 7z" fill="currentColor" fill-opacity="0.2" />
        <path d="M5 4h14a1 1 0 0 1 1 1v2H4V5a1 1 0 0 1 1-1z" />
        <path d="M10 2h4v2h-4z" />
        <line x1="12" y1="11" x2="12" y2="16" />
        <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
      </svg>`;
    }

    // Generic Faculty Department / Academic Building Fallback
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" fill="currentColor" fill-opacity="0.15" />
      <path d="M9 10h1M14 10h1M9 14h1M14 14h1M11 21v-3a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v3" />
    </svg>`;
  };

  /**
   * Display floating glassmorphism tooltip on beacon or building hover
   */
  const showTooltip = (zone) => {
    if (!hoverTooltip || !zone) return;

    // Show verified photo specifically for GYM, GYM-CAFE, and Electrical Engineering Block
    if (tooltipImgBox && tooltipImg) {
      const shouldShowPhoto = zone.id === 'zone-gym' || zone.id === 'zone-gym-canteen' || zone.id === 'zone-electrical' || zone.showImageOnMap;
      if (shouldShowPhoto && zone.image) {
        tooltipImg.src = zone.image;
        tooltipImg.onerror = () => {
          if (zone.id === 'zone-gym-canteen') tooltipImg.src = 'gym_canteen.jpg';
        };
        tooltipImgBox.classList.remove('hidden');
      } else {
        tooltipImgBox.classList.add('hidden');
        tooltipImg.src = '';
      }
    }

    if (tooltipIcon) {
      tooltipIcon.innerHTML = getZoneSvg(zone, 20);
      tooltipIcon.style.color = zone.accent || '#f59e0b';
    }
    if (tooltipCat) tooltipCat.textContent = zone.tag || zone.category;
    if (tooltipCode) {
      tooltipCode.textContent = zone.code;
      tooltipCode.style.backgroundColor = zone.accent || '#f59e0b';
    }
    if (tooltipTitle) tooltipTitle.textContent = zone.shortName || zone.name;
    if (tooltipDesc) tooltipDesc.textContent = zone.desc;
    if (tooltipFloors) {
      const count = zone.floors ? zone.floors.length : 1;
      tooltipFloors.innerHTML = `<span>🏢</span> <span>${count} Level${count > 1 ? 's' : ''} Directory</span>`;
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

    // Show verified photo specifically for GYM, GYM-CAFE, and Electrical Engineering Block
    if (elImgBox && elImg) {
      const shouldShowPhoto = zone.id === 'zone-gym' || zone.id === 'zone-gym-canteen' || zone.id === 'zone-electrical' || zone.showImageOnMap;
      if (shouldShowPhoto && zone.image) {
        elImg.src = zone.image;
        elImg.alt = zone.name;
        elImg.onerror = () => {
          if (zone.id === 'zone-gym-canteen') elImg.src = 'gym_canteen.jpg';
        };
        elImgBox.classList.remove('hidden');
      } else {
        elImgBox.classList.add('hidden');
        elImg.src = '';
      }
    }

    // 1. Update Inspector Badge & Icon
    if (elIconBadge) {
      elIconBadge.innerHTML = getZoneSvg(zone, 28);
      elIconBadge.style.color = zone.accent || '#f59e0b';
    }
    if (elCode) {
      elCode.textContent = zone.code;
      elCode.style.backgroundColor = zone.accent || '#f59e0b';
    }
    if (elTag) elTag.textContent = zone.tag || zone.category;
    if (elHours) {
      elHours.innerHTML = `
        <svg class="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>${zone.hours || 'Mon - Fri: 8:00 AM - 5:00 PM'}</span>
      `;
    }
    if (elName) elName.textContent = zone.name;
    if (elDesc) elDesc.textContent = zone.desc;

    // 2. Multi-Level Floor Directory
    if (elFloors) {
      elFloors.innerHTML = '';
      const floors = zone.floors && zone.floors.length > 0 
        ? zone.floors 
        : [{ level: "Main Level", desc: zone.desc }];

      floors.forEach((f, idx) => {
        const floorItem = document.createElement('div');
        floorItem.className = 'group p-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 hover:border-amber-400/50 hover:bg-amber-500/5 transition-all shadow-sm';
        floorItem.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-1">
            <span class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500 shadow-sm group-hover:scale-125 transition-transform"></span>
              <span class="font-display tracking-wide">${escapeHtml(f.level)}</span>
            </span>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 dark:bg-white/5 text-amber-800 dark:text-amber-300 border border-amber-500/20 dark:border-white/10 uppercase">FLOOR 0${idx + 1}</span>
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-300/90 font-light leading-relaxed pl-4 border-l-2 border-amber-500/30 group-hover:border-amber-400 transition-colors">${escapeHtml(f.desc)}</p>
        `;
        elFloors.appendChild(floorItem);
      });
    }

    // 3. Highlights & Key Facilities
    if (elHighlights && zone.highlights) {
      elHighlights.innerHTML = zone.highlights
        .map(h => `
          <li class="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <span class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0">✦</span>
            <span class="font-medium">${escapeHtml(h)}</span>
          </li>
        `)
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
        btn.className = 'map-quick-pill-btn shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-white/80 dark:bg-white/5 border border-slate-300/70 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer';
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
      btn.className = 'map-quick-pill-btn shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md bg-white/80 dark:bg-white/5 border border-slate-300/70 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5';
      btn.setAttribute('data-zone-id', zone.id);
      btn.setAttribute('data-category', zone.category);

      btn.innerHTML = `
        <span class="shrink-0 flex items-center justify-center text-amber-500">${getZoneSvg(zone, 12)}</span>
        <span>${escapeHtml(zone.shortName || zone.name)}</span>
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
          btn.className = 'map-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-white/80 dark:bg-white/5 border border-slate-300/80 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer';
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
      if (tabId === 'departments') {
        hideDepartmentDetail();
      }
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

  // Handle URL hash on boot and navigation
  function handleHashRoute() {
    const rawHash = (window.location.hash || '').replace(/^#/, '');
    if (!rawHash) {
      switchTab('overview');
      return;
    }

    if (rawHash.startsWith('departments/')) {
      const slug = rawHash.split('/')[1];
      switchTab('departments');
      if (slug) {
        showDepartmentDetail(slug);
      }
      return;
    }

    if (rawHash === 'departments') {
      switchTab('departments');
      hideDepartmentDetail();
      return;
    }

    if (['overview', 'facilities', 'library', 'news', 'map'].includes(rawHash)) {
      switchTab(rawHash);
      return;
    }

    switchTab('overview');
  }

  handleHashRoute();

  // Handle browser back/forward buttons
  window.addEventListener('hashchange', () => {
    handleHashRoute();
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
}

/**
 * =========================================================================
 * Universal Supabase Global Search System
 * Dynamically queries all 4 tables: departments, facilities, news (sjp_eng_data), staff (department_staff)
 * =========================================================================
 */
let globalSearchTimeout = null;
let currentSearchItems = [];
let selectedSearchIndex = -1;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightElement(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('search-target-highlight');
  setTimeout(() => {
    el.classList.remove('search-target-highlight');
  }, 2500);
}

/**
 * Helper to identify department ID slug ('civil', 'computer', 'electrical', 'mechanical', 'interdisciplinary')
 * Robustly handles raw strings ('computer', 'CO', 'ee', etc.), numbers (2, 3, 4, 5, 6), and department objects
 */
function getDeptSlug(dept) {
  if (!dept) return 'civil';

  // 1. Direct string handling (e.g. 'computer', 'civil', 'CO', 'CE', 'ee', 'me', 'is')
  if (typeof dept === 'string') {
    const s = dept.toLowerCase().trim();
    if (s === 'civil' || s === 'ce' || s.includes('civil')) return 'civil';
    if (s === 'computer' || s === 'co' || s.includes('comp')) return 'computer';
    if (s === 'electrical' || s === 'ee' || s.includes('electr')) return 'electrical';
    if (s === 'mechanical' || s === 'me' || s.includes('mechanic')) return 'mechanical';
    if (s === 'interdisciplinary' || s === 'is' || s.includes('interdisciplin')) return 'interdisciplinary';
    if (s === '2') return 'civil';
    if (s === '3') return 'computer';
    if (s === '4') return 'electrical';
    if (s === '5') return 'mechanical';
    if (s === '6') return 'interdisciplinary';
    return s;
  }

  // 2. Direct number ID handling (e.g. 2, 3, 4, 5, 6)
  if (typeof dept === 'number') {
    if (dept === 2) return 'civil';
    if (dept === 3) return 'computer';
    if (dept === 4) return 'electrical';
    if (dept === 5) return 'mechanical';
    if (dept === 6) return 'interdisciplinary';
  }

  // 3. Object handling (e.g. { id: 'computer', name: 'Computer Engineering', code: 'CO' })
  const idStr = String(dept.id || '').toLowerCase().trim();
  if (idStr === 'civil' || idStr === '2') return 'civil';
  if (idStr === 'computer' || idStr === '3') return 'computer';
  if (idStr === 'electrical' || idStr === '4') return 'electrical';
  if (idStr === 'mechanical' || idStr === '5') return 'mechanical';
  if (idStr === 'interdisciplinary' || idStr === '6') return 'interdisciplinary';

  const combined = ((dept.id || '') + ' ' + (dept.name || dept.title || '') + ' ' + (dept.code || '')).toLowerCase();
  if (combined.includes('civil') || combined.includes('ce')) return 'civil';
  if (combined.includes('computer') || combined.includes('co') || combined.includes('comp')) return 'computer';
  if (combined.includes('electr') || combined.includes('ee')) return 'electrical';
  if (combined.includes('mechanic') || combined.includes('me')) return 'mechanical';
  if (combined.includes('interdisciplin') || combined.includes('is')) return 'interdisciplinary';

  return idStr || 'civil';
}

/**
 * Universal Search across Supabase tables (departments, facilities, news, staff)
 * Dynamically queries all 4 tables from Supabase with debounced input and fallback resilience.
 * @param {string} rawQuery Search term entered by user
 */
export async function universalSearch(rawQuery) {
  const query = (rawQuery || '').trim();
  const desktopDropdown = document.getElementById('global-search-dropdown');
  const mobileDropdown = document.getElementById('mobile-search-dropdown');
  const desktopResults = document.getElementById('global-search-results');
  const mobileResults = document.getElementById('mobile-search-results');
  const metaLabel = document.getElementById('global-search-meta');
  const mobMetaLabel = document.getElementById('mobile-search-meta');

  if (query.length < 2) {
    if (desktopDropdown) desktopDropdown.classList.add('hidden');
    if (mobileDropdown) mobileDropdown.classList.add('hidden');
    if (desktopResults) desktopResults.innerHTML = '';
    if (mobileResults) mobileResults.innerHTML = '';
    currentSearchItems = [];
    selectedSearchIndex = -1;
    return;
  }

  // Open dropdowns and show loading indicator
  const loadingHtml = `
    <div class="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
      <div class="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">Searching faculty portal records...</p>
      <p class="text-[11px] text-slate-500 dark:text-slate-400">Searching departments, facilities, news, staff, and library catalogue</p>
    </div>
  `;

  if (desktopDropdown) desktopDropdown.classList.remove('hidden');
  if (mobileDropdown) mobileDropdown.classList.remove('hidden');
  if (desktopResults) desktopResults.innerHTML = loadingHtml;
  if (mobileResults) mobileResults.innerHTML = loadingHtml;

  const searchingMsg = `Searching for "${query}"...`;
  if (metaLabel) metaLabel.textContent = searchingMsg;
  if (mobMetaLabel) mobMetaLabel.textContent = searchingMsg;

  const safeTerm = query.replace(/[%_*]/g, '');

  try {
    // 1. Query departments table
    const deptsPromise = supabase
      ? supabase.from('departments').select('*').or(`name.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%,detailed_content.ilike.%${safeTerm}%`).limit(6)
      : Promise.resolve({ data: [] });

    // 2. Query facilities table
    const facsPromise = supabase
      ? supabase.from('facilities').select('*').or(`title.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%,detailed_content.ilike.%${safeTerm}%`).limit(6)
      : Promise.resolve({ data: [] });

    // 3. Query news table (try 'news', fallback to 'sjp_eng_data')
    const newsPromise = (async () => {
      if (!supabase) return { data: [] };
      try {
        const res = await supabase.from('news').select('*').or(`title.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%`).limit(8);
        if (!res.error && res.data && res.data.length > 0) return res;
      } catch (e) {}
      return supabase.from('sjp_eng_data').select('*').or(`title.ilike.%${safeTerm}%,description.ilike.%${safeTerm}%`).limit(8);
    })();

    // 4. Query staff table (try 'staff', fallback to 'department_staff')
    const staffPromise = (async () => {
      if (!supabase) return { data: [] };
      try {
        const res = await supabase.from('staff').select('*').or(`name.ilike.%${safeTerm}%,designation.ilike.%${safeTerm}%,staff_type.ilike.%${safeTerm}%`).limit(8);
        if (!res.error && res.data && res.data.length > 0) return res;
      } catch (e) {}
      return supabase.from('department_staff').select('*').or(`name.ilike.%${safeTerm}%,designation.ilike.%${safeTerm}%,staff_type.ilike.%${safeTerm}%`).limit(8);
    })();

    // 5. Query library_books table
    const booksPromise = (async () => {
      if (!supabase) return { data: [] };
      try {
        const res = await supabase.from('library_books').select('*').or(`title.ilike.%${safeTerm}%,author.ilike.%${safeTerm}%,category.ilike.%${safeTerm}%`).limit(6);
        if (!res.error && res.data) return res;
      } catch (e) {}
      return { data: [] };
    })();

    const [deptRes, facRes, newsRes, staffRes, bookRes] = await Promise.allSettled([
      deptsPromise,
      facsPromise,
      newsPromise,
      staffPromise,
      booksPromise
    ]);

    let depts = (deptRes.status === 'fulfilled' && deptRes.value?.data) ? deptRes.value.data : [];
    let facilities = (facRes.status === 'fulfilled' && facRes.value?.data) ? facRes.value.data : [];
    let news = (newsRes.status === 'fulfilled' && newsRes.value?.data) ? newsRes.value.data : [];
    let staff = (staffRes.status === 'fulfilled' && staffRes.value?.data) ? staffRes.value.data : [];
    let books = (bookRes.status === 'fulfilled' && bookRes.value?.data) ? bookRes.value.data : [];

    // Local supplements & fallbacks from FOE_DATA and state
    const qLower = query.toLowerCase();
    if (depts.length === 0 && FOE_DATA.departments) {
      depts = FOE_DATA.departments.filter(d => 
        d.name.toLowerCase().includes(qLower) || 
        (d.tagline && d.tagline.toLowerCase().includes(qLower)) || 
        (d.overview && d.overview.toLowerCase().includes(qLower)) ||
        (d.code && d.code.toLowerCase().includes(qLower))
      );
    }
    if (facilities.length === 0 && FOE_DATA.facilities) {
      facilities = FOE_DATA.facilities.filter(f => 
        f.title.toLowerCase().includes(qLower) || 
        (f.shortDesc && f.shortDesc.toLowerCase().includes(qLower)) || 
        (f.fullDesc && f.fullDesc.toLowerCase().includes(qLower)) ||
        (f.dept && f.dept.toLowerCase().includes(qLower))
      );
    }
    if (news.length === 0 && state.items.length > 0) {
      news = state.items.filter(n => 
        n.title.toLowerCase().includes(qLower) || 
        (n.description && n.description.toLowerCase().includes(qLower))
      );
    }
    if (books.length === 0) {
      const allBooks = (state.libraryBooks && state.libraryBooks.length > 0) ? state.libraryBooks : (FOE_DATA.library_books || []);
      books = allBooks.filter(b => 
        (b.title || '').toLowerCase().includes(qLower) ||
        (b.author || '').toLowerCase().includes(qLower) ||
        (b.category || '').toLowerCase().includes(qLower)
      ).slice(0, 6);
    }
    if (staff.length === 0) {
      // Local staff fallback for dean and leadership
      const fallbackStaff = [
        {
          name: FOE_DATA.faculty.dean.name,
          designation: FOE_DATA.faculty.dean.title,
          staff_type: 'Dean & Academic Head',
          image_url: FOE_DATA.faculty.dean.image
        },
        {
          name: 'Prof. Chaminda Gallage',
          designation: 'Senior Professor & Head, Department of Civil Engineering',
          staff_type: 'Academic',
          image_url: null
        },
        {
          name: 'Dr. Uditha Ratnayake',
          designation: 'Head, Department of Mechanical Engineering',
          staff_type: 'Academic',
          image_url: null
        },
        {
          name: 'Dr. Chamitha de Alwis',
          designation: 'Senior Lecturer, Department of Electrical & Electronic Engineering',
          staff_type: 'Academic',
          image_url: null
        }
      ];
      staff = fallbackStaff.filter(s =>
        s.name.toLowerCase().includes(qLower) ||
        s.designation.toLowerCase().includes(qLower)
      );
    }

    renderSearchResults(query, { depts, facilities, news, staff, books });

  } catch (err) {
    console.error('Universal search error:', err);
    const qLower = query.toLowerCase();
    const depts = (FOE_DATA.departments || []).filter(d => d.name.toLowerCase().includes(qLower) || d.overview.toLowerCase().includes(qLower));
    const facilities = (FOE_DATA.facilities || []).filter(f => f.title.toLowerCase().includes(qLower) || f.shortDesc.toLowerCase().includes(qLower));
    const news = (state.items || []).filter(n => n.title.toLowerCase().includes(qLower) || n.description.toLowerCase().includes(qLower));
    const books = (state.libraryBooks || FOE_DATA.library_books || []).filter(b => (b.title || '').toLowerCase().includes(qLower) || (b.author || '').toLowerCase().includes(qLower));
    renderSearchResults(query, { depts, facilities, news, staff: [], books });
  }
}

/**
 * Render Categorized Results in Dropdown with Highlighting and Direct Navigation
 */
function renderSearchResults(query, { depts, facilities, news, staff, books = [] }) {
  const desktopResults = document.getElementById('global-search-results');
  const mobileResults = document.getElementById('mobile-search-results');
  const metaLabel = document.getElementById('global-search-meta');
  const mobMetaLabel = document.getElementById('mobile-search-meta');

  const totalResults = depts.length + facilities.length + news.length + staff.length + books.length;
  currentSearchItems = [];
  selectedSearchIndex = -1;

  const countText = `${totalResults} result${totalResults === 1 ? '' : 's'} across 5 tables`;
  if (metaLabel) metaLabel.textContent = countText;
  if (mobMetaLabel) mobMetaLabel.textContent = countText;

  if (totalResults === 0) {
    const emptyHtml = `
      <div class="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
        <div class="text-3xl">🔍</div>
        <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">No matching records found</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400">Searched departments, facilities, library catalogue, news, and staff for "${escapeHtml(query)}"</p>
      </div>
    `;
    if (desktopResults) desktopResults.innerHTML = emptyHtml;
    if (mobileResults) mobileResults.innerHTML = emptyHtml;
    return;
  }

  const highlightMatch = (text) => {
    if (!text) return '';
    try {
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return escapeHtml(text).replace(regex, '<span class="search-match-text">$1</span>');
    } catch {
      return escapeHtml(text);
    }
  };

  let html = '';

  // 1. Departments Section
  if (depts.length > 0) {
    html += `
      <div>
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center justify-between">
          <span>🏛️ Departments (${depts.length})</span>
          <span class="text-slate-400 font-normal">Section & Popup</span>
        </div>
        <div class="space-y-1 mt-1">
    `;
    depts.forEach(dept => {
      const itemIndex = currentSearchItems.length;
      const slug = getDeptSlug(dept);
      currentSearchItems.push({
        type: 'department',
        id: slug,
        title: dept.name,
        raw: dept
      });
      html += `
        <div 
          class="global-search-item flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-amber-500/10 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-amber-400/30 group"
          data-index="${itemIndex}"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0" data-action="navigate">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-300 dark:border-white/15 shadow-sm">
              <img src="${dept.image_url || dept.image || 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'}" alt="${dept.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${highlightMatch(dept.name)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">DEPT</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${highlightMatch(dept.description || dept.tagline || dept.overview)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button class="search-popup-btn text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer" data-index="${itemIndex}" title="Open detailed popup">
              Popup ↗
            </button>
            <button class="search-nav-btn text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-all cursor-pointer" data-index="${itemIndex}" title="Navigate to section">
              Section →
            </button>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  // 2. Facilities Section
  if (facilities.length > 0) {
    html += `
      <div class="pt-2 border-t border-slate-200/60 dark:border-white/10">
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center justify-between">
          <span>🔬 Facilities & Labs (${facilities.length})</span>
          <span class="text-slate-400 font-normal">Section & Popup</span>
        </div>
        <div class="space-y-1 mt-1">
    `;
    facilities.forEach(fac => {
      const itemIndex = currentSearchItems.length;
      const facId = fac.id || (typeof fac.title === 'string' ? 'fac-' + fac.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'fac-item');
      currentSearchItems.push({
        type: 'facility',
        id: facId,
        title: fac.title,
        raw: fac
      });
      html += `
        <div 
          class="global-search-item flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-sky-500/10 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-sky-400/30 group"
          data-index="${itemIndex}"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0" data-action="navigate">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-300 dark:border-white/15 shadow-sm">
              <img src="${resolveFacilityImageUrl(fac.image_url || fac.image, fac.title)}" alt="${fac.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${highlightMatch(fac.title)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-sky-500/20 text-sky-700 dark:text-sky-300">FACILITY</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${highlightMatch(fac.description || fac.shortDesc)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button class="search-popup-btn text-[10px] font-bold px-2 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-800 dark:text-sky-300 border border-sky-500/30 transition-all cursor-pointer" data-index="${itemIndex}" title="Open detailed popup">
              Popup ↗
            </button>
            <button class="search-nav-btn text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-all cursor-pointer" data-index="${itemIndex}" title="Navigate to section">
              Section →
            </button>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  // 3. News & Announcements Section
  if (news.length > 0) {
    html += `
      <div class="pt-2 border-t border-slate-200/60 dark:border-white/10">
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center justify-between">
          <span>📢 News & Notices (${news.length})</span>
          <span class="text-slate-400 font-normal">Open Details Popup</span>
        </div>
        <div class="space-y-1 mt-1">
    `;
    news.forEach(item => {
      const itemIndex = currentSearchItems.length;
      currentSearchItems.push({
        type: 'news',
        id: item.id || item.link,
        title: item.title,
        raw: item
      });
      const norm = normalizeItem(item);
      html += `
        <div 
          class="global-search-item flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-rose-500/10 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-rose-400/30 group"
          data-index="${itemIndex}"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0" data-action="navigate">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-300 dark:border-white/15 shadow-sm">
              <img src="${norm.image_url || 'https://eng.sjp.ac.lk/wp-content/uploads/2025/08/Web-Notice.jpg'}" alt="${norm.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${highlightMatch(norm.title)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 uppercase">${norm.category}</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${highlightMatch(norm.description)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button class="search-popup-btn text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-800 dark:text-rose-300 border border-rose-500/30 transition-all cursor-pointer" data-index="${itemIndex}" title="Open detailed notice popup">
              Notice ↗
            </button>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  // 4. Staff Section
  if (staff.length > 0) {
    html += `
      <div class="pt-2 border-t border-slate-200/60 dark:border-white/10">
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center justify-between">
          <span>👨‍🏫 Staff & Faculty Leadership (${staff.length})</span>
          <span class="text-slate-400 font-normal">View Profile Popup</span>
        </div>
        <div class="space-y-1 mt-1">
    `;
    staff.forEach(person => {
      const itemIndex = currentSearchItems.length;
      currentSearchItems.push({
        type: 'staff',
        id: person.id || person.name,
        title: person.name,
        raw: person
      });
      const hasStaffPhoto = isValidProfilePhoto(person.image_url);
      html += `
        <div 
          class="global-search-item flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-purple-500/10 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-purple-400/30 group"
          data-index="${itemIndex}"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0" data-action="navigate">
            <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-amber-500/40 shadow-sm flex items-center justify-center relative">
              ${hasStaffPhoto ? `
                <img src="${person.image_url}" alt="${escapeHtml(person.name)}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');">
                <div class="hidden w-full h-full flex items-center justify-center text-purple-700 dark:text-purple-300 bg-purple-500/15">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                  </svg>
                </div>
              ` : `
                <div class="w-full h-full flex items-center justify-center text-purple-700 dark:text-purple-300 bg-purple-500/15">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                  </svg>
                </div>
              `}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${highlightMatch(person.name)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300">${person.staff_type || 'Faculty'}</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${highlightMatch(person.designation)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button class="search-popup-btn text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 text-purple-800 dark:text-purple-300 border border-purple-500/30 transition-all cursor-pointer" data-index="${itemIndex}" title="View staff member popup">
              Profile ↗
            </button>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  // 5. Library Books Section
  if (books && books.length > 0) {
    html += `
      <div class="pt-2 border-t border-slate-200/60 dark:border-white/10">
        <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center justify-between">
          <span>📚 Library Books (${books.length})</span>
          <span class="text-slate-400 font-normal">Section & Details</span>
        </div>
        <div class="space-y-1 mt-1">
    `;
    books.forEach(b => {
      const itemIndex = currentSearchItems.length;
      currentSearchItems.push({
        type: 'book',
        id: b.id,
        title: b.title,
        raw: b
      });
      const cover = b.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';
      const isAvail = (b.availability_status || '').toLowerCase() === 'available';
      html += `
        <div 
          class="global-search-item flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-amber-500/10 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-amber-400/30 group"
          data-index="${itemIndex}"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0" data-action="navigate">
            <div class="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-300 dark:border-white/15 shadow-sm">
              <img src="${cover}" alt="${escapeHtml(b.title)}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${highlightMatch(b.title)}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${isAvail ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'}">
                  ${escapeHtml(b.availability_status || 'BOOK')}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">✍️ ${highlightMatch(b.author || 'Author')} • ${escapeHtml(b.category || 'Engineering')}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button class="search-popup-btn text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer" data-index="${itemIndex}" title="View book details popup">
              Details ↗
            </button>
            <button class="search-nav-btn text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300/80 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-all cursor-pointer" data-index="${itemIndex}" title="Go to library section">
              Library →
            </button>
          </div>
        </div>
      `;
    });
    html += `</div></div>`;
  }

  // Populate desktop results
  if (desktopResults) {
    desktopResults.innerHTML = html;
    attachResultListeners(desktopResults);
  }

  // Populate mobile results
  if (mobileResults) {
    mobileResults.innerHTML = html;
    attachResultListeners(mobileResults);
  }
}

/**
 * Attach Event Listeners to Search Result Items
 */
function attachResultListeners(container) {
  if (!container) return;

  // Clicking the item container
  container.querySelectorAll('.global-search-item').forEach(el => {
    el.addEventListener('click', (e) => {
      // If user clicked the specific popup button, honor popup directly
      if (e.target.closest('.search-popup-btn')) {
        const idx = parseInt(e.target.closest('.search-popup-btn').getAttribute('data-index'), 10);
        selectSearchResult(idx, true);
        return;
      }
      // If user clicked the specific section button, honor section navigation
      if (e.target.closest('.search-nav-btn')) {
        const idx = parseInt(e.target.closest('.search-nav-btn').getAttribute('data-index'), 10);
        selectSearchResult(idx, false);
        return;
      }
      // General click on item row
      const idx = parseInt(el.getAttribute('data-index'), 10);
      selectSearchResult(idx, false);
    });
  });
}

/**
 * Handle Result Selection & Direct Navigation to Section or Detailed Popup
 * @param {number} index Index of selected item in currentSearchItems
 * @param {boolean} preferPopup If true, directly triggers detailed popup dialog
 */
function selectSearchResult(index, preferPopup = false) {
  if (index < 0 || index >= currentSearchItems.length) return;
  const item = currentSearchItems[index];

  // Close search dropdowns
  const desktopDropdown = document.getElementById('global-search-dropdown');
  const mobileDropdown = document.getElementById('mobile-search-dropdown');
  if (desktopDropdown) desktopDropdown.classList.add('hidden');
  if (mobileDropdown) mobileDropdown.classList.add('hidden');

  // Reset search inputs
  const input = document.getElementById('global-search-input');
  const mobInput = document.getElementById('mobile-search-input');
  if (input) input.value = '';
  if (mobInput) mobInput.value = '';
  const clearBtn = document.getElementById('global-search-clear');
  const mobClearBtn = document.getElementById('mobile-search-clear');
  if (clearBtn) clearBtn.classList.add('hidden');
  if (mobClearBtn) mobClearBtn.classList.add('hidden');

  if (item.type === 'department') {
    if (preferPopup) {
      openDeptModal(item.raw || item);
    } else {
      switchTab('departments');
      const slug = getDeptSlug(item.raw || item);
      showDepartmentDetail(slug);
    }
  } else if (item.type === 'facility') {
    if (preferPopup) {
      openFacilityModal(item.raw || item);
    } else {
      switchTab('facilities');
      renderFacilities('all');
      setTimeout(() => {
        let card = document.getElementById(`facility-card-${item.id}`);
        if (!card) {
          document.querySelectorAll('#facilities-grid article').forEach(c => {
            if (c.textContent.toLowerCase().includes(item.title.toLowerCase())) {
              card = c;
            }
          });
        }
        if (card) highlightElement(card);
      }, 250);
    }
  } else if (item.type === 'news') {
    switchTab('news');
    const norm = normalizeItem(item.raw || item);
    openModal(norm);
    setTimeout(() => {
      let card = document.getElementById(`announcement-card-${norm.id}`);
      if (card) highlightElement(card);
    }, 250);
  } else if (item.type === 'staff') {
    openStaffModal(item.raw || item);
  } else if (item.type === 'book') {
    if (preferPopup) {
      openBookDetailModal(item.raw || item);
    } else {
      switchTab('library');
      openBookDetailModal(item.raw || item);
      setTimeout(() => {
        const card = document.getElementById(`library-book-card-${item.id}`);
        if (card) highlightElement(card);
      }, 250);
    }
  }
}

/**
 * Department Details Popup Modal
 */
export function openDeptModal(dept) {
  const modal = document.getElementById('dept-modal');
  if (!modal) return;

  const codeEl = document.getElementById('dept-modal-code');
  const degreeEl = document.getElementById('dept-modal-degree');
  const imgEl = document.getElementById('dept-modal-img');
  const nameEl = document.getElementById('dept-modal-name');
  const taglineEl = document.getElementById('dept-modal-tagline');
  const overviewEl = document.getElementById('dept-modal-overview');
  const labsList = document.getElementById('dept-modal-labs');
  const linkEl = document.getElementById('dept-modal-link');
  const jumpBtn = document.getElementById('dept-modal-jump-btn');

  const slug = getDeptSlug(dept);
  const foeDept = (FOE_DATA.departments || []).find(d => getDeptSlug(d) === slug) || {};

  if (codeEl) codeEl.textContent = dept.code || foeDept.code || 'ENG';
  if (degreeEl) degreeEl.textContent = foeDept.degree || 'B.Sc. Eng (Hons) • IESL Accredited';
  if (imgEl) {
    imgEl.src = dept.image_url || dept.image || foeDept.image || 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg';
    imgEl.onerror = () => { imgEl.src = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; };
  }
  if (nameEl) nameEl.textContent = dept.name ? (dept.name.startsWith('Department of') ? dept.name : `Department of ${dept.name}`) : 'Department of Engineering';
  if (taglineEl) taglineEl.textContent = dept.description || foeDept.tagline || 'Excellence in Engineering Education';
  if (overviewEl) overviewEl.textContent = dept.detailed_content || foeDept.overview || dept.description || '';

  if (labsList) {
    const labs = foeDept.keyLabs || [
      'Advanced Computing & High-Performance Cluster',
      'Undergraduate Engineering Development Labs',
      'Applied Research & Specialized Bay'
    ];
    labsList.innerHTML = labs.map(lab => `
      <li class="flex items-center gap-2">
        <span class="text-amber-500 font-bold">⚡</span>
        <span>${escapeHtml(lab)}</span>
      </li>
    `).join('');
  }

  if (linkEl) {
    linkEl.href = dept.page_link || `https://eng.sjp.ac.lk/${slug}-engineering/`;
  }

  if (jumpBtn) {
    jumpBtn.onclick = () => {
      closeDeptModal();
      switchTab('departments');
      showDepartmentDetail(slug);
    };
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeDeptModal() {
  const modal = document.getElementById('dept-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Facility Details Popup Modal
 */
export function openFacilityModal(fac) {
  const modal = document.getElementById('facility-modal');
  if (!modal) return;

  const facId = fac.id;
  const foeFac = (state.facilities || FOE_DATA.facilities || []).find(f => 
    f.id === facId || 
    f.id === `fac-${facId}` ||
    (fac.id && f.id && String(f.id).endsWith(String(fac.id))) ||
    (f.title && fac.title && f.title.toLowerCase().trim() === fac.title.toLowerCase().trim()) ||
    (f.title && fac.title && f.title.toLowerCase().includes(fac.title.toLowerCase())) ||
    (fac.title && f.title && fac.title.toLowerCase().includes(f.title.toLowerCase()))
  ) || fac;

  const isFireSafety = foeFac.id === 'fac-cfse' || (foeFac.title && foeFac.title.toLowerCase().includes('fire safety'));
  const isAuditorium = foeFac.id === 'fac-auditorium' || (foeFac.title && foeFac.title.toLowerCase().includes('auditorium'));

  const badgeEl = document.getElementById('facility-modal-badge');
  const deptEl = document.getElementById('facility-modal-dept');
  const imgEl = document.getElementById('facility-modal-img');
  const bannerTag = document.getElementById('facility-modal-banner-tag');
  const bannerSub = document.getElementById('facility-modal-banner-sub');
  const titleEl = document.getElementById('facility-modal-title');
  const locEl = document.getElementById('facility-modal-location');
  const hoursEl = document.getElementById('facility-modal-hours');
  const descEl = document.getElementById('facility-modal-desc');
  const specsEl = document.getElementById('facility-modal-specs');
  const featuresList = document.getElementById('facility-modal-features');
  const inchargeEl = document.getElementById('facility-modal-incharge');
  const emailEl = document.getElementById('facility-modal-email');
  const mapBtn = document.getElementById('facility-modal-map-btn');
  const jumpBtn = document.getElementById('facility-modal-jump-btn');
  const actionCloseBtn = document.getElementById('facility-modal-action-close');
  const galleryEl = document.getElementById('facility-modal-gallery');
  const galleryCountEl = document.getElementById('facility-modal-gallery-count');

  if (badgeEl) {
    if (isFireSafety) {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white featured-fire-badge shadow-md';
      badgeEl.textContent = '🔥 FEATURED • PREMIER TESTING CENTER';
    } else if (isAuditorium) {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-slate-950 featured-shimmer-badge shadow-md';
      badgeEl.textContent = '⭐ FEATURED • 650-SEAT AUDITORIUM';
    } else {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-800 dark:text-sky-300 border border-sky-500/30 dark:border-sky-400/40';
      badgeEl.textContent = foeFac.badge || foeFac.categoryName || 'SPECIALIZED FACILITY';
    }
  }

  if (deptEl) deptEl.textContent = foeFac.dept || 'Faculty of Engineering';

  const defaultHeroUrl = resolveFacilityImageUrl(fac.image_url || fac.image || foeFac.image || foeFac.image_url, fac.title || foeFac.title);
  if (imgEl) {
    imgEl.src = defaultHeroUrl;
    imgEl.alt = foeFac.title || 'Facility Hero';
    imgEl.onerror = () => { imgEl.src = 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'; };
  }

  if (bannerTag) {
    bannerTag.textContent = foeFac.featuredTag || foeFac.badge || foeFac.categoryName || 'Specialized Campus Bay';
  }
  if (bannerSub) {
    bannerSub.textContent = foeFac.location || 'Mattegoda Permanent Engineering Complex';
  }

  // Multi-Photo Gallery Showcase
  const galleryItems = (foeFac.gallery && foeFac.gallery.length > 0)
    ? foeFac.gallery.map(item => ({
        url: resolveFacilityImageUrl(item.url, item.title || foeFac.title),
        title: item.title || foeFac.title,
        desc: item.desc || 'High-resolution photo perspective'
      }))
    : [
        { url: defaultHeroUrl, title: foeFac.title || 'Main Perspective', desc: 'Primary view of the facility' },
        { url: 'https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg', title: 'Mattegoda Complex View', desc: 'Exterior and architectural perspective' },
        { url: 'https://eng.sjp.ac.lk/wp-content/uploads/2025/12/Civil-Engineering-Building.jpg', title: 'Campus Facility Bay', desc: 'Specialized departmental complex' }
      ];

  if (galleryCountEl) {
    galleryCountEl.textContent = `${galleryItems.length} High-Res Photos`;
  }

  if (galleryEl) {
    galleryEl.innerHTML = galleryItems.map((item, idx) => `
      <div class="facility-thumb-card group/thumb relative rounded-xl overflow-hidden border ${idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md' : 'border-slate-200 dark:border-white/10'} hover:border-amber-400 bg-slate-900/60 cursor-pointer transition-all duration-200" data-index="${idx}">
        <div class="aspect-video w-full overflow-hidden bg-slate-950">
          <img src="${item.url}" alt="${escapeHtml(item.title || 'Photo')}" class="w-full h-full object-cover group-hover/thumb:scale-108 transition-transform duration-300" loading="lazy" onerror="this.src='https://eng.sjp.ac.lk/wp-content/uploads/2026/08/B1_New.jpg'">
        </div>
        <div class="p-2 bg-slate-900/90 backdrop-blur-md">
          <p class="text-[11px] font-bold text-white truncate">${escapeHtml(item.title || `Photo ${idx + 1}`)}</p>
          <p class="text-[10px] text-slate-300 truncate">${escapeHtml(item.desc || 'Click to enlarge')}</p>
        </div>
      </div>
    `).join('');

    galleryEl.querySelectorAll('.facility-thumb-card').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.getAttribute('data-index'), 10);
        const selected = galleryItems[idx];
        if (selected && imgEl) {
          imgEl.style.opacity = '0.35';
          setTimeout(() => {
            imgEl.src = selected.url;
            imgEl.style.opacity = '1';
          }, 120);
          if (bannerSub) bannerSub.textContent = selected.title || foeFac.title;
          
          galleryEl.querySelectorAll('.facility-thumb-card').forEach(t => {
            t.classList.remove('border-amber-500', 'ring-2', 'ring-amber-500/50', 'shadow-md');
            t.classList.add('border-slate-200', 'dark:border-white/10');
          });
          thumb.classList.add('border-amber-500', 'ring-2', 'ring-amber-500/50', 'shadow-md');
          thumb.classList.remove('border-slate-200', 'dark:border-white/10');
        }
      });
    });
  }

  if (titleEl) titleEl.textContent = fac.title || foeFac.title || 'Faculty Facility';
  if (locEl) locEl.innerHTML = `<span>📍</span> <span>${escapeHtml(foeFac.location || 'Mattegoda Complex')}</span>`;
  if (hoursEl) hoursEl.innerHTML = `<span>🕒</span> <span>${escapeHtml(foeFac.hours ? foeFac.hours.split('|')[0] : 'Open weekdays & term hours')}</span>`;
  if (descEl) descEl.textContent = fac.detailed_content || foeFac.fullDesc || fac.description || foeFac.shortDesc || '';

  // Technical Specifications Grid
  const specs = foeFac.specs || [
    { label: "Campus Location", value: foeFac.location || "Mattegoda Engineering Complex" },
    { label: "Operating Department", value: foeFac.dept || "Faculty of Engineering" },
    { label: "Facility Category", value: foeFac.categoryName || "Specialized Bay" },
    { label: "Access Level", value: "Students, Academic Researchers & Industry Partners" }
  ];
  if (specsEl) {
    specsEl.innerHTML = specs.map(s => `
      <div class="p-3 rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-start gap-2.5">
        <span class="text-amber-500 font-bold text-sm">⚡</span>
        <div>
          <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">${escapeHtml(s.label)}</span>
          <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(s.value)}</span>
        </div>
      </div>
    `).join('');
  }

  // Key Highlights Checklist
  if (featuresList) {
    const feats = (foeFac.features && foeFac.features.length > 0)
      ? foeFac.features
      : [
          'High-speed digital workstation clusters & university intranet access',
          'Modern experimental benches and safety compliant workspaces',
          'Supervised by specialized technical officers and academic staff',
          'Integrated with undergraduate laboratory curricula and postgraduate research'
        ];
    featuresList.innerHTML = feats.map(f => `
      <li class="flex items-start gap-2">
        <span class="text-emerald-500 font-bold mt-0.5">✓</span>
        <span>${escapeHtml(f)}</span>
      </li>
    `).join('');
  }

  // Leadership & Inquiry Contact
  if (inchargeEl) inchargeEl.textContent = foeFac.inCharge || 'Faculty Facilities Coordinator';
  if (emailEl) {
    const email = foeFac.contactEmail || 'foe@sjp.ac.lk';
    emailEl.textContent = email;
    emailEl.href = `mailto:${email}`;
  }

  if (mapBtn) {
    mapBtn.onclick = () => {
      closeFacilityModal();
      switchTab('map');
    };
  }

  if (jumpBtn) {
    jumpBtn.onclick = () => {
      closeFacilityModal();
      switchTab('facilities');
      renderFacilities('all');
      setTimeout(() => {
        let card = document.getElementById(`facility-card-${facId}`);
        if (!card) {
          document.querySelectorAll('#facilities-grid article').forEach(c => {
            if (c.textContent.toLowerCase().includes((fac.title || '').toLowerCase())) {
              card = c;
            }
          });
        }
        if (card) highlightElement(card);
      }, 250);
    };
  }

  if (actionCloseBtn) {
    actionCloseBtn.onclick = () => closeFacilityModal();
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeFacilityModal() {
  const modal = document.getElementById('facility-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Staff Details Popup Modal
 */
export function openStaffModal(person) {
  const staffModal = document.getElementById('staff-modal');
  if (!staffModal) return;

  const img = document.getElementById('staff-modal-img');
  const fallback = document.getElementById('staff-modal-avatar-fallback');
  const initialsEl = document.getElementById('staff-modal-initials');
  const name = document.getElementById('staff-modal-name');
  const desig = document.getElementById('staff-modal-designation');
  const typeBadge = document.getElementById('staff-modal-type');
  const actionBtn = document.getElementById('staff-modal-action-btn');

  const hasPhoto = isValidProfilePhoto(person.image_url);
  const initials = getPersonInitials(person.name);

  if (initialsEl) initialsEl.textContent = initials;

  if (hasPhoto && img) {
    img.src = person.image_url;
    img.classList.remove('hidden');
    if (fallback) fallback.classList.add('hidden');
    img.onerror = () => {
      img.classList.add('hidden');
      if (fallback) fallback.classList.remove('hidden');
    };
  } else {
    if (img) img.classList.add('hidden');
    if (fallback) fallback.classList.remove('hidden');
  }

  if (name) name.textContent = person.name || 'Faculty Member';
  if (desig) desig.textContent = person.designation || 'Faculty of Engineering';
  if (typeBadge) typeBadge.textContent = person.staff_type || 'Academic Staff';

  if (actionBtn) {
    actionBtn.onclick = () => {
      closeStaffModal();
      const des = ((person.designation || '') + ' ' + (person.name || '')).toLowerCase();
      if (des.includes('civil')) {
        switchTab('departments');
        setTimeout(() => highlightElement(document.getElementById('dept-card-civil')), 250);
      } else if (des.includes('computer')) {
        switchTab('departments');
        setTimeout(() => highlightElement(document.getElementById('dept-card-computer')), 250);
      } else if (des.includes('electrical')) {
        switchTab('departments');
        setTimeout(() => highlightElement(document.getElementById('dept-card-electrical')), 250);
      } else if (des.includes('mechanical')) {
        switchTab('departments');
        setTimeout(() => highlightElement(document.getElementById('dept-card-mechanical')), 250);
      } else if (des.includes('dean')) {
        switchTab('overview');
        setTimeout(() => {
          const deanCard = document.querySelector('#tab-overview .ios27-glass-maroon');
          if (deanCard) highlightElement(deanCard);
        }, 250);
      } else {
        switchTab('departments');
      }
    };
  }

  staffModal.classList.remove('hidden');
  staffModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeStaffModal() {
  const staffModal = document.getElementById('staff-modal');
  if (!staffModal) return;
  staffModal.classList.add('hidden');
  staffModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * ============================================================================
 * Faculty Library - Supabase Integration & In-Page Modal
 * ============================================================================
 */

export async function fetchLibraryBooks() {
  try {
    if (!supabase) {
      state.libraryBooks = FOE_DATA.library_books || [];
      renderLibraryBooks();
      return state.libraryBooks;
    }
    const { data, error } = await supabase
      .from('library_books')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      state.libraryBooks = FOE_DATA.library_books || [];
    } else {
      state.libraryBooks = data;
    }
    renderLibraryBooks();
    return state.libraryBooks;
  } catch (err) {
    console.warn('Error fetching library books from Supabase:', err);
    state.libraryBooks = FOE_DATA.library_books || [];
    renderLibraryBooks();
    return state.libraryBooks;
  }
}

// Helper function to highlight matching search query in book title or author
function highlightLibrarySearchMatch(text, query) {
  if (!text) return '';
  const escaped = escapeHtml(text);
  if (!query || !query.trim()) return escaped;

  const rawTerms = query.trim().split(/\s+/).filter(Boolean);
  if (rawTerms.length === 0) return escaped;

  const pattern = rawTerms.map(t => escapeRegExp(escapeHtml(t))).join('|');
  try {
    const regex = new RegExp(`(${pattern})`, 'gi');
    return escaped.replace(regex, '<mark class="bg-amber-400/35 text-amber-950 dark:text-amber-200 font-extrabold rounded px-0.5">$1</mark>');
  } catch (e) {
    return escaped;
  }
}

// Koha OPAC Index Mappings & Metadata
export const OPAC_INDEX_NAMES = {
  catalog: 'Library catalog',
  title: 'Title',
  author: 'Author',
  subject: 'Subject',
  isbn: 'ISBN',
  issn: 'ISSN',
  series: 'Series',
  callnumber: 'Call number'
};

export const OPAC_PLACEHOLDERS = {
  catalog: 'Search faculty library catalogue (title, author, subject)...',
  title: 'Search by book title (e.g. Thermodynamics, Concrete Structures)...',
  author: 'Search by author name (e.g. Budhu, Hibbeler, Boylestad, Kreyszig)...',
  subject: 'Search by subject or discipline (e.g. Civil, Mechanical, Algorithms)...',
  isbn: 'Search by ISBN number (e.g. 978-0470556849)...',
  issn: 'Search by journal or serial ISSN number...',
  series: 'Search by academic monograph or curriculum series...',
  callnumber: 'Search by library call number or shelf mark...'
};

export const KOHA_OPAC_IDX_MAP = {
  catalog: 'kw',
  title: 'ti',
  author: 'au',
  subject: 'su',
  isbn: 'nb',
  issn: 'ns',
  series: 'se',
  callnumber: 'callnum'
};

let activeOpacAbortController = null;
let opacSearchDebounceTimer = null;
export const liveOpacBooksCache = new Map();

/**
 * Sends invisible backend proxy request to scrape library search results
 * @param {string} query Search keyword
 * @param {string} index Search field index (catalog, title, author, etc.)
 */
export async function fetchLiveOpacBooks(query, index = 'catalog') {
  const cleanQuery = (query || '').trim();
  const loadingState = document.getElementById('library-loading-state');
  const booksGrid = document.getElementById('library-books-grid');
  const emptyState = document.getElementById('library-empty-state');
  const loadingText = document.getElementById('library-loading-query-text');
  const submitBtn = document.getElementById('library-search-submit-btn');
  const btnIcon = document.getElementById('library-search-btn-icon');
  const btnText = document.getElementById('library-search-btn-text');
  const countEl = document.getElementById('library-books-count');

  if (!cleanQuery) {
    state.liveOpacResults = null;
    state.isLiveOpacSearching = false;
    if (loadingState) loadingState.classList.add('hidden');
    if (booksGrid) booksGrid.classList.remove('hidden');
    if (submitBtn) {
      submitBtn.disabled = false;
      if (btnIcon) btnIcon.textContent = '🔍';
      if (btnText) btnText.textContent = 'Search';
    }
    renderLibraryBooks();
    return;
  }

  // Cancel prior in-flight request if user is typing fast
  if (activeOpacAbortController) {
    activeOpacAbortController.abort();
    activeOpacAbortController = null;
  }

  activeOpacAbortController = new AbortController();
  const signal = activeOpacAbortController.signal;

  state.isLiveOpacSearching = true;

  // Show smooth iOS 27 glassmorphism loading animation
  const fieldName = OPAC_INDEX_NAMES[index] || 'Library catalog';
  if (loadingState) {
    loadingState.classList.remove('hidden');
    if (loadingText) {
      loadingText.textContent = `Searching for "${cleanQuery}" in ${fieldName}...`;
    }
  }
  if (booksGrid) booksGrid.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  // Smooth search button loading animation
  if (submitBtn) {
    submitBtn.disabled = true;
    if (btnIcon) {
      btnIcon.innerHTML = `
        <svg class="animate-spin w-4 h-4 text-slate-950 inline" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;
    }
    if (btnText) btnText.textContent = 'Searching...';
  }

  if (countEl) {
    countEl.innerHTML = `
      <span class="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        <span>Searching Academic Stacks...</span>
      </span>
    `;
  }

  try {
    let response = null;
    const proxyUrl = `/api/opac-search?q=${encodeURIComponent(cleanQuery)}&idx=${encodeURIComponent(index)}&limit=30`;

    try {
      response = await fetch(proxyUrl, { signal });
    } catch (proxyErr) {
      if (proxyErr.name === 'AbortError') return;
      // Fallback to Supabase Edge Function if /api/opac-search is not directly accessible
      const edgeUrl = `${SUPABASE_URL}/functions/v1/opac-search?q=${encodeURIComponent(cleanQuery)}&idx=${encodeURIComponent(index)}&limit=30`;
      response = await fetch(edgeUrl, {
        signal,
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
    }

    if (signal.aborted) return;

    if (response && response.ok) {
      const data = await response.json();
      if (data && data.success && Array.isArray(data.books)) {
        data.books.forEach(b => {
          if (b.id) liveOpacBooksCache.set(String(b.id), b);
          if (b.title) liveOpacBooksCache.set((b.title || '').trim().toLowerCase(), b);
        });
        state.liveOpacResults = data.books;
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.warn('[Library Search] Local catalogue fallback notice:', err.message);
    }
  } finally {
    state.isLiveOpacSearching = false;

    // Restore search button state
    if (submitBtn) {
      submitBtn.disabled = false;
      if (btnIcon) btnIcon.textContent = '🔍';
      if (btnText) btnText.textContent = 'Search';
    }

    // Hide loading animation and reveal the book cards grid
    if (loadingState) loadingState.classList.add('hidden');
    if (booksGrid) booksGrid.classList.remove('hidden');

    renderLibraryBooks();
  }
}

export function renderLibraryBooks() {
  const container = document.getElementById('library-books-grid');
  const countEl = document.getElementById('library-books-count');
  const emptyState = document.getElementById('library-empty-state');
  if (!container) return;

  const isLive = state.liveOpacResults && state.liveOpacResults.length > 0;
  const allBooks = isLive
    ? state.liveOpacResults
    : (state.libraryBooks && state.libraryBooks.length > 0
      ? state.libraryBooks
      : (FOE_DATA.library_books || []));

  const catFilter = state.libraryFilter.category || 'all';
  const statusFilter = state.libraryFilter.status || 'all';
  const opacIndex = state.libraryFilter.index || 'catalog';
  const rawSearch = (state.libraryFilter.search || '').trim();
  const searchFilter = rawSearch.toLowerCase();

  // Structured search filtering based on the selected left-aligned dropdown option
  const filtered = allBooks.filter(book => {
    if (catFilter !== 'all' && book.category !== catFilter) {
      return false;
    }
    if (statusFilter !== 'all' && book.availability_status !== statusFilter) {
      return false;
    }
    if (searchFilter) {
      const title = (book.title || '').toLowerCase();
      const author = (book.author || '').toLowerCase();
      const category = (book.category || '').toLowerCase();
      const isbn = ((book.isbn || '') + ' ' + (book.official_link || '')).toLowerCase();
      const issn = (book.issn || '').toLowerCase();
      const series = (book.series || '').toLowerCase();
      const callnum = (book.call_number || '').toLowerCase();

      if (opacIndex === 'title') {
        if (!title.includes(searchFilter)) {
          if (searchFilter.includes(' ')) {
            const terms = searchFilter.split(/\s+/).filter(Boolean);
            if (!terms.every(term => title.includes(term))) return false;
          } else {
            return false;
          }
        }
      } else if (opacIndex === 'author') {
        if (!author.includes(searchFilter)) {
          if (searchFilter.includes(' ')) {
            const terms = searchFilter.split(/\s+/).filter(Boolean);
            if (!terms.every(term => author.includes(term))) return false;
          } else {
            return false;
          }
        }
      } else if (opacIndex === 'subject') {
        if (!category.includes(searchFilter) && !title.includes(searchFilter)) return false;
      } else if (opacIndex === 'isbn') {
        const cleanIsbnFilter = searchFilter.replace(/[^0-9x]/gi, '');
        const cleanBookIsbn = isbn.replace(/[^0-9x]/gi, '');
        const matchExact = isbn.includes(searchFilter);
        const matchClean = cleanIsbnFilter.length >= 3 && cleanBookIsbn.includes(cleanIsbnFilter);
        if (!matchExact && !matchClean && !title.includes(searchFilter)) return false;
      } else if (opacIndex === 'issn') {
        if (!issn.includes(searchFilter)) return false;
      } else if (opacIndex === 'series') {
        if (!series.includes(searchFilter) && !title.includes(searchFilter)) return false;
      } else if (opacIndex === 'callnumber') {
        if (!callnum.includes(searchFilter) && !category.includes(searchFilter)) return false;
      } else {
        // Default: 'catalog' (Library catalog - comprehensive search across fields)
        const matchTitle = title.includes(searchFilter);
        const matchAuthor = author.includes(searchFilter);
        const matchCat = category.includes(searchFilter);
        const matchIsbn = isbn.includes(searchFilter);

        if (!matchTitle && !matchAuthor && !matchCat && !matchIsbn) {
          if (searchFilter.includes(' ')) {
            const terms = searchFilter.split(/\s+/).filter(Boolean);
            const allInTitle = terms.every(term => title.includes(term));
            const allInAuthor = terms.every(term => author.includes(term));
            if (!allInTitle && !allInAuthor) return false;
          } else {
            return false;
          }
        }
      }
    }
    return true;
  });

  // Update live book count badge in real time
  if (countEl) {
    if (state.isLiveOpacSearching) {
      countEl.innerHTML = `
        <span class="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
          <svg class="animate-spin w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Searching Stacks...</span>
        </span>
      `;
    } else if (searchFilter) {
      countEl.textContent = `${filtered.length} Book${filtered.length === 1 ? '' : 's'} Found`;
    } else {
      countEl.textContent = `${filtered.length} Book${filtered.length === 1 ? '' : 's'} Listed`;
    }
  }

  // Handle empty state if no books match query
  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) {
      emptyState.classList.remove('hidden');
      const emptyMsg = emptyState.querySelector('p');
      if (emptyMsg && rawSearch) {
        const fieldName = OPAC_INDEX_NAMES[opacIndex] || 'Library catalog';
        emptyMsg.textContent = state.isLiveOpacSearching
          ? `Searching catalogue for "${escapeHtml(rawSearch)}"...`
          : `No books found matching "${escapeHtml(rawSearch)}" in ${fieldName}.`;
      } else if (emptyMsg) {
        emptyMsg.textContent = 'Try clearing search terms or selecting a different discipline filter.';
      }
    }
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  filtered.forEach(book => {
    const card = document.createElement('article');
    card.id = `library-book-card-${book.id}`;
    card.className = 'library-book-card ios27-card group relative flex flex-col justify-between overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-amber-500/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-white/70 dark:bg-white/[0.03] cursor-pointer';
    card.setAttribute('data-book-id', book.id);
    card.setAttribute('data-book-title', book.title || '');

    const isAvailable = (book.availability_status || '').toLowerCase() === 'available';
    const isOnLoan = (book.availability_status || '').toLowerCase() === 'on loan';

    let badgeClass = 'bg-sky-600/95 text-white border-sky-300/40';
    let badgeText = book.availability_status || 'Reference Only';
    let badgeIcon = '🔒';

    if (isAvailable) {
      badgeClass = 'bg-emerald-600/95 text-white border-emerald-300/40 shadow-sm';
      badgeText = 'Available';
      badgeIcon = '<span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>';
    } else if (isOnLoan) {
      badgeClass = 'bg-amber-500/95 text-slate-950 border-amber-300/40 font-bold';
      badgeText = 'On Loan';
      badgeIcon = '🕒';
    }

    const coverUrl = book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';

    // Highlight search match in Title and Author depending on active Koha OPAC index
    const shouldHighlightTitle = searchFilter && (opacIndex === 'catalog' || opacIndex === 'title');
    const shouldHighlightAuthor = searchFilter && (opacIndex === 'catalog' || opacIndex === 'author');
    const displayTitle = shouldHighlightTitle ? highlightLibrarySearchMatch(book.title, rawSearch) : escapeHtml(book.title);
    const displayAuthor = shouldHighlightAuthor ? highlightLibrarySearchMatch(book.author, rawSearch) : escapeHtml(book.author || 'Faculty Member');

    card.innerHTML = `
      <div class="relative w-full aspect-[3/4] overflow-hidden bg-slate-900 pointer-events-none">
        <img 
          src="${coverUrl}" 
          alt="${escapeHtml(book.title)}" 
          class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>

        <!-- Floating Availability Pill -->
        <div class="absolute top-2.5 right-2.5 z-10">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide backdrop-blur-md border ${badgeClass}">
            ${badgeIcon}
            <span>${badgeText}</span>
          </span>
        </div>

        <!-- Discipline Tag -->
        <div class="absolute bottom-2.5 left-2.5 z-10">
          <span class="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-amber-200 font-bold">
            ${escapeHtml(book.category || 'General')}
          </span>
        </div>
      </div>

      <div class="p-4 flex flex-col flex-1 justify-between gap-3">
        <div class="space-y-1.5 pointer-events-none">
          <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            ${displayTitle}
          </h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 font-medium truncate">
            <span>✍️</span>
            <span class="truncate">${displayAuthor}</span>
          </p>
        </div>

        <div class="pt-2 border-t border-slate-200/80 dark:border-white/10">
          <button 
            type="button" 
            class="library-view-details-btn w-full py-2 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            data-book-id="${book.id}"
            data-book-title="${escapeHtml(book.title)}"
          >
            <span class="pointer-events-none">View Details</span>
            <span class="pointer-events-none">↗</span>
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

export async function fetchAndRenderLibraryBooks() {
  if (!state.libraryBooks || state.libraryBooks.length === 0) {
    await fetchLibraryBooks();
  }
  renderLibraryBooks();
}

let isBookModalClosing = false;
let bookModalCloseTimer = null;

// Helper to look up a book record by ID or Title
function findBookRecord(bookId, bookTitle) {
  if (bookId && liveOpacBooksCache.has(String(bookId))) {
    return liveOpacBooksCache.get(String(bookId));
  }
  if (bookTitle) {
    const cleanTitle = bookTitle.trim().toLowerCase();
    if (liveOpacBooksCache.has(cleanTitle)) {
      return liveOpacBooksCache.get(cleanTitle);
    }
  }

  const allBooks = (state.liveOpacResults && state.liveOpacResults.length > 0)
    ? state.liveOpacResults
    : ((state.libraryBooks && state.libraryBooks.length > 0)
      ? state.libraryBooks
      : (FOE_DATA.library_books || []));

  if (bookId) {
    const byId = allBooks.find(b => String(b.id) === String(bookId));
    if (byId) return byId;
  }
  if (bookTitle) {
    const cleanTitle = bookTitle.trim().toLowerCase();
    const byTitle = allBooks.find(b => (b.title || '').trim().toLowerCase() === cleanTitle);
    if (byTitle) return byTitle;
  }
  return null;
}

export function openBookDetailModal(book) {
  const modal = document.getElementById('book-detail-modal');
  if (!modal || !book) return;

  state.selectedBook = book;

  // Clear any pending close timer
  if (bookModalCloseTimer) {
    clearTimeout(bookModalCloseTimer);
    bookModalCloseTimer = null;
  }
  isBookModalClosing = false;

  const catEl = document.getElementById('book-modal-category');
  const badgeEl = document.getElementById('book-modal-availability-badge');
  const badgeText = document.getElementById('book-modal-availability-text');
  const badgeDot = document.getElementById('book-modal-dot');
  const coverEl = document.getElementById('book-modal-cover');
  const titleEl = document.getElementById('book-modal-title');
  const authorEl = document.getElementById('book-modal-author');
  const callNoEl = document.getElementById('book-modal-callno');
  const statusBox = document.getElementById('book-modal-status-box');
  const statusHeader = document.getElementById('book-modal-status-header');
  const statusDesc = document.getElementById('book-modal-status-desc');
  const officialLink = document.getElementById('book-modal-official-link');
  const officialLinkLabel = document.getElementById('book-modal-official-link-label');
  const urlDisplay = document.getElementById('book-modal-url-display');

  if (catEl) catEl.textContent = book.category || 'General Engineering';
  if (titleEl) titleEl.textContent = book.title || 'Book Title';
  if (authorEl) authorEl.textContent = book.author || 'Engineering Faculty Author';
  if (callNoEl) callNoEl.textContent = 'Faculty Academic Stacks';

  const collectionEl = document.getElementById('book-modal-collection');
  if (collectionEl) {
    collectionEl.textContent = `${book.category || 'Curriculum'} Reference Stacks`;
  }

  const isAvailable = (book.availability_status || '').toLowerCase() === 'available';
  const isOnLoan = (book.availability_status || '').toLowerCase() === 'on loan';

  if (badgeText) badgeText.textContent = book.availability_status || 'Reference Only';

  if (badgeEl && statusBox) {
    if (isAvailable) {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 bg-emerald-600 border border-emerald-400';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-white animate-pulse';
      statusBox.className = 'p-3.5 rounded-2xl border text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200';
      if (statusHeader) statusHeader.innerHTML = '<span>✓</span><span>Circulation Status: In Library & Ready for Loan</span>';
      if (statusDesc) statusDesc.textContent = 'This volume is available on open shelves at the Mattegoda Central Library. Undergraduates may borrow for 14 calendar days using student RFID smart cards.';
    } else if (isOnLoan) {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm flex items-center gap-1.5 bg-amber-500 border border-amber-300';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-slate-950';
      statusBox.className = 'p-3.5 rounded-2xl border text-xs bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200';
      if (statusHeader) statusHeader.innerHTML = '<span>🕒</span><span>Circulation Status: Currently On Loan</span>';
      if (statusDesc) statusDesc.textContent = 'This volume is currently checked out by a faculty member or student. You can place a hold request at the circulation desk or access the digital companion.';
    } else {
      badgeEl.className = 'px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 bg-sky-600 border border-sky-400';
      if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-white';
      statusBox.className = 'p-3.5 rounded-2xl border text-xs bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-200';
      if (statusHeader) statusHeader.innerHTML = '<span>🔒</span><span>Circulation Status: Permanent Reference Stacks</span>';
      if (statusDesc) statusDesc.textContent = 'Reserved for in-house reading and research within the Silent E-Scholar Lounge on Level 2. High-resolution photocopiers and scanners are provided.';
    }
  }

  if (coverEl) {
    coverEl.src = book.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80';
    coverEl.onerror = () => { coverEl.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'; };
  }

  // Official Link from Database - Ensure absolute HTTPS URL and direct redirection to official SJP library site
  let targetUrl = (book.official_link || '').trim();
  if (!targetUrl) {
    targetUrl = 'https://lib.sjp.ac.lk/';
  } else {
    if (targetUrl.startsWith('//')) {
      targetUrl = 'https:' + targetUrl;
    } else if (targetUrl.startsWith('/')) {
      targetUrl = `https://opac.lib.sjp.ac.lk${targetUrl}`;
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://opac.lib.sjp.ac.lk/${targetUrl}`;
    }
    if (targetUrl.startsWith('http://')) {
      targetUrl = targetUrl.replace(/^http:\/\//i, 'https://');
    }
  }

  if (officialLink) {
    officialLink.setAttribute('href', targetUrl);
    officialLink.setAttribute('target', '_blank');
    officialLink.setAttribute('rel', 'noopener noreferrer');
    officialLink.href = targetUrl;
    officialLink.target = '_blank';
    officialLink.rel = 'noopener noreferrer';

    // Direct redirection in a new tab via window.open
    officialLink.onclick = (e) => {
      e.stopPropagation();
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    };
  }

  if (officialLinkLabel) {
    if (targetUrl.includes('opac.lib.sjp.ac.lk') || targetUrl.includes('lib.sjp.ac.lk')) {
      officialLinkLabel.textContent = 'Access Official Library Record';
    } else if (targetUrl.includes('dr.lib.sjp.ac.lk')) {
      officialLinkLabel.textContent = 'Access University Scholar Bank';
    } else {
      officialLinkLabel.textContent = 'Access Academic Reference Resource';
    }
  }

  if (urlDisplay) {
    urlDisplay.textContent = targetUrl;
  }

  // Smooth entrance: unhide, force browser paint, and add .open class for transition
  modal.classList.remove('hidden');
  void modal.offsetWidth; // Force reflow
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeBookDetailModal() {
  const modal = document.getElementById('book-detail-modal');
  if (!modal || isBookModalClosing) return;

  isBookModalClosing = true;

  // Trigger smooth CSS opacity fade-out & scale-down transition
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Wait 320ms for smooth transition to complete before setting display:none
  bookModalCloseTimer = setTimeout(() => {
    if (isBookModalClosing) {
      modal.classList.add('hidden');
      isBookModalClosing = false;
      state.selectedBook = null;
    }
  }, 320);
}

export function initLibrarySection() {
  const searchInput = document.getElementById('library-search-input');
  const searchClear = document.getElementById('library-search-clear');
  const opacIndexSelect = document.getElementById('library-opac-index-select');
  const searchForm = document.getElementById('library-opac-search-form');
  const externalOpacBtn = document.getElementById('library-opac-external-btn');
  const categorySelect = document.getElementById('library-category-select');
  const statusSelect = document.getElementById('library-status-select');
  const resetBtn = document.getElementById('library-reset-filters-btn');
  const modal = document.getElementById('book-detail-modal');
  const closeBtn = document.getElementById('book-modal-close');
  const actionCloseBtn = document.getElementById('book-modal-action-close');
  const booksGrid = document.getElementById('library-books-grid');

  const submitBtn = document.getElementById('library-search-submit-btn');

  // 1. Search Index Dropdown Change Listener
  if (opacIndexSelect) {
    opacIndexSelect.addEventListener('change', (e) => {
      const selectedIndex = e.target.value;
      state.libraryFilter.index = selectedIndex;
      if (searchInput) {
        searchInput.placeholder = OPAC_PLACEHOLDERS[selectedIndex] || OPAC_PLACEHOLDERS.catalog;
        searchInput.focus();
        const currentQuery = searchInput.value.trim();
        if (currentQuery) {
          fetchLiveOpacBooks(currentQuery, selectedIndex);
        }
      }
      renderLibraryBooks();
    });
  }

  // 2. Search Form & Submit Button Actions
  const handleSearchTrigger = () => {
    if (searchInput) {
      const query = searchInput.value.trim();
      state.libraryFilter.search = query;
      renderLibraryBooks();
      if (query) {
        fetchLiveOpacBooks(query, state.libraryFilter.index);
      } else {
        state.liveOpacResults = null;
        renderLibraryBooks();
      }
    }
  };

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearchTrigger();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearchTrigger();
    });
  }

  // 4. Quick Search Tag Pills
  const tagBtns = document.querySelectorAll('.library-tag-btn');
  tagBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const query = btn.getAttribute('data-query') || btn.textContent.trim();
      const targetField = btn.getAttribute('data-field') || 'catalog';

      if (opacIndexSelect) {
        opacIndexSelect.value = targetField;
      }
      state.libraryFilter.index = targetField;

      if (searchInput) {
        searchInput.value = query;
        searchInput.placeholder = OPAC_PLACEHOLDERS[targetField] || OPAC_PLACEHOLDERS.catalog;
        searchInput.focus();
      }
      state.libraryFilter.search = query;
      if (searchClear) searchClear.classList.remove('hidden');
      renderLibraryBooks();

      // Trigger invisible backend proxy query for live Koha records
      fetchLiveOpacBooks(query, targetField);
    });
  });

  // 5. Search Input Listeners - Real-Time Dynamic Local Filtering + Debounced Live Proxy Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      state.libraryFilter.search = val;
      if (searchClear) searchClear.classList.toggle('hidden', !val.trim());
      renderLibraryBooks();

      // Debounce live OPAC query to backend proxy
      if (opacSearchDebounceTimer) {
        clearTimeout(opacSearchDebounceTimer);
      }
      const trimmed = val.trim();
      if (trimmed.length >= 3) {
        opacSearchDebounceTimer = setTimeout(() => {
          fetchLiveOpacBooks(trimmed, state.libraryFilter.index);
        }, 500);
      } else if (!trimmed) {
        state.liveOpacResults = null;
        renderLibraryBooks();
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInput.value) {
        if (opacSearchDebounceTimer) clearTimeout(opacSearchDebounceTimer);
        if (activeOpacAbortController) activeOpacAbortController.abort();
        searchInput.value = '';
        state.libraryFilter.search = '';
        state.liveOpacResults = null;
        if (searchClear) searchClear.classList.add('hidden');
        renderLibraryBooks();
      }
    });
  }

  // 6. Clear Search Button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (opacSearchDebounceTimer) clearTimeout(opacSearchDebounceTimer);
      if (activeOpacAbortController) activeOpacAbortController.abort();
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      state.libraryFilter.search = '';
      state.liveOpacResults = null;
      searchClear.classList.add('hidden');
      renderLibraryBooks();
    });
  }

  // 7. Discipline & Status Filters
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      state.libraryFilter.category = e.target.value;
      renderLibraryBooks();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      state.libraryFilter.status = e.target.value;
      renderLibraryBooks();
    });
  }

  // 8. Reset All Filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (opacSearchDebounceTimer) clearTimeout(opacSearchDebounceTimer);
      if (activeOpacAbortController) activeOpacAbortController.abort();
      if (searchInput) {
        searchInput.value = '';
        searchInput.placeholder = OPAC_PLACEHOLDERS.catalog;
        searchInput.focus();
      }
      if (searchClear) searchClear.classList.add('hidden');
      if (opacIndexSelect) opacIndexSelect.value = 'catalog';
      if (categorySelect) categorySelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      state.liveOpacResults = null;
      state.isLiveOpacSearching = false;
      state.libraryFilter = { category: 'all', status: 'all', search: '', index: 'catalog' };
      renderLibraryBooks();
    });
  }

  // 1. EVENT DELEGATION on the Books Grid
  // Catches clicks on '.library-view-details-btn' or on the book cards themselves
  if (booksGrid && !booksGrid._delegationBound) {
    booksGrid._delegationBound = true;
    booksGrid.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.library-view-details-btn');
      const card = e.target.closest('.library-book-card');

      if (!viewBtn && !card) return;

      e.preventDefault();
      e.stopPropagation();

      const target = viewBtn || card;
      const bookId = target.getAttribute('data-book-id');
      const bookTitle = target.getAttribute('data-book-title');

      const book = findBookRecord(bookId, bookTitle);
      if (book) {
        openBookDetailModal(book);
      }
    });
  }

  // 2. Fallback Event Delegation on Document
  // Guarantees that dynamically fetched Supabase books always respond to 'View Details'
  if (!document._libraryBookDelegationBound) {
    document._libraryBookDelegationBound = true;
    document.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.library-view-details-btn');
      if (viewBtn) {
        e.preventDefault();
        e.stopPropagation();
        const bookId = viewBtn.getAttribute('data-book-id');
        const bookTitle = viewBtn.getAttribute('data-book-title');
        const book = findBookRecord(bookId, bookTitle);
        if (book) {
          openBookDetailModal(book);
        }
      }
    });
  }

  // 3. Modal Close Handlers (Top '✕', Footer 'Close', Backdrop click)
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBookDetailModal();
    });
  }

  if (actionCloseBtn) {
    actionCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBookDetailModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('#book-modal-close, #book-modal-action-close')) {
        e.preventDefault();
        closeBookDetailModal();
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.openBookDetailModal = openBookDetailModal;
  window.closeBookDetailModal = closeBookDetailModal;
  window.fetchAndRenderLibraryBooks = fetchAndRenderLibraryBooks;
}

/**
 * Initialize Global Search Listeners (Desktop Header and Mobile Navigation)
 */
function initGlobalSearch() {
  const input = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('global-search-clear');
  const desktopDropdown = document.getElementById('global-search-dropdown');
  const mobToggle = document.getElementById('mobile-search-toggle');
  const mobRow = document.getElementById('mobile-search-row');
  const mobInput = document.getElementById('mobile-search-input');
  const mobClear = document.getElementById('mobile-search-clear');
  const shortcutHint = document.getElementById('global-search-shortcut');
  const mobileDropdown = document.getElementById('mobile-search-dropdown');

  const handleInput = (val) => {
    const query = val.trim();
    if (clearBtn) clearBtn.classList.toggle('hidden', query.length === 0);
    if (mobClear) mobClear.classList.toggle('hidden', query.length === 0);
    if (shortcutHint) shortcutHint.classList.toggle('hidden', query.length > 0);

    clearTimeout(globalSearchTimeout);
    if (query.length < 2) {
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
      currentSearchItems = [];
      selectedSearchIndex = -1;
      return;
    }

    globalSearchTimeout = setTimeout(() => {
      universalSearch(query);
    }, 180);
  };

  if (input) {
    input.addEventListener('input', (e) => {
      if (mobInput) mobInput.value = e.target.value;
      handleInput(e.target.value);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) {
        if (desktopDropdown) desktopDropdown.classList.remove('hidden');
      }
    });

    input.addEventListener('keydown', handleKeyNavigation);
  }

  if (mobInput) {
    mobInput.addEventListener('input', (e) => {
      if (input) input.value = e.target.value;
      handleInput(e.target.value);
    });

    mobInput.addEventListener('keydown', handleKeyNavigation);
  }

  // Clear buttons
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) input.value = '';
      if (mobInput) mobInput.value = '';
      clearBtn.classList.add('hidden');
      if (mobClear) mobClear.classList.add('hidden');
      if (shortcutHint) shortcutHint.classList.remove('hidden');
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
      if (input) input.focus();
    });
  }

  if (mobClear) {
    mobClear.addEventListener('click', () => {
      if (input) input.value = '';
      if (mobInput) mobInput.value = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      mobClear.classList.add('hidden');
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
      if (mobInput) mobInput.focus();
    });
  }

  // Mobile toggle
  if (mobToggle && mobRow) {
    mobToggle.addEventListener('click', () => {
      const isHidden = mobRow.classList.contains('hidden');
      if (isHidden) {
        mobRow.classList.remove('hidden');
        if (mobInput) mobInput.focus();
      } else {
        mobRow.classList.add('hidden');
        if (desktopDropdown) desktopDropdown.classList.add('hidden');
        if (mobileDropdown) mobileDropdown.classList.add('hidden');
      }
    });
  }

  // Keyboard Navigation: Arrow Up, Arrow Down, Enter, Escape
  function handleKeyNavigation(e) {
    const activeDropdown = (!desktopDropdown?.classList.contains('hidden')) 
      ? desktopDropdown 
      : (!mobileDropdown?.classList.contains('hidden') ? mobileDropdown : null);
    if (!activeDropdown) return;

    const items = activeDropdown.querySelectorAll('.global-search-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedSearchIndex = (selectedSearchIndex + 1) % items.length;
      updateSearchSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedSearchIndex = (selectedSearchIndex - 1 + items.length) % items.length;
      updateSearchSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSearchIndex >= 0 && selectedSearchIndex < items.length) {
        selectSearchResult(selectedSearchIndex);
      } else if (items.length > 0) {
        selectSearchResult(0);
      }
    } else if (e.key === 'Escape') {
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
    }
  }

  function updateSearchSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedSearchIndex) {
        item.classList.add('bg-amber-500/20', 'border-amber-400/50', 'ring-1', 'ring-amber-400/50');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-amber-500/20', 'border-amber-400/50', 'ring-1', 'ring-amber-400/50');
      }
    });
  }

  // Document click outside to close dropdowns
  document.addEventListener('click', (e) => {
    const searchContainer = document.getElementById('global-search-container');
    const mobileSearchRow = document.getElementById('mobile-search-row');
    const isInsideSearch = (searchContainer && searchContainer.contains(e.target)) || 
                           (mobileSearchRow && mobileSearchRow.contains(e.target)) ||
                           (mobToggle && mobToggle.contains(e.target));
    if (!isInsideSearch) {
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
    }
  });

  // Global keyboard shortcut: Pressing '/' focuses search input
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      if (input) {
        input.focus();
        input.select();
      }
    } else if (e.key === 'Escape') {
      if (desktopDropdown) desktopDropdown.classList.add('hidden');
      if (mobileDropdown) mobileDropdown.classList.add('hidden');
      closeStaffModal();
      closeDeptModal();
      closeFacilityModal();
      closeBookDetailModal();
      closeModal();
    }
  });

  // Department Modal Close Handlers
  const deptCloseBtn = document.getElementById('dept-modal-close');
  const deptModal = document.getElementById('dept-modal');
  if (deptCloseBtn) deptCloseBtn.addEventListener('click', closeDeptModal);
  if (deptModal) {
    deptModal.addEventListener('click', (e) => {
      if (e.target === deptModal) closeDeptModal();
    });
  }

  // Facility Modal Close Handlers
  const facCloseBtn = document.getElementById('facility-modal-close');
  const facModal = document.getElementById('facility-modal');
  if (facCloseBtn) facCloseBtn.addEventListener('click', closeFacilityModal);
  if (facModal) {
    facModal.addEventListener('click', (e) => {
      if (e.target === facModal) closeFacilityModal();
    });
  }

  // Staff Modal Close Handlers
  const staffCloseBtn = document.getElementById('staff-modal-close');
  const staffModal = document.getElementById('staff-modal');
  if (staffCloseBtn) staffCloseBtn.addEventListener('click', closeStaffModal);
  if (staffModal) {
    staffModal.addEventListener('click', (e) => {
      if (e.target === staffModal) closeStaffModal();
    });
  }
}

// Initial Boot
initScrollNavbar();
setupEventHandlers();
initWelcomeScreen();
initTabNavigation();
initLibrarySection();
initGlobalSearch();
fetchAndDisplayAnnouncements();
fetchDepartmentsFromSupabase();
fetchFacilitiesFromSupabase();
fetchLibraryBooks();

