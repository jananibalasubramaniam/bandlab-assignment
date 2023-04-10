const POSTS_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";
const postsAccordion = document.querySelector("#posts");
const errorMessageEl = document.querySelector("#error-message");
const sortButton = document.querySelector("#sort-button");
const groupButton = document.querySelector("#group-button");
const userFilter = document.querySelector("#user-filter");
let posts = [];
let filteredUserId = null;
let sortDirection = "asc";

/**
 * Creates an HTML element with the given tag name and adds the given class name.
 * @param {string} tagName - The tag name of the HTML element to be created.
 * @param {string} className - The class name to be added to the HTML element.
 * @returns {HTMLElement} - The created HTML element.
 */
const createHTMLEl = (el, className) => {
  const item = document.createElement(el);
  item.classList.add(className);
  return item;
};

/**
 * Toggles the active state of a given post item and expands or collapses its content accordingly.
 * @param {HTMLElement} item - The post item whose state to toggle.
 */
const togglePost = (item) => {
  const isActive = item.classList.contains("active");
  item.classList.toggle("active");
  const postContent = item.querySelector(".post-content");
  if (isActive) {
    postContent.style.maxHeight = 0;
  } else {
    postContent.style.maxHeight = postContent.scrollHeight + "px";
  }
};

/**
 * Fetches the posts from the remote JSONPlaceholder API endpoint.
 * Renders the posts accordion and populates the user ID filter.
 * Displays an error message if there was an issue fetching the posts.
 */
const getPosts = async () => {
  try {
    const response = await fetch(POSTS_ENDPOINT);
    posts = await response.json();
    renderPostsAccordion(posts);
    populateUserIdsForFilter(posts);
  } catch (error) {
    console.error(error);
    errorMessageEl.textContent =
      "Could not load posts. Please try again later!";
  }
};

/**
 * Sorts the given posts array in the specified direction based on their titles.
 * @param {Array} posts - The posts array to be sorted.
 * @param {string} sortDirection - The direction to sort the posts in ("asc", "desc", or "reset").
 * @returns {Array} - The sorted posts array.
 */
const sortPosts = (posts, sortDirection) => {
  return Object.values(posts).sort((post1, post2) => {
    const title1 = post1.title;
    const title2 = post2.title;
    return sortDirection === "asc"
      ? title1.localeCompare(title2)
      : sortDirection === "desc"
      ? title2.localeCompare(title1)
      : 0;
  });
};

/**
 * Filters the given posts array by the given user ID.
 * @param {Array} posts - The posts array to be filtered.
 * @param {number} userId - The user ID to filter the posts by.
 * @returns {Array} - The filtered posts array.
 */
const filterPostsByUserId = (posts, userId) => {
  return posts.filter((post) => post.userId === userId);
};

/**
 * Renders the posts accordion with the given posts array.
 * @param {Array} posts - The posts array to render in the accordion.
 */
const renderPostsAccordion = (posts) => {
  postsAccordion.innerHTML = "";
  posts.forEach((post) => {
    const item = createHTMLEl("section", "post-item");
    const header = createHTMLEl("h3", "post-header");
    const content = createHTMLEl("div", "post-content");
    const text = createHTMLEl("p", "post-text");

    header.textContent = post.title;
    text.textContent = post.body;

    content.appendChild(text);
    item.appendChild(header);
    item.appendChild(content);
    postsAccordion.appendChild(item);

    header.addEventListener("click", () => {
      togglePost(item);
    });
  });
};

/**
 * Handles the sorting of posts based on the selected direction and filtered user id (if any).
 */
const handleSortButtonClick = () => {
  let sortedPosts = [];
  if (filteredUserId) {
    sortedPosts = sortPosts(
      filterPostsByUserId(posts, filteredUserId),
      sortDirection
    );
  } else {
    sortedPosts = sortPosts(posts, sortDirection);
  }
  sortDirection =
    sortDirection === "asc"
      ? "desc"
      : sortDirection === "desc"
      ? "reset"
      : "asc";
  renderPostsAccordion(sortedPosts);
};

/**
 * Toggles the selection of a filter dropdown item and removes the previously selected item.
 * @param {HTMLElement} item - The filter dropdown item that was clicked.
 * @param {number} userId - The user id associated with the filter dropdown item.
 */
const selectUnselectFilterItem = (item, userId) => {
  const currentSelected = document.querySelector(
    ".filter-dropdown-item.selected"
  );
  const currentSelectedUserId =
    parseInt(currentSelected?.dataset.userId) || null;
  if (currentSelectedUserId === userId) {
    currentSelected.classList.remove("selected");
    return;
  }
  currentSelected?.classList.remove("selected");
  item.classList.add("selected");
};

/**
 * Handles the filtering of posts based on the selected user id.
 * @param {MouseEvent} event - The click event associated with the filter dropdown item.
 */
const handleFilterUserClick = (event) => {
  const item = event.target;
  const userId = parseInt(item.dataset.userId);
  if (!userId) {
    return;
  }
  selectUnselectFilterItem(item, userId);
  toggleFilterVisibility();
  if (userId === filteredUserId) {
    // user selected same filter again - unset the filtering
    filteredUserId = null;
    renderPostsAccordion(posts);
    return;
  }
  filteredUserId = userId;
  let filteredPosts = filterPostsByUserId(posts, userId);
  if (!filteredPosts) {
    return;
  }
  if (sortDirection !== "reset") {
    filteredPosts = sortPosts(filteredPosts, sortDirection);
  }
  renderPostsAccordion(filteredPosts);
};

/**
 * Toggles the visibility of the user filter dropdown menu.
 */
const toggleFilterVisibility = () => {
  userFilter.toggleAttribute("hidden");
};

/**
 * Populates the user ids for the user filter dropdown menu.
 * @param {Array} posts - The array of post objects containing the user ids.
 */
const populateUserIdsForFilter = (posts) => {
  const userIds = new Set();
  posts.forEach((post) => {
    userIds.add(post.userId);
  });
  userIds.forEach((userId) => {
    const item = createHTMLEl("li", "filter-dropdown-item");
    item.textContent = `User ${userId}`;
    item.setAttribute("data-user-id", `${userId}`);
    item.addEventListener("click", handleFilterUserClick);
    userFilter.appendChild(item);
  });
};

sortButton.addEventListener("click", handleSortButtonClick);
groupButton.addEventListener("click", toggleFilterVisibility);
getPosts();
