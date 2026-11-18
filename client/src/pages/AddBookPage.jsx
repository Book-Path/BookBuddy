import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BookForm from "../components/BookForm";
import BooksAPI from "../services/BooksAPI";
import './AddBookPage.css';
import './HomePage.css';
import BookSearch from "../components/BookSearch";

const toBookValues = (doc) => ({
  title: doc.title,
  author: doc.author_name?.[0] ?? "",
  year: doc.first_publish_year ?? "",
  page_count: doc.number_of_pages_median ?? "",
  cover_image: doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : "",
});

const AddBookPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="add-book-page">
      <div className="home-header">
        <h1>BookBuddy</h1>
        <nav className="home-links">
          <Link to="/#current" className="tab-button">Current Books</Link>
          <Link to="/#unread" className="tab-button">Unread Books</Link>
          <Link to="/#finished" className="tab-button">Finished Books</Link>
          <Link to="/achievements">Achievements</Link>
        </nav>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <div className="add-book-content">
        <h1>Add a New Book</h1>
        {/* <BookSearch onSelect={(doc) => console.log(doc)} />
        <BookForm submitLabel="Add book" onSubmit={BooksAPI.createBook} onSuccess={() => navigate("/")} /> */}
        <BookSearch onSelect={setSelected} />
        <BookForm
          key={selected?.key ?? "empty"}
          initialValues={selected ? toBookValues(selected) : undefined}
          submitLabel="Add book"
          onSubmit={BooksAPI.createBook}
          onSuccess={() => navigate("/")}
        />
        <Link className="home-btn" to="/">Back to Home</Link>
      </div>

    </div>
  );
};

export default AddBookPage;