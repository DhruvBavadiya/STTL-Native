import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import ReportCard, { QuestionCardProps } from '@/components/ReportCard';
import { getdbConnection } from '@/DB';
import { getAllQuestion } from '@/Services/question.service';
import { getAllAnswers, getId } from '@/Services/AsyncStorage';
import { Answer } from '@/Types/answer';

const Report = ({ route, navigation }: { route: any; navigation: any }) => {
  const [questions, setQuestions] = useState<QuestionCardProps[]>([]);
  const [totals, setTotals] = useState({ correct: 0, incorrect: 0, unanswered: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      let user_id = route.params?.user_id || (await getId());
      const db = await getdbConnection();

      const allQuestions = await getAllQuestion(db);
      const allAnswers = await getAllAnswers(user_id);

      const answeredQuestionIds = new Set(allAnswers.map(answer => answer.question_id));

      const reportData: QuestionCardProps[] = allQuestions.map(question => {
        const answered = answeredQuestionIds.has(question.q_id);
        const answer = allAnswers.find(answer => answer.question_id === question.q_id);
        return {
          q_id: question.q_id,
          questionText: question.question,
          isAnswered: answered,
          isCorrect: answered ? answer?.isCorrect || false : false
        };
      });

      const correctCount = reportData.filter(question => question.isCorrect).length;
      const incorrectCount = reportData.filter(question => question.isAnswered && !question.isCorrect).length;
      const unansweredCount = reportData.filter(question => !question.isAnswered).length;

      setQuestions(reportData);
      setTotals({ correct: correctCount, incorrect: incorrectCount, unanswered: unansweredCount });
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching questions and answers:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    

    fetchQuestions();
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    fetchQuestions();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b5998" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Your Report</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryText, styles.correctText]}>Correct</Text>
            <Text style={styles.countText}>{totals.correct}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryText, styles.incorrectText]}>Incorrect</Text>
            <Text style={styles.countText}>{totals.incorrect}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryText, styles.unansweredText]}>Unanswered</Text>
            <Text style={styles.countText}>{totals.unanswered}</Text>
          </View>
        </View>
        {questions.map(question => (
          <ReportCard
            key={question.q_id}
            q_id={question.q_id}
            questionText={question.questionText}
            isCorrect={question.isCorrect}
            isAnswered={question.isAnswered}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'CourierPrime-Regular',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily: 'CourierPrime-Bold',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#3b5998',
  },
  retryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'CourierPrime-Bold',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal:22,
    borderRadius:20
  },
  summaryItem: {
    alignItems: 'center',
    
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'CourierPrime-Bold',
  },
  correctText: {
    color: '#5cb85c', // Green for correct
  },
  incorrectText: {
    color: '#d9534f', // Red for incorrect
  },
  unansweredText: {
    color: '#f0ad4e', // Orange for unanswered
  },
  countText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'CourierPrime-Bold',
  },
});

export default Report;
