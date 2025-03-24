import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Footer from "../components/footer";
import Header from "../components/header";

export default function Dashboard() {
  const navigation = useNavigation();

  // Dashboard Items
  const dashboardItems = [
    { name: "Dashboard", screen: "Dashboard", icon: require("../assets/dashboarddash.png") },
    { name: "Rooms", screen: "Rooms", icon: require("../assets/roomsdash.png") },
    { name: "Beds", screen: "Bed", icon: require("../assets/dashboardbed.png") },
    { name: "Tenants", screen: "Tenants", icon: require("../assets/dashboardtenant.png") },
  ];

  return (
    <View style={styles.container}>
      <Header />

      {/* Title */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        {dashboardItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6f2",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#3b3b3b",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,  // Keeps consistent spacing
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#c4cfd7",
    width: 150,
    height: 150,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    elevation: 5,  // Better shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b3b3b",
    textAlign: "center",
  },
  footerContainer: {
    marginTop: "auto",
  },
});
