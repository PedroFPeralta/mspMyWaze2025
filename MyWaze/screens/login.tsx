import React, { useState } from "react";
import {Text, View, TextInput, Image, TouchableOpacity, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";

export default function LoginScreen(){
    // Firebase Authentication
    const auth = FIREBASE_AUTH;

    // Everything inside the function
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async () => {
        // Handle login logic here
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful:", response);
        } catch (error) {
            console.error("Login error:", error);
        }
    
    }

    const handleSignUp = async () => {
        // Handle sign-up logic here
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Sign-up successful:", response.user);
        } catch (error) {
            console.error("Sign-up error:", error);
        }
    }


    return(
        <View style={styles.container}>
            <View>
                <Text>Login Screen</Text>
                {/*<Image source={require("./../assets/login_logo.png")} style={styles.logoIcon}/>*/}
            </View>

            <View style={styles.loginContainer}>
                <View style = {styles.inputContainer}>
                    <View style={{width: "100%"}}>
                        <Text>Email</Text>
                    </View>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Email"
                        value = {email}
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>

                <View style = {styles.inputContainer}>
                    <View style={{width: "100%"}}>
                        <Text>Password</Text>
                    </View>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Password"
                        value = {password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!passwordVisible}
                    />
                </View>

                <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Text>{passwordVisible ? "Show" : "Hide"}</Text>
                </TouchableOpacity>

                <View style = {styles.buttonContainer}>
                    <Button title="Back" onPress={() => console.log("breh")}/>
                    <Button title="Login" onPress={handleLogin} />

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  inputContainer:{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
  },
  textInput:{
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    width: "80%"
  },
  buttonContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderColor: "purple",
    borderWidth: 1,
    width: "60%"
  }

});

