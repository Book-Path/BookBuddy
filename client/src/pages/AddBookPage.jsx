import { Link, useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import BooksAPI from "../services/BooksAPI";
import './AddBookPage.css';
import './HomePage.css';

const AddBookPage = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="add-book-page">
      <div className="home-header">
        <h1>BookBuddy</h1>
        <nav className="home-links">
          <Link to="/#current" className="tab-button">Current Books</Link>
          <Link to="/#unread" className="tab-button">Unread Books</Link>
          <Link to="/#finished" className="tab-button">Finished Books</Link>
          <Link to="/books/new">Add Book</Link>
        </nav>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <div className="add-book-content">
        <h1>Add a New Book</h1>
        <BookForm submitLabel="Add book" onSubmit={BooksAPI.createBook} onSuccess={() => navigate("/")} />
        <Link className="home-btn" to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default AddBookPage;