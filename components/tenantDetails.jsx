import { 
    Text, 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    Modal 
} from 'react-native';

export default function TenantDetails({ tenant, onClose }) {
    if (!tenant) return null; // Return nothing if no tenant is selected

    return (
        <Modal transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Tenant Details</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✖</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tenant Information */}
                    <View style={styles.detailContainer}>
                        <DetailItem label="👤 Name:" value={tenant.name} />
                        <DetailItem label="📞 Phone:" value={tenant.phone} />
                        <DetailItem label="✉️ Email:" value={tenant.email} />
                        <DetailItem 
                            label="🏠 Room:" 
                            value={`Room ${tenant.room_number}, Bed ${tenant.bed_number}`} 
                        />
                        <DetailItem label="📍 Address:" value={tenant.address} />
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButtonFull} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// Reusable Detail Item Component
const DetailItem = ({ label, value }) => (
    <View style={styles.detailItem}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#E57373',
    },
    closeText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold',
    },
    detailContainer: {
        marginBottom: 20,
    },
    detailItem: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    closeButtonFull: {
        backgroundColor: '#4A90E2',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
