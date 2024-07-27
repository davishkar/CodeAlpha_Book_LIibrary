const bookList = document.getElementById('book-list');
const borrowHistoryList = document.getElementById('borrow-history-list');
const addBookForm = document.getElementById('add-book-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResultsList = document.getElementById('search-results-list');

let books = [];

// Function to display books in the book list
function displayBooks(filteredBooks) {
    bookList.innerHTML = '';
    filteredBooks.forEach((book, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <p>Category: ${book.category}</p>
                <p>Borrowed Date: ${book.borrowedDate ? book.borrowedDate : 'N/A'}</p>
            </div>
            <button class="delete-button" onclick="deleteBook(${index})">Delete</button>
        `;
        bookList.appendChild(li);
    });
}

// Function to display borrowing history
function displayBorrowHistory() {
    borrowHistoryList.innerHTML = '';
    books.forEach(book => {
        if (book.borrowedDate) {
            const li = document.createElement('li');
            li.innerHTML = `${book.title} by ${book.author} borrowed on ${book.borrowedDate}`;
            borrowHistoryList.appendChild(li);
        }
    });
}

// Function to add a book to the list
function addBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const category = document.getElementById('category').value;
    const borrowedDate = document.getElementById('borrowed-date').value;

    const newBook = { title, author, category, borrowedDate, image: 'https://res.cloudinary.com/dtrmjjphv/image/upload/v1722071224/images-removebg-preview_o6xgmc.png' };
    books.push(newBook);

    displayBooks(books);
    displayBorrowHistory();
    addBookForm.reset();
}

// Function to delete a book from the list
function deleteBook(index) {
    books.splice(index, 1);
    displayBooks(books);
    displayBorrowHistory();
}

// Function to search books using Google Books API
function searchBooks() {
    const query = searchInput.value.toLowerCase();
    if (!query) return;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&AIzaSyDmgUBn9AmRR-0e8A-do-7SbuHXX_VjiqY`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data.items);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to display search results from Google Books
function displaySearchResults(results) {
    searchResultsList.innerHTML = '';
    results.forEach(item => {
        const book = item.volumeInfo;
        const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : 'https://res.cloudinary.com/dtrmjjphv/image/upload/v1722071224/images-removebg-preview_o6xgmc.png';
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${thumbnail}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>by ${book.authors ? book.authors.join(', ') : 'Unknown'}</p>
                <p>Category: ${book.categories ? book.categories.join(', ') : 'Unknown'}</p>
            </div>
            <button onclick="addBookFromSearch('${book.title}', '${book.authors ? book.authors.join(', ') : 'Unknown'}', '${book.categories ? book.categories.join(', ') : 'Unknown'}', '${thumbnail}')">Add to Library</button>
        `;
        searchResultsList.appendChild(li);
    });
}

// Function to add a book from search results to the library
function addBookFromSearch(title, author, category, image) {
    const newBook = { title, author, category, borrowedDate: '', image };
    books.push(newBook);

    displayBooks(books);
    displayBorrowHistory();
}

addBookForm.addEventListener('submit', addBook);
searchButton.addEventListener('click', searchBooks);

// Display the initial list of books
displayBooks(books);
