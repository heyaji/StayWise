import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useCallback } from 'react';
import { addRoom } from '../database/room';

export default function AddRoom({ hideForm, refreshRooms }) {
    const [roomNumber, setRoomNumber] = useState('');
    const [status, setStatus] = useState('Available');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateRoomNumber = (number) => {
        if (!number.trim()) return "Room number is required.";
        if (!/^\d+$/.test(number)) return "Room number must be a valid number.";
        if (parseInt(number, 10) <= 0) return "Room number must be greater than 0.";
        return "";
    };

    const handleSave = useCallback(async () => {
        const validationError = validateRoomNumber(roomNumber);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setLoading(true);
        
        try {
            const result = await addRoom(parseInt(roomNumber, 10), status);
            if (result.success) {
                Alert.alert('Success', result.message);
                refreshRooms();
                hideForm();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add room. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [roomNumber, status, hideForm, refreshRooms]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Room</Text>
                <TouchableOpacity onPress={hideForm}>
                    <Image source={require('../assets/closeIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.centeredContent}>
                    <Text style={styles.label}>ROOM NUMBER:</Text>
                    <TextInput 
                        style={[styles.input, error && styles.inputError]} 
                        placeholder="Enter Room Number" 
                        keyboardType="numeric"
                        value={roomNumber}
                        onChangeText={setRoomNumber}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
                
                <View style={styles.centeredContent}>
                    <Text style={styles.label}>STATUS:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Available" value="Available" />
                            <Picker.Item label="Unavailable" value="Unavailable" />
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.addButton, (!roomNumber || error) && styles.disabledButton]} 
                    onPress={handleSave} 
                    disabled={!roomNumber || !!error || loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.addButtonText}>Add Room</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7E8E4', padding: 20, zIndex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    closeIcon: { width: 24, height: 24 },
    formContainer: { backgroundColor: '#E0DEDC', padding: 20, borderRadius: 10, alignItems: 'center' },
    centeredContent: { alignItems: 'center', width: '100%' },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 5, marginBottom: 10, color: '#333', width: '80%', textAlign: 'center' },
    inputError: { borderColor: 'red', borderWidth: 1 },
    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
    pickerContainer: { backgroundColor: '#FFF', borderRadius: 5, marginBottom: 15, width: '80%' },
    addButton: { backgroundColor: '#333', padding: 12, borderRadius: 5, alignItems: 'center', width: '80%' },
    disabledButton: { backgroundColor: '#AAA' },
    addButtonText: { color: '#FFF', fontWeight: 'bold' }
});
