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

    
    const numericalCurrentSpeed = parseInt(currentSpeed, 10);
    const numericalSpeedLimit = parseInt(currentSpeedLimit, 10);
    const isSpeedLimitExceeded = numericalCurrentSpeed > numericalSpeedLimit;

    const speedLimitBorderColor = isSpeedLimitExceeded ?  '#c20000': '#8B0000';
    const speedLimitBackgroundColor = isSpeedLimitExceeded ? '#FFB6C1' : 'white';



    return (
        <View>
            <View style={styles.currentSpeedLimit}>
                <View style = {styles.currentSpeedCircle}>
                    <Text style = {styles.speedText}>{currentSpeed}</Text>
                    <Text style = {styles.measurementText}>km/h</Text>
                </View>

                <View style={[styles.speedLimitCircle, { borderColor: speedLimitBorderColor, backgroundColor: speedLimitBackgroundColor }]}>
                    <Text style={styles.speedLimitText}>{currentSpeedLimit}</Text>
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
        backgroundColor: '#A3D5FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderStyle: "solid",
        borderColor: "black",
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
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,       
        borderStyle: "solid",
        //backgroundColor: 'white',
        //borderColor: 'red',
    },
    speedLimitText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
});