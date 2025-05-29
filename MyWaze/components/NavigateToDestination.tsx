// This is the Modal asking confirmation to travel to Destination X with X details

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FonteAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../firebase";
import { fetchUserPreferences } from "../UserPreferencesService";

type Props = {
    destination: string;
    distance: number;
    duration: string;
    visibility: boolean;
    onCancel: () => void;
    via: string;
};

export default function NavigateToDestination({ destination, distance, duration, onCancel, via, visibility }: Props) {
    const [preferences, setPreferences] = React.useState<any>();
    const auth = FIREBASE_AUTH;
    const user_id = auth.currentUser?.uid;

    // Fetch user preferences from Firestore
    const fetchPreferences = async () => {
          try {
            const fe = await fetchUserPreferences(user_id);
            setPreferences(fe); // Set to first element or undefined
    
          } catch (error) {
            console.error("Error fetching user preferences:", error);
          }
        };

    
    return (
        <View style={[styles.container, { display: visibility ? 'flex' : 'none' }]}>
            <View style= {styles.routeDetails}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Drive to {destination}?</Text>
                </View>
                <View style= {{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>{duration}</Text>
                    <Text>{distance.toFixed(2)} Kms</Text>
                </View>
                
                <Text>Via: {via}</Text>
                <View style = {{display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: 10}}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, borderColor: "red", borderWidth: 1, width: 50}}>
                        <FonteAwesome name="car" size={20} color="black" />
                        <Text>Avoid Ferries</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, borderColor: "red", borderWidth: 1, width: 50}}>
                        <FonteAwesome name="car" size={20} color="black" />
                        <Text>Avoid Tolls</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, borderColor: "red", borderWidth: 1, width: 50}}>
                        <FonteAwesome name="car" size={20} color="black" />
                        <Text>Avoid Motorways</Text>
                    </View>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress= {() => onCancel()}>
                    <Text style={{ color: 'blue', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: 'blue', fontSize: 16 }}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: "center",
        top: 300,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    routeDetails: {
        marginBottom: 10,
        borderColor: "red",
        borderWidth: 1,
        padding: 10,
    },
    routeTop:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        borderColor: "red",
        borderWidth: 1,
    },
    buttonsContainer: {
        borderColor: "red",
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

});