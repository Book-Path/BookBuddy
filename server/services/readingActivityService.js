import { pool } from "../config/database.js";

const awardAchievements = async (client, userId, stats) => {
  await client.query(`
    INSERT INTO userachievements (user_id, achievement_id)
    SELECT $1, achievements.id
    FROM achievements
    WHERE (achievements.metric = 'books_read' AND achievements.threshold <= $2)
      OR (achievements.metric = 'pages_read' AND achievements.threshold <= $3)
    ON CONFLICT (achievement_id, user_id) DO NOTHING
  `, [userId, stats.books_read, stats.pages_read]);
};

const updateBook = async (userId, bookId, bookDetails) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const previous = await client.query(`
      SELECT books.current_page, books.status
      FROM books
      JOIN readinglists ON readinglists.id = books.list_id
      WHERE books.id = $1 AND readinglists.user_id = $2
      FOR UPDATE OF books
    `, [bookId, userId]);

    if (previous.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const oldBookData = previous.rows[0];
    const updated = await client.query(`
      UPDATE books
      SET title = $1, author = $2, genre = $3, year = $4, page_count = $5, current_page = $6, cover_image = $7, status = $8
      WHERE id = $9 AND list_id IN (SELECT id FROM readinglists WHERE user_id = $10)
      RETURNING *
    `, [bookDetails.title, bookDetails.author, bookDetails.genre, bookDetails.year, bookDetails.pageCount, bookDetails.currentPage, bookDetails.coverImage, bookDetails.status, bookId, userId]);

    if (updated.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const newBookData = updated.rows[0];
    const pageDifference = newBookData.current_page - oldBookData.current_page;
    const isChangeToFinish = oldBookData.status !== "FINISHED" && newBookData.status === "FINISHED";

    if (pageDifference !== 0 || isChangeToFinish) {
      const statsResult = await client.query(`
        UPDATE users
        SET pages_read = pages_read + $1, books_read = books_read + $2
        WHERE id = $3
        RETURNING books_read, pages_read
      `, [pageDifference, isChangeToFinish ? 1 : 0, userId]);

      if (statsResult.rows.length === 0) {
        throw new Error(`Could not update reading stats for user ${userId}`);
      }

      if (pageDifference > 0 || isChangeToFinish) {
        await client.query(`
          INSERT INTO readingactivities (user_id, book_id, pages_read, book_finished)
          VALUES ($1, $2, $3, $4)
        `, [userId, bookId, pageDifference, isChangeToFinish]);
      }

      await awardAchievements(client, userId, statsResult.rows[0]);
    }

    await client.query("COMMIT");

    return newBookData;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default { updateBook };