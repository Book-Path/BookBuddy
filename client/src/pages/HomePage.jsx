import { useState, useEffect } from "react"
import BooksAPI from "../services/BooksAPI"
import { Link } from "react-router-dom"
import "./HomePage.css"
import BookCard from "../components/BookCard"


const HomePage = ({ onLogout }) => {

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
        <div className="home-page">
            <div className="home-header">
                <h1>BookBuddy</h1>
                <nav className="home-links">
                    <a href="#current" className="tab-button">Current Books</a>
                    <a href="#unread" className="tab-button">Unread Books</a>
                    <a href="#finished" className="tab-button">Finished Books</a>
                    <Link to="/books/new">Add Book</Link>
                    <Link to="/books/manage">Manage Books</Link>
                </nav>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </div>

            <div className="home-content">
                {error && <p>{error.message}</p>}
                {books.length === 0 && <p>No books yet. Add your first one!</p>}

                {/*change this to tabs to filter by book status, including all books*/}
                <div id="current" className="book-status-section">
                    <h1 className="book-section-header">Currently Reading</h1>
                    <ul className="book-list">
                        {books.filter(book => book.status === "READING").map((book, index) => (
                            <li key={book.id}>
                                <BookCard book={book} className={index % 2 === 0 ? "even" : "odd"} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div id="unread" className="book-status-section">
                    <h1 className="book-section-header">Unread</h1>
                    <ul className="book-list">
                        {books.filter(book => book.status === "UNREAD").map((book, index) => (
                            <li key={book.id}>
                                <BookCard book={book} className={index % 2 === 0 ? "even" : "odd"} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div id="finished" className="book-status-section">
                    <h1 className="book-section-header">Finished Books</h1>
                    <ul className="book-list">
                        {books.filter(book => book.status === "FINISHED").map((book, index) => (
                            <li key={book.id}>
                                <BookCard book={book} className={index % 2 === 0 ? "even" : "odd"} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div >
    )
};


export default HomePage;