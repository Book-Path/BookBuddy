import { useState, useEffect } from "react"
import BooksAPI from "../services/BooksAPI"
import { Link } from "react-router-dom"
import "./HomePage.css"
import BookCard from "../components/BookCard"


const HomePage = () => {

    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const listOfBooks = await BooksAPI.getMyBooks();
                setBooks(listOfBooks);
            } catch (error) {
                setError(error)
            }
        }
        fetchData();
    }, [])

    return (
        <div className="HomePage">
            <h1>BookBuddy</h1>

            {error && <p>{error.message}</p>}

            

            <nav className="home-links">
                <Link to="/books/new">Add a book</Link>
                <Link to="/books/manage">Manage Books</Link>
            </nav>

            {books.length === 0 && <p>No books yet. Add your first one!</p>}
            
            {/*change this to tabs to filter by book status, including all books*/}
            <h2>Currently reading:</h2>
            <ul className="book-grid">
                {books.filter(book => book.status === "READING").map((book) => (
                    <li key={book.id}>
                        <BookCard book={book}/>
                    </li>
                ))}
            </ul>
            <br></br>

            <h2>Unread:</h2>
            <ul className="book-grid">
                {books.filter(book => book.status === "UNREAD").map((book) => (
                    <li key={book.id}>
                        <BookCard book={book}/>
                    </li>
                ))}
            </ul>
            <br></br>

            <h2>Finished books:</h2>
            <ul className="book-grid">
                {books.filter(book => book.status === "FINISHED").map((book) => (
                    <li key={book.id}>
                        <BookCard book={book}/>
                    </li>
                ))}
            </ul>
        </div>
    )
};


export default HomePage;