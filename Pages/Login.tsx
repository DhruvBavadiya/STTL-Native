import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { getdbConnection } from "@/DB";
import { loginUser } from "@/Services/user.service";
import { loginUserType } from "@/Types/user";
import { logo } from "@/constants/links";
import { StoreId } from "../Services/AsyncStorage";
import CustomAlert from "../components/CustomeAlert"; // Import CustomAlert component

const backgroundImg = require("../assets/images/bg.jpeg");

const Login = ({ navigation }: { navigation: any }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef<TextInput>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleLogin = async () => {
    let valid = true;

    if (name === "") {
      setNameError("Username is required");
      valid = false;
    } else {
      setNameError("");
    }

    if (password === "") {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) {
      return;
    }

    // Replace with your own authentication logic
    if (name === "admin" && password === "admin") {
      setTitle("Success");
      setDesc("Admin Login Successfull");
      setShowAlert(true); // Show custom alert on successful login
      navigation.navigate("Admin");
      setTimeout(() => {
        setShowAlert(false); // Show custom alert on successful login
      }, 1000);
    } else {
      const user: loginUserType = {
        name: name,
        password: password,
      };
      const id = await loginUser(await getdbConnection(), user);
      console.log("Login", id);
      if (id) {
        StoreId(id);
        navigation.navigate("User");
      } else {
        setDesc("Incorrect password or username");
        setTitle("Failed");
        setShowAlert(true); // Show custom alert on failed login
      }
    }
  };

  const handleAlertClose = () => {
    setTimeout(() => {
    setShowAlert(false); // Close custom alert
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ImageBackground source={backgroundImg} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.loginBox}>
              <Text style={styles.heading}>Login</Text>
              <View style={styles.logoContainer}>
                <Image source={{ uri: logo }} style={styles.logo} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: "CourierPrime-Regular" },
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loginBox: {
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  heading: {
    // fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: "CourierPrime-Bold",
    fontSize: 36,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: "200",
    fontFamily: "CourierPrime-Regular",
    borderColor: "#ddd",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 5,
    fontFamily: "CourierPrime-Regular",
  },
  button: {
    width: "100%",
    backgroundColor: "#293E6A",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Login;
