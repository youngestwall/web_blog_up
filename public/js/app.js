// API Base URL
const API_URL = "/api/posts";

// DOM Elements
const postForm = document.getElementById("postForm");
const blogForm = document.getElementById("blogForm");
const homePostsContainer = document.getElementById("homePostsContainer");
const managePostsContainer = document.getElementById("managePostsContainer");
const newPostBtn = document.getElementById("newPostBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const postIdInput = document.getElementById("postId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const contentInput = document.getElementById("content");
const aboutSection = document.getElementById("aboutSection");
const homeSection = document.getElementById("homeSection");
const manageSection = document.getElementById("manageSection");
const postDetailSection = document.getElementById("postDetailSection");

// Quill Editor
let quill;

// State
let isEditing = false;
let currentView = "home"; // Track current view

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initQuillEditor();
  loadPosts();
  setupEventListeners();
  startLiveClock();
  startVisitTimer();
  updateFooterDate();
});

// Live Clock Function
function startLiveClock() {
  const clockElement = document.getElementById("liveClock");

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    if (clockElement) {
      clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }

  // Update immediately
  updateClock();

  // Update every second
  setInterval(updateClock, 1000);
}

// Visit Timer Function - Count up from 00:00:00
function startVisitTimer() {
  const timerElement = document.getElementById("visitTimer");
  let totalSeconds = 0;

  function updateTimer() {
    totalSeconds++;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secondsStr = String(seconds).padStart(2, "0");

    if (timerElement) {
      timerElement.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
  }

  // Update every second
  setInterval(updateTimer, 1000);
}

// Footer Date Function - Display current date in dd/mm/yyyy format
function updateFooterDate() {
  const dateElement = document.getElementById("footerDate");
  
  function updateDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    
    if (dateElement) {
      dateElement.textContent = `${day}/${month}/${year}`;
    }
  }
  
  // Update immediately
  updateDate();
  
  // Update every minute (date doesn't change often)
  setInterval(updateDate, 60000);
}

// Page Navigation
function showHome() {
  aboutSection.classList.add("hidden");
  manageSection.classList.add("hidden");
  postDetailSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
  currentView = "home";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showManage() {
  aboutSection.classList.add("hidden");
  homeSection.classList.add("hidden");
  postDetailSection.classList.add("hidden");
  manageSection.classList.remove("hidden");
  currentView = "manage";
  loadPosts(); // Reload posts when entering manage view
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showAbout() {
  homeSection.classList.add("hidden");
  manageSection.classList.add("hidden");
  postDetailSection.classList.add("hidden");
  aboutSection.classList.remove("hidden");
  currentView = "about";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize Quill Rich Text Editor
function initQuillEditor() {
  if (typeof Quill !== "undefined") {
    quill = new Quill("#editor-container", {
      theme: "snow",
      placeholder: "Viết nội dung bài viết của bạn...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });
  }
}

// Event Listeners
function setupEventListeners() {
  newPostBtn.addEventListener("click", showNewPostForm);
  cancelBtn.addEventListener("click", hidePostForm);

  const cancelBtnBottom = document.getElementById("cancelBtnBottom");
  if (cancelBtnBottom) {
    cancelBtnBottom.addEventListener("click", hidePostForm);
  }

  const modalOverlay = document.getElementById("modalOverlay");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", hidePostForm);
  }

  blogForm.addEventListener("submit", handleFormSubmit);
}

// Show/Hide Form
function showNewPostForm() {
  isEditing = false;
  formTitle.innerHTML =
    '<i class="fas fa-edit"></i><span>Tạo bài viết mới</span>';
  blogForm.reset();
  if (quill) quill.setContents([]);
  postIdInput.value = "";
  postForm.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function showEditForm(post) {
  isEditing = true;
  formTitle.innerHTML =
    '<i class="fas fa-edit"></i><span>Chỉnh sửa bài viết</span>';
  postIdInput.value = post.id;
  titleInput.value = post.title;
  authorInput.value = post.author;

  if (quill) {
    if (post.content.includes("<")) {
      quill.root.innerHTML = post.content;
    } else {
      quill.setText(post.content);
    }
  }

  postForm.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hidePostForm() {
  postForm.classList.add("hidden");
  blogForm.reset();
  if (quill) quill.setContents([]);
  isEditing = false;
  document.body.style.overflow = "auto";
}

// Load Posts
async function loadPosts() {
  try {
    // Show loading on both containers
    if (homePostsContainer) {
      homePostsContainer.innerHTML = `
        <div class="loading-state">
          <div class="loader"></div>
          <p>Đang tải bài viết...</p>
        </div>
      `;
    }

    if (managePostsContainer) {
      managePostsContainer.innerHTML = `
        <div class="loading-state">
          <div class="loader"></div>
          <p>Đang tải bài viết...</p>
        </div>
      `;
    }

    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success && result.data) {
      displayPosts(result.data);
    } else {
      const errorMsg =
        '<div class="loading-state"><p>Không thể tải bài viết.</p></div>';
      if (homePostsContainer) homePostsContainer.innerHTML = errorMsg;
      if (managePostsContainer) managePostsContainer.innerHTML = errorMsg;
    }
  } catch (error) {
    console.error("Lỗi khi tải bài viết:", error);
    const errorMsg =
      '<div class="loading-state"><p>Lỗi kết nối. Vui lòng thử lại sau.</p></div>';
    if (homePostsContainer) homePostsContainer.innerHTML = errorMsg;
    if (managePostsContainer) managePostsContainer.innerHTML = errorMsg;
  }
}

// Display Posts
function displayPosts(posts) {
  if (posts.length === 0) {
    const emptyMsg = `
      <div class="loading-state">
        <p>Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!</p>
      </div>
    `;
    if (homePostsContainer) homePostsContainer.innerHTML = emptyMsg;
    if (managePostsContainer) managePostsContainer.innerHTML = emptyMsg;
    return;
  }

  // Home view: Read-only posts with preview and read more button
  const homePostsHTML = posts
    .map((post) => {
      const preview = getContentPreview(post.content, 200);
      const isLong = post.content.length > 200;
      return `
    <div class="post-card" data-post-id="${post.id}">
      <div class="post-header">
        <h2 class="post-title">${escapeHtml(post.title)}</h2>
        <div class="post-meta">
          <div class="meta-item">
            <i class="fas fa-user"></i>
            <span>${escapeHtml(post.author)}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span>${formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
      <div class="post-content post-preview" id="preview-${
        post.id
      }">${preview}</div>
      <div class="post-content post-full hidden" id="full-${post.id}">${
        post.content
      }</div>
      <div class="post-actions">
        <button class="btn-action btn-read-more" onclick="viewPostDetail(${
          post.id
        })">
          <i class="fas fa-book-open"></i>
          <span>Đọc bài viết</span>
        </button>
      </div>
    </div>
  `;
    })
    .join("");

  // Manage view: Compact posts with preview and action buttons
  const managePostsHTML = posts
    .map((post) => {
      const preview = getContentPreview(post.content, 150);
      return `
    <div class="post-card post-card-compact">
      <div class="post-header-compact">
        <div class="post-info">
          <h3 class="post-title-compact">${escapeHtml(post.title)}</h3>
          <div class="post-meta-compact">
            <span class="meta-compact"><i class="fas fa-user"></i> ${escapeHtml(
              post.author
            )}</span>
            <span class="meta-compact"><i class="fas fa-calendar"></i> ${formatDate(
              post.created_at
            )}</span>
          </div>
        </div>
        <div class="post-actions-compact">
          <button class="btn-icon btn-edit-compact" onclick="editPost(${
            post.id
          })" title="Chỉnh sửa">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete-compact" onclick="deletePost(${
            post.id
          })" title="Xóa">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="post-preview-compact">${preview}</div>
    </div>
  `;
    })
    .join("");

  if (homePostsContainer) homePostsContainer.innerHTML = homePostsHTML;
  if (managePostsContainer) managePostsContainer.innerHTML = managePostsHTML;
}

// Handle Form Submit
async function handleFormSubmit(e) {
  e.preventDefault();

  const content = quill ? quill.root.innerHTML : contentInput.value;

  const postData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    content: content.trim(),
  };

  try {
    let response;

    if (isEditing) {
      const postId = postIdInput.value;
      response = await fetch(`${API_URL}/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    }

    const result = await response.json();

    if (result.success) {
      showMessage("success", result.message);
      hidePostForm();
      loadPosts();
    } else {
      showMessage("error", result.message || "Có lỗi xảy ra");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showMessage("error", "Không thể kết nối đến server");
  }
}

// Edit Post
async function editPost(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();

    if (result.success && result.data) {
      showEditForm(result.data);
    } else {
      showMessage("error", "Không thể tải bài viết");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showMessage("error", "Không thể tải bài viết");
  }
}

// Delete Post
async function deletePost(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showMessage("success", result.message);
      loadPosts();
    } else {
      showMessage("error", result.message || "Không thể xóa bài viết");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showMessage("error", "Không thể kết nối đến server");
  }
}

// View Post Detail
async function viewPostDetail(postId) {
  try {
    const response = await fetch(`${API_URL}/${postId}`);
    const result = await response.json();

    if (result.success && result.data) {
      const post = result.data;

      // Update detail section
      document.getElementById("detailTitle").textContent = post.title;
      document.getElementById("detailAuthor").textContent = post.author;
      document.getElementById("detailDate").textContent = formatDate(
        post.created_at
      );
      document.getElementById("detailContent").innerHTML = post.content;

      // Show detail section
      homeSection.classList.add("hidden");
      manageSection.classList.add("hidden");
      aboutSection.classList.add("hidden");
      postDetailSection.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showMessage("error", "Không thể tải bài viết");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showMessage("error", "Không thể kết nối đến server");
  }
}

// Get Content Preview
function getContentPreview(content, maxLength) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const text = div.textContent || div.innerText || "";

  if (text.length <= maxLength) {
    return content;
  }

  // Get preview from HTML content
  let charCount = 0;
  let result = "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  function traverseNodes(node) {
    if (charCount >= maxLength) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const remaining = maxLength - charCount;
      const textContent = node.textContent.substring(0, remaining);
      result += textContent;
      charCount += textContent.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (charCount >= maxLength) return;

      const tag = node.tagName.toLowerCase();
      result += `<${tag}`;

      // Copy attributes
      Array.from(node.attributes).forEach((attr) => {
        result += ` ${attr.name}="${attr.value}"`;
      });
      result += ">";

      // Process children
      Array.from(node.childNodes).forEach((child) => traverseNodes(child));

      result += `</${tag}>`;
    }
  }

  Array.from(doc.body.childNodes).forEach((node) => traverseNodes(node));

  return result + "...";
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMessage(type, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    ${message}
  `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
