import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function SearchBar() {
    return (
        <View style={styles.searchBar}>
        <FontAwesome style={styles.searchIcon} name="search" size={22} color="black" />
        <TextInput
            placeholder='Search for a location...'
            style={styles.searchInput}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        width: 300,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        zIndex: 2,
        height: 50,
        padding: 10,
        borderRadius: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#red',
        flex: 1, 
        height: 50, 
        marginLeft: 10,
        textAlign: 'left',
        fontSize: 16,
    },
    searchIcon: {
        
    },
});