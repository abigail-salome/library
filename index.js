// Correct the old 'books' (if necessary)
let books = JSON.parse(localStorage.getItem("myLibrary")) || [];
books = books.map(book => {
  if (book.read === undefined) {
    book.read = false;
  }
  return book;
});
localStorage.setItem("myLibrary", JSON.stringify(books));

// Book array
const myLibrary = [];
const container = document.getElementById("container");
const addNewBook = document.getElementById("add-new-book");
const formContainer = document.getElementById("form-container");
const cancelButton = document.getElementById("cancel");
const form = document.getElementById("book-form");

// Load library from local storage
const storedLibrary = localStorage.getItem("myLibrary");
if (storedLibrary) {
  const loadedBooks = JSON.parse(storedLibrary);
  myLibrary.push(...loadedBooks);
}

// Constructor
function Book(title, author, pages, id, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.id = id;
  this.read = read;
}

// Save library to local storage
function saveLibrary() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// Add a book to library
function addBookToLibrary(title, author, pages, read = false) {
  const id = crypto.randomUUID();
  const book = new Book(title, author, pages, id, read);
  myLibrary.push(book);
  saveLibrary();
}

// Display books
function displaysBooks() {
  container.innerHTML = "";
  for (let i = 0; i < myLibrary.length; i++) {
    const book = myLibrary[i];

    const card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Pages: ${book.pages}</p>
        <p>Status: ${book.read ? "Read" : "Unread"}</p>
        <p>ID: ${book.id}</p>
    `;

    // Create Mark as Read / Unread button
    const markAsReadButton = document.createElement("button");
    markAsReadButton.textContent = book.read ? "Mark as Unread" : "Mark as Read";
    markAsReadButton.setAttribute("data-id", book.id);
    markAsReadButton.classList.add("read-button");
    markAsReadButton.addEventListener("click", function () {
      toggleReadStatus(book.id);
    });

    // Create Remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-id", book.id);
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", function () {
      removeBook(book.id);
    });

    // Append buttons to the card
    card.appendChild(markAsReadButton);
    card.appendChild(removeButton);

    // Append the card to the container
    container.appendChild(card);
  }
}

// Toggle read status
function toggleReadStatus(bookId) {
  const book = myLibrary.find((book) => book.id === bookId);
  if (book) {
    book.read = !book.read;
    saveLibrary();
    displaysBooks();
  }
}

// Remove a book
function removeBook(bookId) {
  const index = myLibrary.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    saveLibrary();
    displaysBooks();
  }
}

// Handle Add New Book button
addNewBook.addEventListener("click", function () {
  formContainer.classList.remove("hidden");
});

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;

  if (title && author && pages) {
    addBookToLibrary(title, author, pages, false);
  }

  displaysBooks();
  form.reset();
  formContainer.classList.add("hidden");
});

// Handle Cancel button
cancelButton.addEventListener("click", function () {
  form.reset();
  formContainer.classList.add("hidden");
});

// Initial display
displaysBooks();
