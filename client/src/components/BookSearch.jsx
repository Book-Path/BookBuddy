import { useState } from "react";
import OpenLibraryAPI from "../services/OpenLibraryAPI";
import "./BookSearch.css";

const BookSearch = ({ onSelect }) => {
    const [title, setTitle] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const docs = await OpenLibraryAPI.searchBooks(title.trim());
            setResults(docs);
            setSearched(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (doc) => {
        onSelect(doc);
        setResults([]);
        setSearched(false);
    };

    return (
        <div className="book-search">
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    className="search-input"
                    aria-label="Search Open Library by title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Search Open Library by title"
                />
                <button className="search-btn" type="submit" disabled={loading}>
                    {loading ? "Searching…" : "Search"}
                </button>
            </form>

            {error && <p>{error}</p>}
            {searched && !loading && !error && results.length === 0 && <p>No books found.</p>}

            <ul className="search-results">
                {results.map((doc) => (
                    <li key={doc.key}>
                        <button className="search-result" type="button" onClick={() => handleSelect(doc)}>
                            {doc.cover_i ? (
                                <img src={`https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`} alt="" />
                            ) : (
                                <div className="search-result-placeholder">No cover</div>
                            )}
                            <span className="search-result-text">
                                <strong>{doc.title}</strong>
                                <span>
                                    {doc.author_name?.[0] ?? "Unknown author"}
                                    {doc.first_publish_year && ` · ${doc.first_publish_year}`}
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookSearch;