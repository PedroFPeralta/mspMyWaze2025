import React, { useState } from "react";
import {Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({navigation}: RegisterScreenProps) {
    // Firebase Authentication
    const auth = FIREBASE_AUTH;

    // Everything inside the function
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            console.log("Sign-up successful:", response.user);
            navigation.navigate("Login"); // Navigate to the Login screen after successful sign-up
        } catch (error) {
            console.error("Sign-up error:", error);
        }
        finally {
            setIsLoading(false); // Set loading state back to false
        }

    }


    return(
        <View style={styles.container}>
            <View style={styles.imageContainer}>

            </View>
            <Text style={{fontSize: 24, fontWeight: "bold"}}>Register</Text>


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
                        placeholder="Password"
                        value = {password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!passwordVisible}
                    />
                </View>

                <View style = {styles.buttonContainer}>
                    <View style = {styles.button}>
                      {isLoading ? (
                        <Text>Loading...</Text>
                      ) : (
                        <Button title="Sign-Up" onPress={handleRegister} />
                      )}
                    </View>
                    <TouchableOpacity  onPress={() => navigation.navigate("Login")}>
                      <Text style= {{textDecorationStyle: "solid", textDecorationLine: "underline", textDecorationColor: "blue"}}>Already Have an Account?</Text> 
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer:{
    width: 90,
    height: 90,
    backgroundColor: "blue",
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
    height: 100,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput:{
    borderWidth: 1,
    borderColor: "blue",
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    backgroundColor: "blue",
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
    width: "50%",
    marginBottom: 5,
  },

});

