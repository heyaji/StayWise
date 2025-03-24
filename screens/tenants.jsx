import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';

import Footer from '../components/footer';
import AddTenant from '../components/addTenant';
import TenantDetails from '../components/tenantDetails';
import Header from '../components/header';

import { getTenants } from '../database/tenants';

export default function Tenants() {
    const [isAddTenantVisible, setIsAddTenantVisible] = useState(false);
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const result = await getTenants();
            setTenants(result);
        } catch (error) {
            console.error("Error fetching tenants:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Tenants</Text>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={() => setIsAddTenantVisible(true)}>
                    <Text style={styles.addButtonText}>➕ Add New Tenant</Text>
                </TouchableOpacity>

                {isAddTenantVisible && (
                    <AddTenant hideForm={() => setIsAddTenantVisible(false)} refreshTenants={fetchTenants} />
                )}

                {/* Tenant List */}
                <View style={styles.tenantList}>
                    {tenants.map((tenant) => (
                        <TouchableOpacity
                            key={tenant.id}
                            style={styles.tenantCard}
                            onPress={() => setSelectedTenant(tenant)}
                        >
                            <Text style={styles.tenantName}>{tenant.name}</Text>
                            <Text style={styles.infoText}>📞 {tenant.phone}</Text>
                            <Text style={styles.infoText}>🏠 Room {tenant.room_number} - Bed {tenant.bed_number}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Show Tenant Details if a tenant is selected */}
                {selectedTenant && (
                    <TenantDetails tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />
                )}
            </ScrollView>

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F1EE',
    },
    scrollContent: {
        padding: 20,
    },
    titleContainer: {
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4A90E2',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tenantList: {
        marginTop: 10,
    },
    tenantCard: {
        backgroundColor: '#E0E7FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    tenantName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
    },
});
