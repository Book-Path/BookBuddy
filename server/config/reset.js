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

const createReadingActivitiesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ReadingActivities (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES Users(id),
        book_id INT REFERENCES Books(id) ON DELETE SET NULL,
        pages_read INT NOT NULL DEFAULT 0 CHECK (pages_read >= 0),
        book_finished BOOLEAN NOT NULL DEFAULT FALSE,
        occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (pages_read > 0 OR book_finished)
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS reading_activities_user_occurred_at_idx
      ON ReadingActivities (user_id, occurred_at)
    `);
  } catch (error) {
    console.error("Error creating ReadingActivities table", error);
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

const createAchievementsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        requirement TEXT NOT NULL,
        metric VARCHAR(50) NOT NULL CHECK (metric IN ('books_read', 'pages_read')),
        threshold INTEGER NOT NULL CHECK (threshold > 0),
        UNIQUE (metric, threshold)
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
        achievement_id INT NOT NULL REFERENCES Achievements(id),
        user_id INT NOT NULL REFERENCES Users(id),
        earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (achievement_id, user_id)
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

  for (const achievement of achievementData) {
    await pool.query(`
      INSERT INTO Achievements (name, requirement, metric, threshold)
      VALUES ($1, $2, $3, $4)
    `, [
      achievement.name,
      achievement.requirement,
      achievement.metric,
      achievement.threshold,
    ]);
  }
};

const reset = async () => {
  try {
    await pool.query("DROP TABLE IF EXISTS Users, ReadingLists, Books, ReadingActivities, Achievements, UserAchievements CASCADE;");
    await pool.query("DROP TYPE IF EXISTS ReadingStatus;");
    await pool.query("DROP FUNCTION IF EXISTS update_user_reading_stats();");
    await pool.query("DROP FUNCTION IF EXISTS award_user_achievements();");

    await createStatusEnum();
    await createUsersTable();
    await createReadingListsTable();
    await createBooksTable();
    await createReadingActivitiesTable();
    await createUpdateTrigger();
    await seedAchievementsTable();
  } catch (error) {
    console.error("Error running reset function", error);
  }
};

reset();