import { useState } from "react";
import BookForm from "./BookForm";
import BooksAPI from "../services/BooksAPI";
import "./BookCard.css";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

export default function BookCard({ book }) {

    const [currentBook, setCurrentBook] = useState(book);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaved = (updated) => {
        setCurrentBook(updated);
        setIsEditing(false);
    };

    return (
        <article className="book-card">
            <div className="book-card-image">{currentBook.cover_image ? (
                <img src={currentBook.cover_image} alt={`Cover of ${currentBook.title}`} />
            ) : (
                <div className="book-card-placeholder">No cover</div>
            )}
            </div>

            {isEditing ? 
                <div className="book-card-details">
                    <BookForm 
                        initialValues={currentBook}
                        submitLabel="Save"
                        onSubmit={(data) => BooksAPI.editBook(currentBook.id, data)}
                        onSuccess={handleSaved}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
                : 
                (<div className="book-card-details">
                    <div className="book-header">
                        <h3>{currentBook.title}</h3>
                        <button className="edit-button" onClick={handleEdit}>Edit</button>
                    </div>
                    <p>Author: {currentBook.author}</p>
                    <p>Genre: {currentBook.genre}</p>
                    <p>Year: {currentBook.year}</p>
                    <p>Status: {currentBook.status}</p>
                    <p>Progress: {currentBook.current_page ?? 0} / {currentBook.page_count ?? "?"} pages</p>
                    <p>Added: {formatDate(currentBook.timestamp)}</p>
                    <p>Last updated: {formatDate(currentBook.last_updated)}</p>
                </div>)
            }



        </article>
    );
};