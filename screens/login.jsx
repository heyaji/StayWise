import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupAccountsTable, loginAccount } from "../database/account";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    setupAccountsTable();
  }, []);

  async function handleLogin() {
    try {
      const success = await loginAccount(email, password);
      if (success) {
        await AsyncStorage.setItem('loggedInUser', email);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert("Error", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/StayWise.png")} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Image source={require("../assets/usernamelogin.png")} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require("../assets/passwordlogin.png")} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef6f2",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f5d66",
    borderRadius: 25,
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#a45a2b",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
