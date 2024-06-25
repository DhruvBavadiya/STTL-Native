  import { getdbConnection } from '@/DB';
  import { addQuestion } from '@/Services/question.service';
  import CustomAlert from '@/components/CustomeAlert';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
  import React, { useState, useRef } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
  } from 'react-native';


  

  const AddQuestion = ({ navigation }: { navigation: any }) => {

    let [fontsLoaded] = useFonts({
      'CourierPrime-Regular':require('../assets/fonts/CourierPrime-Regular.ttf')
    })
    const initialFormData = {
      questionText: '',
      options: ['', '', '', ''], // Initial state for 4 options
      correctAnswerIndex: -1, // -1 indicates no answer selected initially
    };

    const [showAlert, setShowAlert] = useState(false);
    const [title , setTitle] = useState('');
    const [desc , setDesc] = useState('');
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
      questionTextError: '',
      optionsError: ['', '', '', ''], // Error messages for each option
      correctAnswerError: '', // Error message for correct answer selection
    });

    const handleAlertClose = () => {
      setShowAlert(false); // Close custom alert
    };

    const optionRefs = useRef<TextInput[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleOptionChange = (index: number) => {
      setFormData({
        ...formData,
        correctAnswerIndex: index,
      });

      // Clear correct answer error when option is selected
      setErrors(prevErrors => ({
        ...prevErrors,
        correctAnswerError: '',
      }));
    };

    const validateQuestion = (text: string) => {
      // Validate question text length
      if (text.trim().length < 8) {
        setErrors(prevErrors => ({
          ...prevErrors,
          questionTextError: 'Question must be at least 8 characters',
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          questionTextError: '',
        }));
      }

      // Update formData with the new question text
      setFormData(prevFormData => ({
        ...prevFormData,
        questionText: text,
      }));
    };

    const validateOptionText = (text: string, index: number) => {
      // Validate option text
      let newOptions = [...formData.options];
      newOptions[index] = text;
      setFormData({ ...formData, options: newOptions });

      // Validate the option on change
      if (text.trim().length === 0) {
        setErrors(prevErrors => ({
          ...prevErrors,
          optionsError: [
            ...prevErrors.optionsError.slice(0, index),
            'Option cannot be empty',
            ...prevErrors.optionsError.slice(index + 1),
          ],
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          optionsError: [
            ...prevErrors.optionsError.slice(0, index),
            '',
            ...prevErrors.optionsError.slice(index + 1),
          ],
        }));
      }
    };

    const validateQuestionText = () => {
      // Validate question text length
      if (formData.questionText.trim().length < 8) {
        setErrors(prevErrors => ({
          ...prevErrors,
          questionTextError: 'Question must be at least 8 characters',
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          questionTextError: '',
        }));
      }

      // Validate correct answer selection
      if (formData.correctAnswerIndex === -1) {
        setErrors(prevErrors => ({
          ...prevErrors,
          correctAnswerError: 'Please select a correct answer',
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          correctAnswerError: '',
        }));
      }
    };

    const focusNextField = (index: number) => {
      if (optionRefs.current && optionRefs.current[index + 1]) {
        optionRefs.current[index + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    };

    const handleSubmit = async () => {
      // Validate question text length
      if (formData.questionText.trim().length < 8) {
        setErrors(prevErrors => ({
          ...prevErrors,
          questionTextError: 'Question must be at least 8 characters',
        }));
        return;
      }
    
      validateQuestionText();
    
      // Trim spaces from options to ensure consistency
      const trimmedOptions = formData.options.map(option => option.trim());
    
      // Check for duplicates in trimmed options
      const optionsSet = new Set(trimmedOptions);
      if (optionsSet.size !== trimmedOptions.length) {
        setShowAlert(true);
        setTitle('Duplicate Options');
        setDesc('Options must be unique');
        return;
      }
    
      // Validate options to check if any are empty
      const newOptionErrors = formData.options.map((option, index) =>
        option.trim() === '' ? 'Option cannot be empty' : ''
      );
      setErrors(prevErrors => ({
        ...prevErrors,
        optionsError: newOptionErrors,
      }));
    
      if (newOptionErrors.some(error => error !== '')) {
        return; // Exit if there are errors
      }
    
      // Check if correct answer is selected
      if (formData.correctAnswerIndex === -1) {
        setErrors(prevErrors => ({
          ...prevErrors,
          correctAnswerError: 'Please select a correct answer',
        }));
        return; // Exit if correct answer is not selected
      }
    
      // All validations passed, proceed to add question
      const db = await getdbConnection();
      await addQuestion(db, formData);
      console.log('Question Added Successfully');
    
      // Reset form and show success message
      setFormData(initialFormData);
      setShowAlert(true);
      setTitle('Success');
      setDesc('Question Added Successfully');
      setTimeout(() => {
        setShowAlert(false)
        navigation.navigate('Admin');
      }, 1000);
    };
    

    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };

    if (!fontsLoaded) {
      return <AppLoading />;
    }
  

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#f0f0f0' }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerText}>Add Question</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.questioninput,
                errors.questionTextError ? styles.errorInput : null,
              ]}
              placeholder="Enter question text"
              value={formData.questionText}
              onChangeText={text => validateQuestion(text)}
              returnKeyType="next"
              onSubmitEditing={() => {
                scrollToBottom();
                optionRefs.current[0].focus();
              }}
            />
            {errors.questionTextError ? (
              <Text style={styles.errorText}>{errors.questionTextError}</Text>
            ) : null}
          </View>
          <View style={styles.optionsContainer}>
            {formData.options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    formData.correctAnswerIndex === index &&
                      styles.selectedOptionButton,
                  ]}
                  onPress={() => handleOptionChange(index)}
                >
                  <Text style={styles.optionText}>{`Option ${index + 1}`}</Text>
                </TouchableOpacity>
                <TextInput
                  ref={ref => (optionRefs.current[index] = ref!)}
                  style={[
                    styles.optioninput,
                    errors.optionsError[index] ? styles.errorInput : null,
                  ]}
                  placeholder={`Enter option ${index + 1}`}
                  value={formData.options[index]}
                  onChangeText={text => validateOptionText(text, index)}
                  returnKeyType={index === formData.options.length - 1 ? 'done' : 'next'}
                  onSubmitEditing={() => {
                    if (index === formData.options.length - 1) {
                      Keyboard.dismiss();
                      scrollToBottom();
                    } else {
                      focusNextField(index);
                    }
                  }}
                />
                {errors.optionsError[index] ? (
                  <Text style={styles.errorText}>{errors.optionsError[index]}</Text>
                ) : null}
              </View>
            ))}
          </View>
          {errors.correctAnswerError ? (
            <Text style={styles.errorText}>{errors.correctAnswerError}</Text>
          ) : null}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {/* This empty view is to ensure that the ScrollView scrolls to the end properly */}
          <View style={{ height: 60 }} />
        </ScrollView>
        <CustomAlert
          visible={showAlert}
          title={title}
          message={desc}
          onClose={handleAlertClose}
        />
      </KeyboardAvoidingView>

    );
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    headerText: {
      fontSize: 28,
      // fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
      fontFamily: 'CourierPrime-Bold', // Example of using a custom font

    },
    inputContainer: {
      marginBottom: 20,
    },
    questioninput: {
      width: '100%',
      height: 80,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: '#fff',
      marginBottom: 20,
      // fontWeight: 'bold',
      fontFamily: 'CourierPrime-Bold', // Example of using a custom font
    },
    optioninput: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: '#fff',
      marginBottom: 20,
      fontFamily: 'CourierPrime-Regular', // Example of using a custom font
    },
    optionsContainer: {
      marginTop: 10,
    },
    optionContainer: {
      marginBottom: 10,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      backgroundColor: '#f9f9f9',
      marginBottom: 10,
    },
    selectedOptionButton: {
      backgroundColor: '#d9edff', // Light blue for selected option
      borderColor: '#6dbdff',
    },
    optionText: {
      fontSize: 16,
      fontWeight: '500',
      color: 'black',
      fontFamily: 'CourierPrime-Regular', // Example of using a custom font

    },
    errorInput: {
      borderColor: '#f00',
    },
    errorText: {
      color: '#f00',
      fontSize: 14,
      marginBottom: 10,
      marginLeft: 10,
    },
    submitButton: {
      backgroundColor: '#007bff', // Blue color for submit button
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export default AddQuestion;
