import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";

import Login from "./screens/login";
import Dashboard from "./screens/dashboard";
import Rooms from "./screens/rooms";
import Bed from "./screens/bed";
import Tenants from "./screens/tenants";

import { roomTable } from "./database/room";
import { bedTable } from "./database/bed";
import { tenantsTable } from "./database/tenants";
import { dropTenantsTable } from "./database/tenants";


// ✅ Reset database on app start
import { resetDatabase } from "./database/database";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
        try {
           
            await roomTable(); 
            await bedTable();
            await tenantsTable();
            console.log("Tables created successfully!");
        } catch (error) {
            console.error("Error setting up database:", error);
        }
    };

    setupDatabase();
}, []);




  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn && <Stack.Screen name="Login" component={Login} />}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Rooms" component={Rooms} />
        <Stack.Screen name="Bed" component={Bed} />
        <Stack.Screen name="Tenants" component={Tenants} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});