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
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import {
  NativeStackNavigatorProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import SettingsCategory from "../components/SettingsCategory";
import { getFirestore } from "firebase/firestore";
import { fetchUserPreferences } from "../SettingsService";

type NavigationPreferencesScreenProps = NativeStackScreenProps<RootStackParamList, "Settings">;


export default function NavigationPreferencesScreen({ navigation }: NavigationPreferencesScreenProps) {
  // Firebase Authentication
  const auth = FIREBASE_AUTH;

  return (
    <View style={styles.container}>
      <View> {/* Setting Group 1*/}
        <Text style= {styles.settingsCategoryText}>General</Text>
        <View>
          <SettingsCategory
            vectorIcon="star"
            title="Avoid Toll Roads"
            onPress={() => alert("Feature not implemented yet")}
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3D5FF',
    borderColor: "red",
    borderWidth: 2,
  },
  settingsCategoryText: {
    backgroundColor: "whitesmoke",
    height: 25,
    paddingLeft: 5,
    textAlignVertical: "center",
  }
});
