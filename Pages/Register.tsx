import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Importing ImagePicker from Expo
import { getdbConnection } from "@/DB";
import { registerUserType } from "@/Types/user";
import { registerUser } from "@/Services/user.service";
import CustomAlert from "@/components/CustomeAlert";

const Register = ({ navigation }: { navigation: any }) => {
  const [selectedImage, setSelectedImage] = useState<string>(""); // State to hold the selected image URI
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [mobileNumberError, setMobileNumberError] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const passwordRef = useRef<TextInput>(null);
  const mobileNumberRef = useRef<TextInput>(null);

  const emptyState = () => {
    setSelectedImage("");
    setName("");
    setPassword("");
    setMobileNumber("");
  };

  // Function to handle image selection from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri); // Set selected image URI to state
      }
    } catch (error) {
      console.error("Error picking image from gallery: ", error);
      setDesc("Failed to pick an image from gallery");
      setTitle("Error");
      setShowAlert(true); // Show custom alert on failed login
      // Alert.alert('Error', 'Failed to pick an image from gallery.');
    }
  };

  // Function to validate name field
  const validateName = (value: string) => {
    setErrorMessage("");
    if (value.trim().length < 5) {
      setNameError("Name must be at least 5 characters");
    } else {
      setNameError(null);
    }
    setName(value);
  };

  // Function to validate password field
  const validatePassword = (value: string) => {
    setErrorMessage("");
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number"
      );
    } else {
      setPasswordError(null);
    }
    setPassword(value);
  };

  // Function to validate mobile number field
  const validateMobileNumber = (value: string) => {
    setErrorMessage("");
    const mobileNumberRegex = /^[0-9]{10}$/;
    if (!mobileNumberRegex.test(value)) {
      setMobileNumberError("Mobile Number must be exactly 10 digits");
    } else {
      setMobileNumberError(null);
    }
    setMobileNumber(value);
  };

  const handleAlertClose = () => {
    setTimeout(() => {
    setShowAlert(false); // Close custom alert
    }, 1000);
  };
  // Function to handle form submission
  const handleSubmit = async () => {
    // Clear previous error messages
    setErrorMessage("");

    // Validate input fields
    if (!name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required");
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMessage("Mobile Number is required");
      return;
    }

    if (nameError || passwordError || mobileNumberError) {
      setErrorMessage("Please fix errors in the form");
      return;
    }

    try {
      const db = await getdbConnection();
      const user: registerUserType = {
        name,
        image: selectedImage,
        phone_number: mobileNumber,
        password,
      };

      const result = await registerUser(db, user);
      if (!result.stat) {
        setErrorMessage(result.message);
      } else {
        setDesc(result.message)
        setTitle('Success')
        setShowAlert(true); // Show custom alert on failed login
        // Alert.alert("Success", result.message);

        // Clear form state after successful submission
        emptyState();
        navigation.navigate('Admin')
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("An error occurred while registering the user.");
    }
  };

  // Function to handle removing the selected image
  const handleRemoveImage = () => {
    setSelectedImage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.headerText}>Register</Text>

          {/* Box container */}
          <View style={styles.box}>
            {/* Image display area */}
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.image} />
              ) : (
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Remove Image button */}
            {selectedImage ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveImage}
              >
                <Text style={styles.removeButtonText}>Remove Image</Text>
              </TouchableOpacity>
            ) : null}

            {/* Input fields */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={validateName}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}

            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={validatePassword}
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => mobileNumberRef.current?.focus()}
              blurOnSubmit={false}
            />
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}

            <TextInput
              ref={mobileNumberRef}
              style={styles.input}
              placeholder="Mobile Number"
              value={mobileNumber}
              onChangeText={validateMobileNumber}
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {mobileNumberError && (
              <Text style={styles.errorText}>{mobileNumberError}</Text>
            )}

            {/* Error message */}
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <Text style={styles.instructions}>
            Tap the button above to add an image from your gallery
          </Text>
        </View>
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
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: "CourierPrime-Bold", // Example of using a custom font
  },
  box: {
    width: "100%",
    maxWidth: 400, // Example maximum width
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3, // For Android
    marginBottom: 20,
    alignItems: "center", // Center the children horizontally
  },
  button: {
    width: "100%",
    backgroundColor: "#3b5998",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  imageContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 80, // Making the container circular
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  selectButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#293E6A",
    fontFamily: "CourierPrime-Regular", // Example of using a custom font
  },
  removeButton: {
    backgroundColor: "#B6A754",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
    fontFamily: "CourierPrime-Regular", // Example of using a custom font
  },
  removeButtonText: {
    color: "#fff",
    // fontWeight: 'bold',
    fontFamily: "CourierPrime-Bold", // Example of using a custom font
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    // fontWeight: 'bold',
    fontFamily: "CourierPrime-Bold", // Example of using a custom font
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: "CourierPrime-Regular", // Example of using a custom font
  },
  errorText: {
    color: "red",
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "CourierPrime-Regular", // Example of using a custom font
  },
  instructions: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "CourierPrime-Regular", // Example of using a custom font
  },
});

export default Register;
