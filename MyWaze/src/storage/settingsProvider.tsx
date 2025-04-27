import React, { createContext, useContext, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV(); // Storage Instance


interface Car{
    plate: String;
    type: String;
    fuel: String;
}

// Available Settings for the Settings State
interface SettingsState {
    carList: Car[];
}

// Default Settings
const defaultSettings: SettingsState = {//TODO
    carList: storage.contains('carList') ? JSON.parse(storage.getString('carList')!) : [],

};

// Settings Context
export const SettingsContext = createContext<{
    settings: SettingsState;
    updateSetting: (key: keyof SettingsState, value: any) => void;
} | null>(null);

// Settings Provider
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    // Function to update storage and state
    const updateSetting = (key: keyof SettingsState, value: any) => {
        if (key === 'carList') {
            storage.set(key, JSON.stringify(value));  // Save as JSON string
        } else {
            storage.set(key, value);
        }
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Custom Hook to use the Settings Context
// This hook is used to access the settings state and the updateSetting function
// Creating a hook like this is considered good practise because it makes the code more readable and easier to maintain
// It's either this or using importing the context and having to code this function in every component that uses the context
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if(!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};