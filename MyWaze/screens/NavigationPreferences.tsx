import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Switch,
} from "react-native";
import { FIREBASE_AUTH } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import {
  NativeStackNavigatorProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import SettingsCategory from "../components/SettingsCategory";
import { getFirestore } from "firebase/firestore";
import { fetchUserPreferences, saveUserPreferences } from "../SettingsService";

type NavigationPreferencesScreenProps = NativeStackScreenProps<RootStackParamList, "NavigationPreferences">;
type Preferences = {
  avoid_tolls: boolean;
  avoid_ferries: boolean;
  avoid_motorways: boolean;
};

export default function NavigationPreferencesScreen({ navigation }: NavigationPreferencesScreenProps) {
  // Firebase Authentication
  const auth = FIREBASE_AUTH;
  const user_id = auth.currentUser?.uid;
  
  const [preferences, setPreferences] = useState<any>();

  // Fetch user preferences from Firestore
  const fetchPreferences = async () => {
    try {
      const fe = await fetchUserPreferences(user_id);
      setPreferences(fe); // Set to first element or undefined
      console.log("User Preferences:", fe);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  // Call fetchPreferences when the component mounts
  React.useEffect(() => {
    if (user_id) {
      fetchPreferences();
      console.log("useEffect(): ", preferences)
    }
  }, [user_id]);

  // Handle saving preferences when the user exits the screen
  useFocusEffect(
    useCallback(() => {
      // Fetch or update preferences when the screen is focused (including after going back)
      saveUserPreferences(user_id, preferences)
    }, [user_id, preferences])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.settingsSwitchView}>
          <FontAwesome name="umbrella" size={40} color="black" style={{marginRight: 10}}/>
          <Text>Avoid Tolls</Text>
          <Switch
            value={preferences?.avoid_tolls} // This should be linked to a state variable that reflects the user's preference
            onValueChange={(newValue) => {
              setPreferences({
                ...preferences, // copies the existing preferences
                avoid_tolls: newValue, // updates the avoid_ferries preference
              });

            }}
            style={{position: "absolute", right: 10}}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.settingsSwitchView}>
          <FontAwesome name="ship" size={40} color="black" style={{marginRight: 10}}/>
          <Text>Avoid Ferries</Text>
          <Switch
            value={preferences?.avoid_ferries} // This should be linked to a state variable that reflects the user's preference
            onValueChange={(newValue) => {
              setPreferences({
                ...preferences, // copies the existing preferences
                avoid_ferries: newValue, // updates the avoid_ferries preference
              });
              console.log("Avoid ferries:", newValue);
            }}
            style={{position: "absolute", right: 10}}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.settingsSwitchView}>
          <FontAwesome name="road" size={40} color="black" style={{marginRight: 10}}/>
          <Text>Avoid Motorways</Text>
          <Switch
            value={preferences?.avoid_motorways} // This should be linked to a state variable that reflects the user's preference
            onValueChange={(newValue) => {
              setPreferences({
                ...preferences, // copies the existing preferences
                avoid_motorways: newValue, // updates the avoid_ferries preference
              });
            }}
            style={{position: "absolute", right: 10}}
          />
        </View>
      </TouchableOpacity>
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
  },
  settingsSwitchView: {
    borderColor: "purple",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "white",
  }

});
