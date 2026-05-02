// STEP 1: SELECT ELEMENTS
const form = document.getElementById('bookmarkForm');
const bookmarksList = document.getElementById('bookmarksList');
const filterButtons = document.querySelectorAll('.filter-btn');

// DATA
let bookmarks = [];
let currentFilter = 'All';

// DEFAULT SETTINGS
const DEFAULT_SETTINGS = Object.freeze({
  storageKey: "bookmarksData",
  categories: ["Work", "Study", "Entertainment"],
  defaultCategory: "Work"
});

// LOCAL STORAGE
function saveBookmarks() {
  localStorage.setItem(
    DEFAULT_SETTINGS.storageKey,
    JSON.stringify(bookmarks)
  );
}

function loadBookmarks() {
  const stored = localStorage.getItem(DEFAULT_SETTINGS.storageKey);
  bookmarks = stored ? JSON.parse(stored) : [];
}

// FILTER FUNCTION
function filterBookmarks(categoryFilter) {
  if (categoryFilter === 'All') {
    return [...bookmarks]; // ✅ safer copy
  }

  return bookmarks.filter(b => b.category === categoryFilter);
}

// DELETE FUNCTION
function deleteBookmark(id) {
  bookmarks = bookmarks.filter(b => b.id !== id);

  saveBookmarks();
  renderBookmarks();
}

// RENDER FUNCTION
function renderBookmarks() {
  const filteredBookmarks = filterBookmarks(currentFilter);

  bookmarksList.innerHTML = '';

  // Better empty handling
  if (bookmarks.length === 0) {
    bookmarksList.innerHTML = '<p>No bookmarks added yet.</p>';
    return;
  )

  filteredBookmarks.forEach(({ id, title, url, category }) => {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.classList.add('bookmark-item');

    const bookmarkInfo = document.createElement('div');
    bookmarkInfo.classList.add('bookmark-info');

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;

    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.textContent = url;
    linkEl.target = '_blank';
    linkEl.classList.add('bookmark-link');

    const categoryEl = document.createElement('div');
    categoryEl.classList.add('bookmark-category');
    categoryEl.textContent = category;

    bookmarkInfo.appendChild(titleEl);
    bookmarkInfo.appendChild(linkEl);
    bookmarkInfo.appendChild(categoryEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', () => deleteBookmark(id));

    bookmarkElement.appendChild(bookmarkInfo);
    bookmarkElement.appendChild(deleteBtn);

    bookmarksList.appendChild(bookmarkElement);
  });
}

// ADD BOOKMARK
function addBookMark(e) {
  e.preventDefault();

  let websiteTitle = document.getElementById('websiteTitle').value.trim();
  let websiteUrl = document.getElementById('websiteUrl').value.trim();
  let category = document.getElementById('category').value;

  //  Validation
  if (!websiteTitle || !websiteUrl) {
    alert("Please fill all fields");
    return;
  }

  // Fix URL (auto add https)
  if (!websiteUrl.startsWith('http')) {
    websiteUrl = 'https://' + websiteUrl;
  }

  if (!category) category = DEFAULT_SETTINGS.defaultCategory;

  const newBookmark = {
    id: Date.now(),
    title: websiteTitle,
    url: websiteUrl,
    category: category
  };

  bookmarks.push(newBookmark);

  saveBookmarks();
  renderBookmarks();

  form.reset();
}

// INIT FUNCTION
function init() {
  loadBookmarks();

  form.addEventListener('submit', addBookMark);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      currentFilter = button.dataset.category;

      renderBookmarks();
    });
  });

  renderBookmarks();
}

// LOAD APP
document.addEventListener('DOMContentLoaded', init);
