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
import { FontAwesome } from "@expo/vector-icons";
import { createUserPreferences } from "../UserPreferencesService";


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
      navigation.navigate("MainScreen", {}); // Navigate to the Map screen after successful login
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  const customSkip = async () => {
    // Custom skip logic here
    const response = await signInWithEmailAndPassword(auth, "teste@email.com", "123456");
    //const response2 = await createUserPreferences(response.user.uid);
    //navigation.navigate("Map", {}); // Navigate to the Map screen when skip is pressed
    navigation.navigate("MainScreen", {}); // Navigate to the MainScreen after skipping
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="user" size={85} color="white" />
      <Text style={{fontSize: 24, fontWeight: "bold", color:"whitesmoke", textShadowColor: 'black', textShadowOffset: { width: 1.5, height: 1.5 }, textShadowRadius: 1,}}>Login</Text>
      <View style={styles.loginContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <TextInput
            style = {styles.textInput}
            placeholder="Password"
            value = {password}
            onChangeText={(value) => setPassword(value)} secureTextEntry={passwordVisible}
          />
        </View>
        <TouchableOpacity onPress={togglePasswordVisibility}>
          {passwordVisible ? 
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="eye" size={24} color="black" />
              <Text> Show </Text>
            </View>
          : 
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="eye-slash" size={24} color="black" />
              <Text> Hide </Text>
            </View>
          }
        </TouchableOpacity>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonBack]} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity style={{position: "absolute", bottom: 100, }}>
        <Button
          title="skip"
          onPress={() => customSkip()}
          color="#5A189A" // deep purple
          />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer:{
    width: 90,
    height: 90,
  },
  loginContainer: {
    backgroundColor: "whitemoke",
    width: 300,
    height: 310,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  inputContainer:{
    height: 160,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textInput:{
    borderWidth: 2,
    borderColor: "black",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "whitesmoke",
    borderRadius: 50,
    width: "85%",
    height: 45,
  },
  buttonContainer:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "80%",
  },
  button:{
    backgroundColor: '#5A189A', // deep purple
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonBack: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});
