import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;
// connection to database
export const getdbConnection = () => {
db = SQLite.openDatabaseSync("qna.manage");
return db;
}

// Function to create tables
export const createTables = async () => {
    try {
      const db = getdbConnection();
      
      const userQuery = `
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          image TEXT,              -- New column for image
          phone_number TEXT        -- New column for phone number
        );
      `;
  
      const questionsQuery = `
        CREATE TABLE IF NOT EXISTS Questions (
          q_id INTEGER PRIMARY KEY AUTOINCREMENT,
          question TEXT NOT NULL
        );
      `;
  
      const optionsQuery = `
        CREATE TABLE IF NOT EXISTS Options (
          option_id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          option_text TEXT NOT NULL,
          is_correct BOOLEAN NOT NULL,
          FOREIGN KEY (question_id) REFERENCES Questions (q_id) ON DELETE CASCADE
        );
      `;
  
      const answersQuery = `
        CREATE TABLE IF NOT EXISTS GivenAnswers (
          user_id INTEGER NOT NULL,
          question_id INTEGER NOT NULL,
          selected_option_id INTEGER NOT NULL,
          answer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
          FOREIGN KEY (question_id) REFERENCES Questions (q_id) ON DELETE CASCADE,
          FOREIGN KEY (selected_option_id) REFERENCES Options (option_id) ON DELETE CASCADE,
          PRIMARY KEY (user_id, question_id)
        );
      `;
  
      // Execute each table creation query sequentially
      await db.execAsync(userQuery);
      await db.execAsync(questionsQuery);
      await db.execAsync(optionsQuery);
      await db.execAsync(answersQuery);
  
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  };
  