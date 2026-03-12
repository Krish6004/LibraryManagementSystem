const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/books';

const testBook = {
  bookId: 'B101',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  isbn: '9780743273565',
  genre: 'Classic',
  publisher: 'Scribner',
  totalCopies: 5,
};

async function runTests() {
  console.log('🚀 Starting API Tests...');

  try {
    // 1. Add a new book
    console.log('\n1. POST /books (Add Book)');
    const postRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBook),
    });
    const postData = await postRes.json();
    console.log('Status:', postRes.status);
    console.log('Response:', postData);

    if (postRes.status !== 201) {
        console.error('Failed to add book. Ensure MongoDB is running or connection string is valid.');
        return;
    }

    const bookId = postData._id;

    // 2. Get all books
    console.log('\n2. GET /books (Get All Books)');
    const getAllRes = await fetch(API_URL);
    const getAllData = await getAllRes.json();
    console.log('Status:', getAllRes.status);
    console.log('Count:', getAllData.length);

    // 3. Get book by ID
    console.log(`\n3. GET /books/${bookId} (Get Book by ID)`);
    const getByIdRes = await fetch(`${API_URL}/${bookId}`);
    const getByIdData = await getByIdRes.json();
    console.log('Status:', getByIdRes.status);
    console.log('Title:', getByIdData.title);

    // 4. Update book
    console.log(`\n4. PUT /books/${bookId} (Update Book)`);
    const putRes = await fetch(`${API_URL}/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalCopies: 10 }),
    });
    const putData = await putRes.json();
    console.log('Status:', putRes.status);
    console.log('Updated Total Copies:', putData.totalCopies);

    // 5. Search book
    console.log('\n5. GET /books/search?title=Gatsby (Search Book)');
    const searchRes = await fetch(`${API_URL}/search?title=Gatsby`);
    const searchData = await searchRes.json();
    console.log('Status:', searchRes.status);
    console.log('Found:', searchData.length > 0 ? searchData[0].title : 'None');

    // 6. Delete book
    console.log(`\n6. DELETE /books/${bookId} (Delete Book)`);
    const deleteRes = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
    const deleteData = await deleteRes.json();
    console.log('Status:', deleteRes.status);
    console.log('Message:', deleteData.message);

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Since node-fetch is needed, and I might not have it installed or need to use dynamic import for v3
// I'll suggest the user installs it or I'll try to use a simpler version if possible.
// Actually, I'll install node-fetch for the test script.
runTests();
