import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { addBed } from '../database/bed';
import { getRooms } from '../database/room';
import RNPickerSelect from 'react-native-picker-select';

export default function AddBed({ hideForm, refreshBeds }) {
    const [bed_number, setBedNumber] = useState('');
    const [bed_status, setBedStatus] = useState('Available');
    const [room_number, setRoomNumber] = useState('');
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomList = await getRooms();
            setRooms(roomList);
        };
        fetchRooms();
    }, []);

    const handleSave = async () => {

        const result = await addBed(parseInt(bed_number, 10), bed_status, room_number);

        if (result.success) {
            Alert.alert("Success", "Bed added successfully");
            hideForm();
            refreshBeds();
        } else {
            Alert.alert("Error", result.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add New Bed</Text>
                <TouchableOpacity onPress={hideForm}>
                    <Image source={require('../assets/closeIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>BED NUMBER:</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter Bed Number" 
                    keyboardType="numeric"
                    value={bed_number}
                    onChangeText={setBedNumber}
                />

                <Text style={styles.label}>BED STATUS:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setBedStatus(value)}
                    items={[
                        { label: "Available", value: "Available" },
                        { label: "Unavailable", value: "Unavailable" }
                    ]}
                    placeholder={{ label: "Select bed status...", value: null }}
                    style={pickerSelectStyles}
                />

                <Text style={styles.label}>ROOM NUMBER:</Text>
                <RNPickerSelect
                    onValueChange={(value) => setRoomNumber(value)}
                    items={rooms.map((room) => ({
                        label: `Room ${room.room_number}`,
                        value: room.room_number,
                    }))}
                    placeholder={{ label: "Select a room...", value: "" }}
                    style={pickerSelectStyles}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                    <Text style={styles.addButtonText}>Add Bed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7E8E4', padding: 20, zIndex: 1, position: 'absolute', top: 20, left: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    closeIcon: { width: 24, height: 24 },
    formContainer: { backgroundColor: '#E0DEDC', padding: 20, borderRadius: 10 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 5, marginBottom: 15, color: '#333' },
    addButton: { backgroundColor: '#333', padding: 10, borderRadius: 5, alignItems: 'center' },
    addButtonText: { color: '#FFF', fontWeight: 'bold' }
});

const pickerSelectStyles = {
    inputIOS: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        color: '#333'
    },
    inputAndroid: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        color: '#333'
    }
};
