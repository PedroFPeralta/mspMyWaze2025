import React, { useState } from "react";
import {Text, View, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";

const [email, setEmail] = useState("")
const [password, setPassword] = useState("");
const [passwordVisible, setPasswordVisible] = useState(false);

const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};


export default function Login(){
    return(
        <View style={styles.container}>
            <View>
                <Text>Login Screen</Text>
                {/*<Image source={require("./../assets/login_logo.png")} style={styles.logoIcon}/>*/}
            </View>

            <View>
                <View style = {styles.inputContainer}>
                    <Text>Email</Text>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Email"
                        value = {email}
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>

                <View style = {styles.inputContainer}>
                    <Text>Password</Text>
                    <TextInput
                        style = {styles.textInput}
                        placeholder="Password"
                        value = {password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Text>{passwordVisible ? "Show" : "Hide"}</Text>
                    </TouchableOpacity>
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
  inputContainer: {

  },
  textInput:{
    
  }
});

