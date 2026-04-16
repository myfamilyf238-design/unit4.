
// STEP 1: ADD BOOKMARKS TO BOOK LIST

// Select the form with id bookmarkForm and store in variable named form
const form = document.getElementById('bookmarkForm');

// Create an empty array named bookmarks
let bookmarks = [];
const bookmarksList = document.getElementById('bookmarksList');

// STEP 4: CREATE DEFAULT APPLICATION SETTINGS
const DEFAULT_SETTINGS = Object.freeze({
  storageKey: "bookmarksData", 
  categories: ["Work", "Study", "Entertainment"], 
  defaultCategory: "Work" 
});

//  FILTER BOOKMARKS VARIABLES
let currentFilter = 'All';
const filterButtons = document.querySelectorAll('.filter-btn');

// LOCALSTORAGE FUNCTIONS

// Build saveBookmarks() function
function saveBookmarks() {
  const bookmarksString = JSON.stringify(bookmarks);
  localStorage.setItem(DEFAULT_SETTINGS.storageKey, bookmarksString);
}

// Build loadBookmarks() function
function loadBookmarks() {
  const storedBookmarks = localStorage.getItem(DEFAULT_SETTINGS.storageKey);
  if (storedBookmarks) {
    bookmarks = JSON.parse(storedBookmarks);
  } else {
    bookmarks = [];
  }
}
// STEP 2: FILTER BOOKMARKS FUNCTION
function filterBookmarks(categoryFilter) {
  // Handle default "All" filter
  if (categoryFilter === 'All') {
    return bookmarks; 
  }

  // Filter : create new empty array
  const filtered = [];
  // Loop through bookmarks array one by one
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].category === categoryFilter) {
      filtered.push(bookmarks[i]); 
    }
  }
  return filtered;
}

// STEP 3: DELETE BOOKMARK FUNCTION
function deleteBookmark(id) {
  bookmarks = bookmarks.filter(bookmark => bookmark.id!== id);
  console.log('After delete, bookmarks:', bookmarks); 

  saveBookmarks(); 
  renderBookmarks(); 
}

//  RENDER BOOKMARKS FUNCTION
// Create function named renderBookmarks
function renderBookmarks() {
  //  Create variable filteredBookmarks and assign filtered result
  const filteredBookmarks = filterBookmarks(currentFilter);
  console.log('filteredBookmarks:', filteredBookmarks);

  // Set innerHTML = "" to solve duplication problem
  bookmarksList.innerHTML = '';

  if (filteredBookmarks.length === 0) {
    bookmarksList.innerHTML = '<p>No bookmarks found.</p>';
    return; 
  }

  // Loop through filteredBookmarks array
  filteredBookmarks.forEach(bookmark => {
    // Access id, title, url, category
    const { id, title, url, category } = bookmark;

    // Create new div element and store in bookmarkElement
    const bookmarkElement = document.createElement('div');
    // Add class name bookmark-item dynamically
    bookmarkElement.classList.add('bookmark-item');

    // Create bookmark-info div
    const bookmarkInfo = document.createElement('div');
    bookmarkInfo.classList.add('bookmark-info');

    // Display bookmark title using heading element
    const titleEl = document.createElement('h3');
    titleEl.textContent = title; 
    bookmarkInfo.appendChild(titleEl);

    // Display URL using anchor element
    const linkEl = document.createElement('a');
    linkEl.href = url; 
    linkEl.textContent = url; 
    linkEl.target = '_blank';
    bookmarkInfo.appendChild(linkEl);

    // Create div element to display bookmark category
    const categoryEl = document.createElement('div');
    categoryEl.classList.add('bookmark-category'); 
    categoryEl.textContent = category; 
    bookmarkInfo.appendChild(categoryEl);

    // Append bookmark-info to bookmarkElement
    bookmarkElement.appendChild(bookmarkInfo);

    // Add Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.setAttribute('data-id', id); 
    deleteBtn.addEventListener('click', () => deleteBookmark(id));
    bookmarkElement.appendChild(deleteBtn);

    bookmarksList.appendChild(bookmarkElement);
  });
}

//  CREATE SUBMIT FUNCTION
// Create function named addBookMark and accept event parameter e
function addBookMark(e) {
  e.preventDefault(); 

  // Get values from input fields using their ids
  const websiteTitle = document.getElementById('websiteTitle').value.trim();
  const websiteUrl = document.getElementById('websiteUrl').value.trim();
  let category = document.getElementById('category').value;

  //  Use defaultCategory if user doesn't select
  if (!category) category = DEFAULT_SETTINGS.defaultCategory;

  // Create object named newBookmark
  const newBookmark = {
    id: Date.now(), 
    title: websiteTitle, 
    url: websiteUrl, 
    category: category 
  };

  // Add newBookmark to bookmarks array using push method
  bookmarks.push(newBookmark);
  console.log(bookmarks);

  saveBookmarks(); 
  renderBookmarks(); 
  form.reset(); 
}

// INIT FUNCTION - CONNECT ALL EVENTS
function init() {
  loadBookmarks(); 

  //  Attach submit event listener to form
  form.addEventListener('submit', addBookMark);

  //  Loop through filterButtons using forEach
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.category;
      renderBookmarks();
    });
  });

  renderBookmarks();
}

document.addEventListener('DOMContentLoaded', init);