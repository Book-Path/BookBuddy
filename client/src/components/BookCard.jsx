import { useState } from "react";
import BookForm from "./BookForm";
import BooksAPI from "../services/BooksAPI";
import "./BookCard.css";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

export default function BookCard({ book, className = "" }) {

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
        <article className={`book-card ${className}`.trim()}>
            <div className="book-card-image">{currentBook.cover_image ? (
                <img src={currentBook.cover_image} alt={`Cover of ${currentBook.title}`} />
            ) : (
                <div className="book-card-placeholder">No cover</div>
            )}
            </div>

            {isEditing ?
                <div className="book-card-body">
                    <div className="book-card-details">
                        <BookForm
                            initialValues={currentBook}
                            submitLabel="Save"
                            onSubmit={(data) => BooksAPI.editBook(currentBook.id, data)}
                            onSuccess={handleSaved}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                </div>
                :
                (<div className="book-card-body">
                    <div className="book-card-details">
                        <div className="book-info">
                            <h3>{currentBook.title}</h3>
                            <p>{currentBook.author}</p>
                            <div className="metadata">
                                <p>{currentBook.genre}</p>
                                <p>·</p>
                                <p>{currentBook.year}</p>
                            </div>
                        </div>
                        <div className="reading-info">
                            <p>{currentBook.status}</p>
                            <p>Progress: {currentBook.current_page ?? 0} / {currentBook.page_count ?? "?"} pages</p>
                            <p>Added: {formatDate(currentBook.timestamp)}</p>
                            <p>Last updated: {formatDate(currentBook.last_updated)}</p>
                        </div>
                    </div>
                    <div className="book-card-edit-button">
                        <button className="edit-button" onClick={handleEdit}>Edit</button>
                    </div>
                </div>)
            }
        </article >
    );
};