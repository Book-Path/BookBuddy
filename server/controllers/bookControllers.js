import { pool } from "../config/database.js";
import readingActivityService from "../services/readingActivityService.js";


const getMyBooks = async (req, res) => {
  try {
    //get every column from the 'books' table only
    const results = await pool.query(`
      SELECT books.*
      FROM books
      JOIN readingLists ON books.list_id = readinglists.id
      WHERE readinglists.user_id = $1
      ORDER BY books.id ASC
      `, [req.user.id]);

    res.status(200).json(results.rows)

  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message})
  }
}

const addBook = async (req, res) => {
  try {

    const { title, author, genre, year, pageCount, coverImage } = req.body;

    const listResult = await pool.query(`SELECT id FROM readinglists WHERE user_id = $1`, [req.user.id])
    if (listResult.rows.length === 0) return res.status(404).json({ error: "Reading list not found" });

    const results = await pool.query(`
      INSERT INTO Books (list_id, title, author, genre, year, page_count, cover_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [listResult.rows[0].id, title, author, genre, year, pageCount, coverImage]);

    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
};

const editBookInfo = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const book = await readingActivityService.updateBook(req.user.id, bookId, req.body);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const results = await pool.query(`
      DELETE FROM Books
      WHERE id = $1
      AND list_id IN (SELECT id FROM readinglists WHERE user_id = $2)
      RETURNING *
    `, [bookId, req.user.id]);

    if (results.rows.length === 0) return res.status(404).json({ error: "Book not found" });

    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { getMyBooks, addBook, editBookInfo, deleteBook };