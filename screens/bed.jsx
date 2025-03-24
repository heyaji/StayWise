import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";

import Footer from "../components/footer";
import AddBed from "../components/addBed";
import BedDetails from "../components/bedDetails";
import Header from "../components/header";
import { getBeds } from "../database/bed";

export default function BedManagement() {
    const [isAddBedVisible, setIsAddBedVisible] = useState(false);
    const [beds, setBeds] = useState([]);
    const [selectedBed, setSelectedBed] = useState(null);

    const toggleAddBed = () => {
        setIsAddBedVisible(!isAddBedVisible);
    };

    const fetchBeds = async () => {
        try {
            const result = await getBeds();
            setBeds(result);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch beds. Please try again.");
            console.error("Error fetching beds:", error);
        }
    };

    useEffect(() => {
        fetchBeds();
    }, []);

    return (
        <View style={styles.container}>
            <Header />

            {/* Title */}
            <Text style={styles.title}>Bed Management</Text>

            {/* Add New Bed Button */}
            <TouchableOpacity style={styles.addButton} onPress={toggleAddBed}>
                <Text style={styles.addButtonText}>+ Add New Bed</Text>
            </TouchableOpacity>

            {/* Add Bed Form */}
            {isAddBedVisible && <AddBed hideForm={toggleAddBed} refreshBeds={fetchBeds} />}

            {/* Beds Table */}
            <ScrollView style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableText, styles.headerText]}>Bed #</Text>
                    <Text style={[styles.tableText, styles.headerText]}>Status</Text>
                    <Text style={[styles.tableText, styles.headerText]}>Room #</Text>
                    <Text style={[styles.tableText, styles.headerText]}>Action</Text>
                </View>

                {beds.length > 0 ? (
                    beds.map((bed) => (
                        <View key={bed.id} style={styles.tableRow}>
                            <Text style={styles.tableText}>{bed.bed_number}</Text>
                            <Text
                                style={[
                                    styles.tableText,
                                    bed.bed_status === "Available" ? styles.available : styles.maintenance,
                                ]}
                            >
                                {bed.bed_status}
                            </Text>
                            <Text style={styles.tableText}>{bed.room_number}</Text>
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => setSelectedBed(bed)}
                            >
                                <Text style={styles.viewButtonText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No beds available</Text>
                )}
            </ScrollView>

            {/* Bed Details Modal */}
            {selectedBed && <BedDetails bed={selectedBed} closeDetails={() => setSelectedBed(null)} />}

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F1EE",
        paddingHorizontal: 15,
        paddingBottom: 10,
    },

    // Title Section
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginVertical: 15,
        textAlign: "center",
        color: "#333",
    },

    // Add Button
    addButton: {
        backgroundColor: "#4CAF50",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    addButtonText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#fff",
    },

    // Table Container
    tableContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        minHeight: 200,
    },

    // Table Header
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#E0E0E0",
        paddingVertical: 10,
        borderRadius: 5,
    },
    headerText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
        flex: 1,
    },

    // Table Row
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: "#F5F5F5",
    },
    tableText: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
    },

    // Status Colors
    available: {
        color: "green",
        fontWeight: "bold",
        fontSize: 14,
    },
    maintenance: {
        color: "red",
        fontWeight: "bold",
        fontSize: 14,
    },

    // View Button
    viewButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    viewButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 14,
    },

    // No Data Text
    noDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginVertical: 15,
    },
});
