import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type QuestionCardProps = {
  q_id: number;
  questionText: string;
  isCorrect: boolean;
  isAnswered: boolean;
};

const ReportCard: React.FC<QuestionCardProps> = ({ q_id, questionText, isCorrect, isAnswered }) => {
  const getBorderColor = () => {
    if (isAnswered) {
      return isCorrect ? '#4CAF50' : '#F44336'; // Green for correct, red for incorrect
    } else {
      return 'gray'; // Yellow for not answered
    }
  };

  return (
    <View style={[styles.card, { borderColor: getBorderColor() }]}>
      <Text style={styles.questionId}>{questionText}</Text>
      <View style={styles.header}>
      <Text style={styles.questionText}>ID: {q_id}</Text>
        
      <Text style={[styles.statusText, { color: getBorderColor() }]}>
          {isAnswered ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not Answered'}
        </Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
    fontFamily: 'CourierPrime-Regular', // Apply CourierPrime-Regular font family to all text elements
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  questionId: {
    fontSize: 18,
    // fontWeight: '900',
    color: '#333',
    
    fontFamily: 'CourierPrime-Bold',
  },
  questionText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    // fontWeight: '400',
    fontFamily: 'CourierPrime-Regular',
  },
  statusText: {
    fontSize: 14,
    // fontWeight: '800',
    fontFamily: 'CourierPrime-Bold',
  },
});

export default ReportCard;
