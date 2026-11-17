import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BooksAPI from "../services/BooksAPI";
import "./HomePage.css";
import "./AchievementsPage.css";

const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString([], { dateStyle: "medium" }) : "";

export default function AchievementsPage({ onLogout }) {

    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAchievements = async () => {
            try {
                const results = await BooksAPI.getMyAchievements();
                setAchievements(results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getAchievements();
    }, []);

    const earnedCount = achievements.filter((a) => a.earned).length;

    return (
        <div className="home-page">
            <div className="home-header">
                <h1>BookBuddy</h1>
                <nav className="home-links">
                    <Link to="/">My Books</Link>
                    <Link to="/books/new">Add Book</Link>
                </nav>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </div>

            <div className="home-content">
                <h1 className="book-section-header">Achievements</h1>

                {loading && <p>Loading achievements...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <>
                        <p className="achievement-summary">
                            {earnedCount} of {achievements.length} unlocked
                        </p>

                        <ul className="achievement-list">
                            {achievements.map((a) => (
                                <li key={a.id} className={`achievement ${a.earned ? "unlocked" : "locked"}`}>
                                    <span className="achievement-badge">
                                        {a.metric === "books_read" ? "📚" : "📖"}
                                    </span>
                                    <h3>{a.name}</h3>
                                    <p>{a.requirement}</p>
                                    <p className="achievement-status">
                                        {a.earned ? `Earned ${formatDate(a.earned_at)}` : "Locked"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}