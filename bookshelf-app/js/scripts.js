document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (this.dataset.action === "edit") {
      updateBook(this.dataset.id);
    } else {
      addBook();
    }
  });

  document
    .getElementById("searchBook")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      searchBooks();
    });

  displayBooks();
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  const books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
  document.getElementById("inputBook").reset();
}

function displayBooks(books = JSON.parse(localStorage.getItem("books")) || []) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "<h2>Books In Progress</h2>";
  completeBookshelfList.innerHTML = "<h2>Completed Books</h2>";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book_item";
    bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>
            <div class="action">
                <button onclick="toggleComplete(${book.id})">${
      book.isComplete ? "Mark as Incomplete" : "Mark as Complete"
    }</button>
                <button onclick="deleteBook(${
                  book.id
                })" class="red">Delete</button>
                <button onclick="editBook(${
                  book.id
                })" class="green">Edit</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  });
}

function deleteBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const updatedBooks = books.filter((book) => book.id !== id);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
  displayBooks();
}

function editBook(id) {
  openEditDialog(id);
}

function updateBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const bookIndex = books.findIndex((book) => book.id === parseInt(id));
  if (bookIndex !== -1) {
    books[bookIndex] = {
      id: parseInt(id),
      title: document.getElementById("inputBookTitle").value,
      author: document.getElementById("inputBookAuthor").value,
      year: parseInt(document.getElementById("inputBookYear").value),
      isComplete: document.getElementById("inputBookIsComplete").checked,
    };
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
    document.getElementById("inputBook").reset();
    delete document.getElementById("inputBook").dataset.action;
    delete document.getElementById("inputBook").dataset.id;
  }
}

function searchBooks() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  displayBooks(filteredBooks); // Memanggil displayBooks dengan hasil pencarian
}

function toggleComplete(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
  }
}

function openEditDialog(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const book = books.find((book) => book.id === id);
  if (book) {
    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editYear").value = book.year;
    document.getElementById("editDialog").style.display = "block";
    document.getElementById("editBookForm").dataset.id = id;
  }
}

function closeEditDialog() {
  document.getElementById("editDialog").style.display = "none";
}

document
  .querySelector(".edit-dialog-close")
  .addEventListener("click", closeEditDialog);

document
  .getElementById("editBookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    updateBook(parseInt(this.dataset.id));
  });

function updateBook(id) {
  const title = document.getElementById("editTitle").value;
  const author = document.getElementById("editAuthor").value;
  const year = parseInt(document.getElementById("editYear").value, 10);

  const books = JSON.parse(localStorage.getItem("books")) || [];
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;

    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
    closeEditDialog();
  }
}
