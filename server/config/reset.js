import { pool } from "./database.js";
import achievementData from "../data/achievements.js";

const createStatusEnum = async () => {
  try {
    await pool.query(`
      CREATE TYPE ReadingStatus AS ENUM ('UNREAD', 'READING', 'FINISHED')
    `);
  } catch (error) {
    console.error("Error creating ReadingStatus type", error);
  }
};

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        github_id INTEGER NOT NULL,
        username VARCHAR(50) NOT NULL,
        avatar_url VARCHAR(500) NOT NULL,
        access_token VARCHAR(500) NOT NULL,
        books_read INTEGER DEFAULT 0,
        pages_read INTEGER DEFAULT 0
      )
    `);
  } catch (error) {
    console.error("Error creating Users table", error);
  }
};

const createReadingListsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ReadingLists (
        id SERIAL PRIMARY KEY,
        user_id INT references Users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating ReadingLists table", error);
  }
};

const createBooksTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Books (
        id SERIAL PRIMARY KEY,
        list_id INT references ReadingLists(id),
        title VARCHAR(255),
        author VARCHAR(255),
        genre VARCHAR(255),
        year INT,
        page_count INT,
        current_page INT DEFAULT 0,
        cover_image VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        status ReadingStatus DEFAULT 'UNREAD'
      )
    `);
  } catch (error) {
    console.error("Error creating Books table", error);
  }
};

const createUpdateTrigger = async () => {
    try {
      await pool.query(`
        CREATE OR REPLACE FUNCTION set_last_updated()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.last_updated = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS page_update ON books;

        CREATE TRIGGER page_update
        BEFORE UPDATE ON books
        FOR EACH ROW
        WHEN (OLD.current_page < NEW.current_page)
        EXECUTE FUNCTION set_last_updated();
      `);
  } catch (error) {
    console.error("Error creating Books table update trigger", error);
  }
};

const createReadingStatsTrigger = async () => {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_user_reading_stats()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE users
        SET pages_read = pages_read + NEW.current_page - OLD.current_page,
            books_read = books_read
              + CASE
                  WHEN OLD.status IS DISTINCT FROM 'FINISHED'
                    AND NEW.status = 'FINISHED'
                  THEN 1
                  ELSE 0
                END
        WHERE id = (
          SELECT user_id
          FROM readinglists
          WHERE id = NEW.list_id
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS user_reading_stats_update ON books;

      CREATE TRIGGER user_reading_stats_update
      AFTER UPDATE OF current_page, status ON books
      FOR EACH ROW
      EXECUTE FUNCTION update_user_reading_stats();
    `);
  } catch (error) {
    console.error("Error creating user reading stats trigger", error);
  }
};

const createAchievementsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        requirement TEXT
      )
    `)
  } catch (error) {
    console.error("Error creating Achievements table", error);
  }
};

const createUserAchievementsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserAchievements (
        id SERIAL PRIMARY KEY,
        acheivement_id INT REFERENCES Achievements(id),
        user_id INT REFERENCES Users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating UserAchievements table", error);
  }
};

//insert achievements from data/achievements.js
const seedAchievementsTable = async () => {
  await createAchievementsTable();
  await createUserAchievementsTable();

  achievementData.forEach((achievement) => {
    pool.query(`
      INSERT INTO Achievements (name, requirement)
      VALUES ($1, $2)
    `, [achievement.name, achievement.requirement], (err, res) => {
      if (err) {
        console.error("Error inserting achievement", err);
        return;
      }
    });
  });
};

const reset = async () => {
  try {
    await pool.query("DROP TABLE IF EXISTS Users, ReadingLists, Books, Achievements, UserAchievements CASCADE;");
    await pool.query("DROP TYPE IF EXISTS ReadingStatus;");

    await createStatusEnum();
    await createUsersTable();
    await createReadingListsTable();
    await createBooksTable();
    await createUpdateTrigger();
    await createReadingStatsTrigger();
    await seedAchievementsTable();
  } catch (error) {
    console.error("Error running reset function", error);
  }
};

reset();