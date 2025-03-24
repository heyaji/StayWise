import { 
    Text, 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    Alert 
} from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { updateBed, deleteBed } from '../database/bed';

export default function BedDetails({ bed, closeDetails, refreshBeds }) {
    const [editMode, setEditMode] = useState(false);
    const [bedStatus, setBedStatus] = useState(bed.bed_status);

    // Handle Save (Update)
    const handleSave = async () => {
        if (!bedStatus.trim()) {
            Alert.alert("Validation Error", "Bed Status cannot be empty");
            return;
        }

        const result = await updateBed(bed.id, bed.bed_number, bedStatus, bed.room_number);
        if (result.success) {
            Alert.alert("Success", "Bed status updated successfully");
            setEditMode(false);
            refreshBeds();
        } else {
            Alert.alert("Error", "Failed to update bed status");
        }
    };

    // Handle Delete
    const handleDelete = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this bed?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        const result = await deleteBed(bed.id);
                        if (result.success) {
                            Alert.alert("Deleted", "Bed has been removed");
                            closeDetails();
                            refreshBeds();
                        } else {
                            Alert.alert("Error", "Failed to delete bed");
                        }
                    }
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bed Details</Text>

            <View style={styles.detailRow}>
                <Text style={styles.label}>🛏 Bed Number:</Text>
                <Text style={styles.value}>{bed.bed_number}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.label}>🏠 Room Number:</Text>
                <Text style={styles.value}>{bed.room_number}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.label}>📌 Status:</Text>
                {editMode ? (
                    <Picker
                        selectedValue={bedStatus}
                        onValueChange={(itemValue) => setBedStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Available" value="Available" />
                        <Picker.Item label="Occupied" value="Occupied" />
                        <Picker.Item label="Under Maintenance" value="Under Maintenance" />
                    </Picker>
                ) : (
                    <Text 
                        style={[
                            styles.value, 
                            bedStatus === "Available" ? styles.available : 
                            bedStatus === "Occupied" ? styles.occupied : styles.maintenance
                        ]}
                    >
                        {bedStatus}
                    </Text>
                )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                {editMode ? (
                    <>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={closeDetails}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        padding: 20, 
        backgroundColor: '#FFF', 
        borderRadius: 10, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 5, 
        margin: 20 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
        color: '#333' 
    },
    detailRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 10, 
        alignItems: 'center' 
    },
    label: { 
        fontWeight: 'bold', 
        fontSize: 16, 
        color: '#555' 
    },
    value: { 
        fontSize: 16, 
        color: '#333' 
    },
    available: { color: 'green' },
    occupied: { color: 'red' },
    maintenance: { color: 'orange' },
    
    picker: { 
        flex: 1, 
        height: 40, 
        backgroundColor: '#F5F5F5', 
        borderRadius: 5 
    },

    buttonContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 15 
    },
    editButton: { 
        backgroundColor: '#4A90E2', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    saveButton: { 
        backgroundColor: 'green', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    cancelButton: { 
        backgroundColor: 'gray', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    deleteButton: { 
        backgroundColor: 'red', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    closeButton: { 
        backgroundColor: '#333', 
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    buttonText: { 
        color: '#FFF', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
});
