import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

import { addTenant } from '../database/tenants';
import { getRooms } from '../database/room';
import { getBeds } from '../database/bed';

export default function AddTenant({ hideForm, refreshTenants }) {
    const [tenantName, setTenantName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [bedNumber, setBedNumber] = useState('');

    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch rooms on mount
    useEffect(() => {
        (async () => {
            const roomList = await getRooms();
            setRooms(roomList);
        })();
    }, []);

    // Fetch beds when room selection changes
    useEffect(() => {
        if (!roomNumber) {
            setBeds([]);
            setBedNumber('');
            return;
        }
    
        const fetchBeds = async () => {
            try {
                const allBeds = await getBeds();
                console.log("Fetched Beds:", allBeds); // Debugging
    
                // Convert both to strings for comparison
                const availableBeds = allBeds.filter(
                    (bed) => String(bed.room_number) === String(roomNumber) && bed.bed_status.toLowerCase() === "available"
                );
    
                console.log("Filtered Beds for Room", roomNumber, ":", availableBeds); // Debugging
                setBeds(availableBeds);
                setBedNumber(''); // Reset bed selection when room changes
            } catch (error) {
                console.error("Error fetching beds:", error);
            }
        };
    
        fetchBeds();
    }, [roomNumber]);
    

    // Validate input fields
    const validateForm = () => {
        let newErrors = {};

        if (!tenantName.trim()) newErrors.tenantName = "Name is required.";
        if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
        else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = "Invalid phone number.";

        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";

        if (!address.trim()) newErrors.address = "Address is required.";
        if (!roomNumber) newErrors.roomNumber = "Please select a room.";
        if (!bedNumber) newErrors.bedNumber = "Please select a bed.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle saving the tenant
    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await addTenant(tenantName, phoneNumber, email, address, roomNumber, bedNumber);
            if (result.success) {
                Alert.alert("Success", "Tenant added successfully");
                refreshTenants();
                hideForm();
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add tenant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add Tenant</Text>
                <TouchableOpacity onPress={hideForm}>
                    <Image source={require('../assets/closeIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <InputField label="Tenant Name" value={tenantName} onChangeText={setTenantName} error={errors.tenantName} />
                <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" error={errors.phoneNumber} />
                <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
                <InputField label="Address" value={address} onChangeText={setAddress} error={errors.address} />

                {/* Room Selection */}
                <Dropdown 
                    label="Room Number" 
                    selectedValue={roomNumber} 
                    onValueChange={(value) => {
                        setRoomNumber(value);
                        setBedNumber(''); // Reset bed selection
                    }} 
                    options={rooms.map(room => ({ label: `Room ${room.room_number}`, value: room.room_number }))}
                    error={errors.roomNumber}
                />

                {/* Bed Selection */}
                <Dropdown 
                    label="Bed Number" 
                    selectedValue={bedNumber} 
                    onValueChange={setBedNumber} 
                    options={beds.map(bed => ({ label: `Bed ${bed.bed_number}`, value: bed.bed_number }))}
                    disabled={beds.length === 0}
                    error={errors.bedNumber}
                />

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={hideForm}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.disabledButton]} 
                        onPress={handleSave} 
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>SAVE</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

/* Reusable Components */
const InputField = ({ label, value, onChangeText, keyboardType, error }) => (
    <>
        <Text style={styles.label}>{label}:</Text>
        <TextInput 
            style={[styles.input, error && styles.inputError]} 
            placeholder={`Enter ${label}`} 
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

const Dropdown = ({ label, selectedValue, onValueChange, options, disabled, error }) => (
    <>
        <Text style={styles.label}>{label}:</Text>
        <Picker
            selectedValue={selectedValue}
            style={[styles.input, disabled && styles.disabledInput]}
            onValueChange={onValueChange}
            enabled={!disabled}
        >
            <Picker.Item label={`Select ${label}`} value="" />
            {options.map(option => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
        </Picker>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </>
);

/* Styles */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7E8E4', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    closeIcon: { width: 24, height: 24 },
    formContainer: { backgroundColor: '#E0DEDC', padding: 20, borderRadius: 10 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5 },
    input: { backgroundColor: '#FFF', padding: 10, borderRadius: 5, marginBottom: 10, color: '#333' },
    inputError: { borderColor: 'red', borderWidth: 1 },
    disabledInput: { backgroundColor: '#DDD' },
    errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    cancelButton: { backgroundColor: '#C4A484', padding: 10, borderRadius: 5, flex: 1, marginRight: 10 },
    saveButton: { backgroundColor: '#5A5A5A', padding: 10, borderRadius: 5, flex: 1 },
    disabledButton: { backgroundColor: '#999' },
    buttonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' }
});
