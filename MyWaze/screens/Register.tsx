import React, { useState } from "react";
import {Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { FontAwesome } from "@expo/vector-icons";
import { createUserPreferences } from "../UserPreferencesService";
type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({navigation}: RegisterScreenProps) {
    // Firebase Authentication
    const auth = FIREBASE_AUTH;

    // Everything inside the function
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number state 
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state, useful for showing a loading indicator or hiding buttons so the user doesn't click multiple times. For now it just replaces the signup button with "Loading...".

    const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    };

    const handleRegister = async () => {
        // Handle sign-up logic here
        try {
            setIsLoading(true); // Set loading state to true
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const response2 = await createUserPreferences(response.user.uid);
            const response3 = await signInWithEmailAndPassword(auth, email, password);
            console.log("Sign-up successful:", response.user);
            navigation.navigate("Map", {}); // Navigate to the Login screen after successful sign-up
        } catch (error) {
            console.error("Sign-up error:", error);
        }
        finally {
            setIsLoading(false); // Set loading state back to false
        }

    }


    return(
        <View style={styles.container}>
          <FontAwesome name="user-plus" size={80} color="white"/>           
          <Text style={{fontSize: 24, fontWeight: "bold", color:"whitesmoke", textShadowColor: 'black', textShadowOffset: { width: 1.5, height: 1.5 }, textShadowRadius: 1,}}>Register</Text>
            <View style={styles.loginContainer}>
                <View style = {styles.inputContainer}>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Email"
                        value = {email}
                        onChangeText={(value) => setEmail(value)}
                    />
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Phone Number"
                        value = {phoneNumber}
                        onChangeText={(value) => setPhoneNumber(value)}
                    />
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Password"
                        value = {password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!passwordVisible}
                    />
                </View>
                <View style = {styles.buttonContainer}>
                      {isLoading ? (
                        <Text>Loading...</Text>
                      ) : (
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                          <Text style={styles.buttonText}>Sign-Up</Text>
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
                      <Text style= {{textDecorationStyle: "solid", textDecorationLine: "underline", textDecorationColor: "blue", color: "#5A189A"}}>Already Have an Account?</Text> 
                    </TouchableOpacity>
                </View>
            </View>
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
    height: 330,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  inputContainer:{
    borderWidth: 1,
    borderColor: "purple",
    height: 160,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput:{
    borderWidth: 2,
    borderColor: "black",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "whitesmoke",
    borderRadius: 50,
    width: "80%",
    height: 40,
  },
  buttonContainer:{
    display: "flex",
    flexDirection: "column",
    borderColor: "purple",
    alignItems: "center",
    borderWidth: 1,
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
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});

