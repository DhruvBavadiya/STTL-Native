import { addQuestionType } from "@/Types/question";
import * as SQLite from "expo-sqlite";

export const addQuestion = async (
  db: SQLite.SQLiteDatabase,
  data: addQuestionType
) => {
  try {
    const questionquery = `INSERT INTO Questions (question) VALUES (?)`;
    const result = await db.runAsync(questionquery, [data.questionText]);
    if (result.lastInsertRowId) {
      const optionQuery = `INSERT INTO Options (question_id , option_text , is_correct) VALUES (${result.lastInsertRowId},?,?)`;
      data.options.map(async (option, index) => {
        if (index === data.correctAnswerIndex) {
          await db.runAsync(optionQuery, [option, true]);
        } else {
          await db.runAsync(optionQuery, [option, false]);
        }
      });
    }
    console.log("added question successfully");
  } catch (error) {
    console.log("error while adding quetion", error);
  }
};

type Option = {
  option_id: number;
  option_text: string;
  is_correct: number;
  question_id: number;
};

type Question = {
  q_id: number;
  question: string;
  options: Option[];
};

type QuestionOptionJoin = {
  is_correct: number;
  option_id: number;
  option_text: string;
  q_id: number;
  question: string;
  question_id: number;
};

export const getAllQuestion = async (
  db: SQLite.SQLiteDatabase
): Promise<Question[]> => {
  try {
    const query = `
        SELECT * FROM Questions 
        RIGHT JOIN Options
        ON Questions.q_id = Options.question_id 
      `;

    const data: QuestionOptionJoin[] = await db.getAllAsync(query);

    const groupedData = data.reduce<Record<number, Question>>((acc, item) => {
      if (!acc[item.q_id]) {
        acc[item.q_id] = {
          q_id: item.q_id,
          question: item.question,
          options: [],
        };
      }
      acc[item.q_id].options.push({
        option_id: item.option_id,
        option_text: item.option_text,
        is_correct: item.is_correct,
        question_id: item.question_id,
      });
      return acc;
    }, {});

    const res = Object.values(groupedData);
    // console.log(JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
