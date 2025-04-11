import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard
} from 'react-native';
import axios from 'axios';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicGVkcm9wZXJhbHRhMDAiLCJhIjoiY205Y3R3bmY3MG1qMjJrc2FpYXZxdHM3YyJ9.iCuna6hnHThiecH5pGFVag';

const RouteForm = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startSuggestions, setStartSuggestions] = useState<Array<any>>([]);
  const [endSuggestions, setEndSuggestions] = useState<Array<any>>([]);
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  // Function to search for Mapbox suggestions
  const fetchSuggestions = async (query: string, setSuggestions: Function) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            language: 'pt',
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Error when looking for suggestions:', error);
    }
  };

  useEffect(() => {
    fetchSuggestions(start, setStartSuggestions);
  }, [start]);

  useEffect(() => {
    fetchSuggestions(end, setEndSuggestions);
  }, [end]);

  const handleSwap = () => {
    setStart(end);
    setEnd(start);
  };

  const handleConfirmRoute = () => {
    if (!start || !end) return alert('Fill in both fields!');
    console.log('Departure:', start);
    console.log('Destination:', end);

    // Here you would typically handle the route confirmation logic
    // For example, you might want to navigate to a map screen or fetch route data
    Keyboard.dismiss();
  };

  const renderSuggestion = (item: any, setField: Function, clearSuggestions: Function) => (
    <TouchableOpacity
      style={styles.suggestion}
      onPress={() => {
        setField(item.place_name);
        clearSuggestions([]);
        Keyboard.dismiss();
      }}
    >
      <Text>{item.place_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📍 Departure Location</Text>
      <TextInput
        style={styles.input}
        value={start}
        onChangeText={setStart}
        onFocus={() => setIsSelectingStart(true)}
        placeholder="Ex: Rua Afonso Costa"
      />
      {isSelectingStart && startSuggestions.length > 0 && (
        <FlatList
          data={startSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            renderSuggestion(item, setStart, setStartSuggestions)
          }
        />
      )}

      <Text style={styles.label}>🏁 Destination</Text>
      <TextInput
        style={styles.input}
        value={end}
        onChangeText={setEnd}
        onFocus={() => setIsSelectingStart(false)}
        placeholder="Ex: Avenida da Liberdade"
      />
      {!isSelectingStart && endSuggestions.length > 0 && (
        <FlatList
          data={endSuggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            renderSuggestion(item, setEnd, setEndSuggestions)
          }
        />
      )}
 
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonAlt} onPress={handleSwap}>
          <Text>🔄 Switch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleConfirmRoute}>
          <Text style={{ color: '#fff' }}>📍 Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RouteForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 40,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  buttonAlt: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
  },
});
