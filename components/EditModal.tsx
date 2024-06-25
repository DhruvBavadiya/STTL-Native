import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usertypes } from '@/Types/user';
import { getdbConnection } from '@/DB';
import { UpdateUser } from '@/Services/user.service';
import CustomAlert from './CustomeAlert';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (user: usertypes) => void;
  user: usertypes | null;
}

const EditModal: React.FC<UserModalProps> = ({ visible, onClose, onSave, user }) => {
  if (!user) return null;

  const [selectedImage, setSelectedImage] = useState<string>(user.image || '');
  const [name, setName] = useState<string>(user.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phone_number || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const phoneNumberRef = useRef<TextInput>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery: ', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to pick an image from gallery.');
      setShowAlert(true);
    }
  };

  const validateName = (value: string) => {
    if (value.trim().length < 5) {
      setNameError('Name must be at least 5 characters');
    } else {
      setNameError(null);
    }
    setName(value);
  };

  const validatePhoneNumber = (value: string) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    if (!phoneNumberRegex.test(value)) {
      setPhoneNumberError('Phone Number must be exactly 10 digits');
    } else {
      setPhoneNumberError(null);
    }
    setPhoneNumber(value);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setAlertTitle('Error');
      setAlertMessage('Name is required');
      setShowAlert(true);
      return;
    }

    if (!phoneNumber.trim()) {
      setAlertTitle('Error');
      setAlertMessage('Phone Number is required');
      setShowAlert(true);
      return;
    }

    if (nameError || phoneNumberError) {
      setAlertTitle('Error');
      setAlertMessage('Please fix errors in the form');
      setShowAlert(true);
      return;
    }

    const editedUser: usertypes = {
      id: user.id,
      name: name,
      image: selectedImage,
      phone_number: phoneNumber,
      password: user.password, // Assuming password remains unchanged in edit
    };

    try {
      const db = await getdbConnection();
      const result = await UpdateUser(db, editedUser);

      if (!result.stat) {
        setAlertTitle('Error');
        setAlertMessage(result.message);
        setShowAlert(true);
      } else {
        setAlertTitle('Success');
        setAlertMessage(result.message);
        setShowAlert(true);
        onSave(editedUser);
        onClose();
      }
    } catch (error) {
      console.error('Error while updating user:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to update user. Please try again.');
      setShowAlert(true);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.headerText}>Edit User</Text>

            <View style={styles.box}>
              <View style={styles.imageContainer}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                ) : (
                  <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>Select Image</Text>
                  </TouchableOpacity>
                )}
              </View>

              {selectedImage ? (
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
                  <Text style={styles.removeButtonText}>Remove Image</Text>
                </TouchableOpacity>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={validateName}
                returnKeyType="next"
                onSubmitEditing={() => phoneNumberRef.current?.focus()}
                blurOnSubmit={false}
              />
              {nameError && <Text style={styles.errorText}>{nameError}</Text>}

              <TextInput
                ref={phoneNumberRef}
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={validatePhoneNumber}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              {phoneNumberError && <Text style={styles.errorText}>{phoneNumberError}</Text>}

              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={showAlert}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'CourierPrime-Bold',
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#293E6A',
  },
  removeButton: {
    backgroundColor: '#B6A754',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  removeButtonText: {
    color: '#fff',
    fontFamily: 'CourierPrime-Bold',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'CourierPrime-Bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: 'CourierPrime-Regular',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'CourierPrime-Regular',
  },
});

export default EditModal;
