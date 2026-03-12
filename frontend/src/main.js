import './style.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/books';
console.log('Connecting to API at:', API_URL);

// DOM Elements
const bookGrid = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const addBookBtn = document.getElementById('addBookBtn');
const bookModal = document.getElementById('bookModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const bookForm = document.getElementById('bookForm');
const modalTitle = document.getElementById('modalTitle');

// State
let allBooks = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
});

// Update sidebar stats
function updateStats(books) {
    const total = books.length;
    const available = books.reduce((acc, book) => acc + (book.availableCopies || 0), 0);
    
    document.getElementById('statTotalBooks').textContent = total.toString().padStart(3, '0');
    document.getElementById('statAvailableBooks').textContent = available.toString().padStart(3, '0');
}

// Fetch Books
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allBooks = data;
        renderBooks(allBooks);
        updateStats(allBooks);
    } catch (error) {
        showNotification('ERROR: FAILED TO SYNCHRONIZE DATABASE', 'error');
    }
}

// Render Books
function renderBooks(books) {
    if (books.length === 0) {
        bookGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                NO RECORDS FOUND IN CURRENT DATABASE SCOPE
            </div>
        `;
        return;
    }

    bookGrid.innerHTML = books.map(book => `
        <div class="book-card glass decor">
            <h3 class="book-title">${book.title}</h3>
            <div class="book-info">
                <span>AUTHOR:</span>
                <span>${book.author}</span>
                <span>GENRE:</span>
                <span>${book.genre}</span>
                <span>ISBN:</span>
                <span>${book.isbn}</span>
                <span>STOCK:</span>
                <span style="color: ${book.availableCopies > 0 ? 'var(--success)' : 'var(--error)'}">${book.availableCopies} / ${book.totalCopies}</span>
            </div>
            <div class="book-actions">
                <button class="btn btn-outline edit-btn" data-id="${book._id}">MODIFY</button>
                <button class="btn btn-danger delete-btn" data-id="${book._id}">PURGE</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => handleEdit(btn.dataset.id);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => handleDelete(btn.dataset.id);
    });
}

// Handle Form Submit (Add/Edit)
bookForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('bookFormId').value;
    const body = {
        bookId: document.getElementById('bookId').value,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        genre: document.getElementById('genre').value,
        publisher: document.getElementById('publisher').value,
        totalCopies: parseInt(document.getElementById('totalCopies').value)
    };

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'TRANSACTION FAILED');
        }

        showNotification(id ? 'RECORD MODIFIED SUCCESSFULLY' : 'NEW RECORD COMMITTED TO DATABASE');
        closeBookModal();
        fetchBooks();
    } catch (error) {
        showNotification(`ABORTED: ${error.message}`, 'error');
    }
};

// Handle Search
searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        book.isbn.includes(term)
    );
    renderBooks(filtered);
};

// Handle Delete
async function handleDelete(id) {
    if (!confirm('CONFIRM PERMANENT RECORD PURGE?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('RECORD PURGED SUCCESSFULLY');
            fetchBooks();
        }
    } catch (error) {
        showNotification('PURGE ABORTED: SYSTEM ERROR', 'error');
    }
}

// Handle Edit
function handleEdit(id) {
    const book = allBooks.find(b => b._id === id);
    if (!book) return;

    modalTitle.textContent = 'MODIFY EXISTING RECORD';
    document.getElementById('bookFormId').value = book._id;
    document.getElementById('bookId').value = book.bookId;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('genre').value = book.genre;
    document.getElementById('publisher').value = book.publisher;
    document.getElementById('totalCopies').value = book.totalCopies;

    bookModal.style.display = 'flex';
}

// Modal Helpers
addBookBtn.onclick = () => {
    modalTitle.textContent = 'INITIALIZE NEW RECORD';
    bookForm.reset();
    document.getElementById('bookFormId').value = '';
    bookModal.style.display = 'flex';
};

function closeBookModal() {
    bookModal.style.display = 'none';
}

closeModal.onclick = closeBookModal;
cancelBtn.onclick = closeBookModal;
window.onclick = (e) => {
    if (e.target === bookModal) closeBookModal();
};

// Notification Helper
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification glass`;
    notification.style.background = type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 102, 0.1)';
    notification.style.borderColor = type === 'success' ? 'var(--success)' : 'var(--error)';
    notification.style.color = type === 'success' ? 'var(--success)' : 'var(--error)';
    notification.style.fontFamily = 'var(--font-header)';
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
