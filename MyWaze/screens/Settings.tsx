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
import { fetchUserPreferences } from "../SettingsService";

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  // Firebase Authentication
  const auth = FIREBASE_AUTH;
    const user_id = auth.currentUser?.uid;
    
    function test(){
      const result = fetchUserPreferences("sdwasdwasdwasd");
      result.then((data) => {
        const d1 = data[0];
        console.log("User Preferences:", d1.avoid_motorways);
      }).catch((error) => {
        console.error("Error fetching user preferences:", error);
      });
    }

  return (
    <View style={styles.container}>
      <View> {/* Setting Group 1*/}
        <Text style= {styles.settingsCategoryText}>General</Text>
        <View>
          <SettingsCategory
            vectorIcon="gear"
            title="General"
            onPress={() => test()}
          />
        </View>
      </View>
      <View> {/* Setting Group 2*/}
        <Text style= {styles.settingsCategoryText}>Driving Preferences</Text>
        <View>
          <SettingsCategory
            vectorIcon="map"
            title="Navigation Preferences"
            onPress={() => null}
          />
          <SettingsCategory
            vectorIcon="car"
            title="Vehicle Details?"
            onPress={() => navigation.navigate("CarList")}
          />
        </View>
      </View>
      <View> {/* Setting Group 3*/}
        <Text style= {styles.settingsCategoryText}>Account</Text>
        <View>
          <SettingsCategory
            vectorIcon="user-circle"
            title="Account"
            onPress={() => null}
          />
          <SettingsCategory
            vectorIcon="info-circle"
            title="About"
            onPress={() => null}
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
