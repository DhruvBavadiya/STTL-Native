import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { getdbConnection } from "@/DB";
import { getAllQuestion } from "@/Services/question.service";
import { Question } from "@/Types/question";
import Quiz from "@/components/Quiz";
import { Answer } from "@/Types/answer";
import { getAllAnswers, getId, storeAnswer } from "@/Services/AsyncStorage";
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

const Exam = ({ navigation }: { navigation: any }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [count, setCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleOptionPress = async (option_id: number) => {
    setSelectedOption(option_id);
    const selectedOption = questions[count].options.find(
      (option) => option.option_id === option_id
    );
    const isCorrect = selectedOption ? selectedOption.is_correct : false;
    setIsCorrect(isCorrect ? true : false);

    const answer: Answer = {
      user_id: await getId(),
      question_id: questions[count].q_id,
      selected_option_id: option_id ? option_id : 0,
      isCorrect: isCorrect ? true : false,
      question_text: questions[count].question,
    };
    await storeAnswer(answer);
  };

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const db = await getdbConnection();
        const res = await getAllQuestion(db);
        const id = await getId();
        const givenAnswers: Answer[] = await getAllAnswers(id);
        console.log("In Exam", givenAnswers);
        const questionIdsSet = new Set(
          givenAnswers.map((item) => item.question_id)
        );
        const filteredQuestions = res.filter(
          (item) => !questionIdsSet.has(item.q_id)
        );
        console.log(filteredQuestions);
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (count >= questions.length - 1) {
      Alert.alert("Quiz Completed", "You have answered all the questions.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("User"),
        },
      ]);
    } else {
      setCount((prevCount) => prevCount + 1);
      setSelectedOption(null);
      setIsCorrect(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {questions.length > 0 && (
          <Quiz
            question={questions[count]}
            handleOptionPress={handleOptionPress}
            selectedOption={selectedOption}
          />
        )}
        {questions.length > 0 && (
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedOption === null && styles.nextButtonDisabled,
            ]}
            onPress={handleNextQuestion}
            disabled={selectedOption === null}
          >
            <Text style={styles.nextButtonText}>Next Question</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  nextButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  nextButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    width: width * 0.8, // Make button width responsive
  },
  nextButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default Exam;
