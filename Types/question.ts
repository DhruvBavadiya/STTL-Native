export interface addQuestionType{
    questionText: string;
    options: string[];
    correctAnswerIndex: number
}

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

  export {Option,Question,QuestionOptionJoin}