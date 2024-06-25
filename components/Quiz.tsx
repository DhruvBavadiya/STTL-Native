import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Question } from '@/Types/question';

type QuizProps = {
  question: Question;
  handleOptionPress: (option_id: number) => void;
  selectedOption: number | null;
};

const Quiz: React.FC<QuizProps> = ({ question, handleOptionPress, selectedOption }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.headerText}>Quiz Question</Text> */}
      <View style={styles.inputContainer}>
        <Text style={styles.question}>{question.question}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option.option_id}
            style={[
              styles.optionButton,
              selectedOption === option.option_id && (option.is_correct ? styles.correctOptionButton : styles.incorrectOptionButton),
              selectedOption !== null && styles.disabledOptionButton,
            ]}
            onPress={() => handleOptionPress(option.option_id)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option.option_text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    width: 350,
  },
  headerText: {
    fontSize: 30,
    // fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'CourierPrime-Bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 30,
    // fontWeight: 'bold',
    textAlign: 'center',
    // marginBottom: 10,
    fontFamily: 'CourierPrime-Bold',
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    elevation: 2,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'CourierPrime-Regular',
  },
  correctOptionButton: {
    backgroundColor: '#d4edda', // Light green for correct option
    borderColor: '#28a745',
    fontFamily: 'CourierPrime-Regular',
  },
  incorrectOptionButton: {
    backgroundColor: '#f8d7da', // Light red for incorrect option
    borderColor: '#dc3545',
    fontFamily: 'CourierPrime-Regular',
  },
  disabledOptionButton: {
    opacity: 0.6, // Slightly transparent to show that the button is disabled
  },
  optionText: {
    fontSize: 20,
    // fontWeight: 'heavy',
    fontFamily: 'CourierPrime-Regular',
  },
});

export default Quiz;
