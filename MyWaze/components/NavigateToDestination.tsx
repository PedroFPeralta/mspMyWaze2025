// This is the Modal asking confirmation to travel to Destination X with X details

import React, { useEffect } from "react";
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
    onConfirm: () => void;
    via: string;
};

export default function NavigateToDestination({ destination, distance, duration, onCancel, via, visibility, onConfirm }: Props) {
    const [preferences, setPreferences] = React.useState<any>();
    const auth = FIREBASE_AUTH;
    const user_id = auth.currentUser?.uid;

    const loadUserPreferences = async () => {
        if (!user_id) return;
        try {
        const userPrefs = await fetchUserPreferences(user_id);
        setPreferences(userPrefs);
        console.log("Loaded preferences:", userPrefs);
        } catch (error) {
        console.error("Error fetching preferences:", error);
        }
    };

    // Make it so the user prefereneces are loaded when the component mounts and only fetches new information if the user_id changes
    useEffect(() => {
        loadUserPreferences();
    }, [user_id]);
    
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
                <View style = {{display: "flex", flexDirection: "row" , alignItems: "center", alignContent: "center", borderColor:"purple", borderWidth:1, marginTop: 10}}>
                    {preferences && preferences.avoid_ferries && (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, borderColor: "red",  borderWidth: 1, marginRight: 10, width: 70}}>
                            <FonteAwesome name="ship" size={20} color="black" />
                            <Text>Avoid Ferries</Text>
                        </View>
                    )}

                    {preferences && preferences.avoid_tolls && (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, borderColor: "red", borderWidth: 1,  marginRight: 10, width: 70}}>
                            <FonteAwesome name="car" size={20} color="black" />
                            <Text>Avoid Tolls</Text>
                        </View>
                    )}

                    {preferences && preferences.avoid_motorways && (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: 10, borderColor: "red", borderWidth: 1,  marginRight: 10, width: 70}}>
                            <FonteAwesome name="car" size={20} color="black" />
                            <Text>Avoid Motorways</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress= {() => onCancel()}>
                    <Text style={{ color: 'blue', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onConfirm()}>
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