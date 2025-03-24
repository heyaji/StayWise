import { 
    Text, 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Alert, 
    Keyboard, 
    TouchableWithoutFeedback 
} from 'react-native';
import { useState, useEffect } from 'react';

import Footer from '../components/footer';
import AddRoom from '../components/addRoom';
import RoomDetails from '../components/roomDetails';
import Header from '../components/header';
import { getRooms } from '../database/room';

export default function Rooms() {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const toggleAddRoom = () => setIsAddRoomVisible(!isAddRoomVisible);

    const fetchRooms = async () => {
        try {
            const result = await getRooms();
            setRooms(result);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch rooms.");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {/* Header */}
                <Header />

                {/* Title Section */}
                <Text style={styles.title}>Rooms</Text>

                {/* Add New Room Button */}
                <TouchableOpacity style={styles.addButton} onPress={toggleAddRoom}>
                    <Text style={styles.addButtonText}>➕ Add New Room</Text>
                </TouchableOpacity>

                {/* Add Room Form */}
                {isAddRoomVisible && <AddRoom hideForm={toggleAddRoom} refreshRooms={fetchRooms} />}

                {/* Room Details Modal */}
                {selectedRoom ? (
                    <RoomDetails room={selectedRoom} onClose={() => setSelectedRoom(null)} />
                ) : (
                    <>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Room #</Text>
                            <Text style={styles.tableHeaderText}>Status</Text>
                            <Text style={styles.tableHeaderText}>Action</Text>
                        </View>

                        {/* Room List */}
                        <ScrollView contentContainerStyle={styles.roomList}>
                            {rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <View key={room.id} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{room.room_number}</Text>
                                        <Text 
                                            style={[
                                                styles.tableCell, 
                                                room.status === "Available" ? styles.availableStatus : styles.occupiedStatus
                                            ]}
                                        >
                                            {room.status}
                                        </Text>
                                        <TouchableOpacity 
                                            style={styles.viewButton} 
                                            onPress={() => setSelectedRoom(room)}
                                        >
                                            <Text style={styles.viewButtonText}>View</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noDataText}>No rooms available.</Text>
                            )}
                        </ScrollView>
                    </>
                )}

                {/* Footer */}
                <Footer />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#F7F1EE',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    // Title
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginVertical: 15, 
        color: '#333' 
    },

    // Add Room Button
    addButton: { 
        backgroundColor: '#CBD5E1', 
        padding: 12, 
        borderRadius: 20, 
        alignItems: 'center', 
        alignSelf: 'center', 
        width: '80%',
        marginBottom: 20,
        elevation: 3, // Adds shadow for depth
    },
    addButtonText: { fontWeight: 'bold', fontSize: 16, color: '#2D3748' },

    // Table Header
    tableHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: 12, 
        backgroundColor: '#CBD5E1', 
        borderRadius: 10, 
        marginBottom: 10 
    },
    tableHeaderText: { fontWeight: 'bold', flex: 1, textAlign: 'center', color: '#2D3748' },

    // Table Row
    tableRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: 12, 
        backgroundColor: '#E2E8F0', 
        borderRadius: 10, 
        marginBottom: 10,
        alignItems: 'center',
    },
    tableCell: { flex: 1, textAlign: 'center', color: '#2D3748', fontSize: 14 },

    // Room Status Styles
    availableStatus: { color: 'green', fontWeight: 'bold' },
    occupiedStatus: { color: 'red', fontWeight: 'bold' },

    // View Button
    viewButton: { backgroundColor: '#4A5568', padding: 8, borderRadius: 5, alignItems: 'center' },
    viewButtonText: { color: '#FFF', fontWeight: 'bold' },

    // Room List
    roomList: { flexGrow: 1 },

    // No Data Text
    noDataText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 20 },
});
