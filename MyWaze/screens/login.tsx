import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import {
  NativeStackNavigatorProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  // Firebase Authentication
  const auth = FIREBASE_AUTH;

  // Everything inside the function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state, useful for showing a loading indicator or hiding buttons so the user doesn't click multiple times. For now it just replaces the login button with "Loading...".

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    // Handle login logic here
    try {
      setIsLoading(true); // Set loading state to true
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", response);
      navigation.navigate("Map", {}); // Navigate to the Map screen after successful login
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Login Screen</Text>
        {/*<Image source={require("./../assets/login_logo.png")} style={styles.logoIcon}/>*/}
      </View>

      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <View style={{ width: "100%" }}>
            <Text>Email</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ width: "100%" }}>
            <Text>Password</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={!passwordVisible}
          />
        </View>

        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Text>{passwordVisible ? "Show" : "Hide"}</Text>
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.buttonContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <Button title="Login" onPress={handleLogin} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    backgroundColor: "beige",
    width: 300,
    height: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    width: "80%",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderColor: "purple",
    borderWidth: 1,
    width: "60%",
  },
});
