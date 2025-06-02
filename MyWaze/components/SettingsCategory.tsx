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

import type { ComponentProps } from "react";

type FontAwesomeName = ComponentProps<typeof FontAwesome>["name"];

interface SettingsCategoryProps {
  vectorIcon: FontAwesomeName;
  title: string;
  lastChild?: boolean;
  onPress: () => void;
}

export default function SettingsCategory({ vectorIcon, title, onPress, lastChild }: SettingsCategoryProps) {
  // Firebase Authentication
  const auth = FIREBASE_AUTH;

  return (
    <TouchableOpacity
      style={[
        styles.settingsCategory,
        lastChild ? styles.lastChild : null
      ]}
      onPress={onPress}
    >
        <FontAwesome name={vectorIcon} size={40} color="#A3D5FF" style={{marginRight: 10}}/>
        <Text>{title}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  settingsCategory: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    height: 60,
    alignItems: "center",
    padding: 5,
    borderBottomColor: "grey",
    borderBottomWidth: 1
  },
  lastChild: {
    borderBottomWidth:0,
  }
});
