import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    speed?: number | null;
    speedLimit?: string;
    speedLimitExceeded?: boolean;
};

export default function CurrentSpeed({speed, speedLimit, speedLimitExceeded}: Props) {
    const currentSpeed = speed?.toString().split(".")[0] ?? "0";
    const currentSpeedLimit = speedLimit ?? "50";
    const isSpeedLimitExceeded = speedLimitExceeded ?? false;



    return (
        <View>
            <View style={styles.currentSpeedLimit}>
                <View style = {styles.currentSpeedCircle}>
                    <Text style = {styles.speedText}>{currentSpeed}</Text>
                    <Text style = {styles.measurementText}>km/h</Text>
                </View>
                <View style = {styles.speedLimitCircle}>
                    <Text style = {styles.speedLimitText}>{currentSpeedLimit}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    currentSpeedLimit: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        zIndex: 1,
        borderColor: "red",
        borderWidth: 1,
        height: 95,
    },
    currentSpeedCircle: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderStyle: "dotted",
        paddingTop: 5,
    },
    speedText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "white",
        borderColor: 'black',
        borderWidth: 1,
    },
    measurementText: {
        fontSize: 16,
        color: 'white',
        borderColor: 'black',
        borderWidth: 1,
    },
    speedLimitCircle: {
        position: "relative",
        left: 60,
        top: -110, 
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: 'red',
        borderStyle: "solid",
    },
    speedLimitText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});