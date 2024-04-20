document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookform");
  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });
  displayBooks();
});

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;
  const book = {
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
  const books = getBooks();
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
  bookForm.reset();
}

function getBooks() {
  return JSON.parse(localStorage.getItem("books")) || [];
}

function displayBooks() {
  const books = getBooks();
  const unfinishedBooks = document.getElementById("unfinishedBooks");
  const finishedBooks = document.getElementById("finishedBooks");
  unfinishedBooks.innerHTML = "";
  finishedBooks.innerHTML = "";

  books.forEach((book) => {
    const bookElem = document.createElement("div");
    bookElem.className = "book";
    bookElem.innerHTML = `<strong>${book.title}</strong> by ${book.author} (${
      book.year
    })
        <button onclick="toggleComplete(${book.id})">${
      book.isComplete ? "Mark as Unfinished" : "Mark as Finished"
    }</button>
        <button onclick="deleteBook(${book.id})">Delete</button>`;
    if (book.isComplete) {
      finishedBooks.appendChild(bookElem);
    } else {
      unfinishedBooks.appendChild(bookElem);
    }
  });
}

function toggleComplete(id) {
  const books = getBooks();
  const book = books.find((book) => book.id === id);
  book.isComplete = !book.isComplete;
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

function deleteBook(id) {
  const books = getBooks();
  const newBooks = books.filter((book) => book.id !== id);
  localStorage.setItem("books", JSON.stringify(newBooks));
  displayBooks();
}
