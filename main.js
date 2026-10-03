// html elements assigned to variables
const searchButton = document.getElementById('search-button');
const userInput = document.getElementById('user-search');
const bookResults = document.getElementById('book-results');

// click event on search button for async function
searchButton.addEventListener('click', async () => { 
    const userEnteredSearch = userInput.value.trim();
    // if input empty program stops
    if (!userEnteredSearch) return;

    bookResults.innerHTML = "Searching for results...";

    // try / catch function for api fetch and json parsing
    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(userEnteredSearch)}&limit=20`);
        const APIdata = await res.json();

        if (APIdata.docs.length === 0) {
            bookResults.innerHTML = "No books found.";
            return;
        }

        bookResults.innerHTML = "";
        
        APIdata.docs.forEach(book => {
            // gets book title, author, and publish year from the API response
            const bookTitle = book.title;

            let bookAuthor = "Unknown Author";
            if (book.author_name && book.author_name.length > 0) {
                bookAuthor = book.author_name.join(', ');
            }

            let bookpublishYear = "Unknown year";
            if (book.first_publish_year) {
                bookpublishYear = book.first_publish_year;
            }
            
            let bookCoverURl = 'https://via.placeholder.com/60x90?text=No+Cover';
            if (book.cover_i) {
                bookCoverURl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
            }

            // create the html elements for the book cards 
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <img src="${bookCoverURl}" alt="Cover of ${bookTitle}">
                <div>
                    <h3>${bookTitle}</h3>
                    <p>Author: ${bookAuthor}</p>
                    <p>First Published: ${bookpublishYear}</p>
                </div>
            `;

            bookResults.appendChild(bookCard);
        });
    }
    catch (error) {
        console.error("Error occured fetching data:", error);
        bookResults.innerHTML = "Failed to fetch data...please try again";
    }
});