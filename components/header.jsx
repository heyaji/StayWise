import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableOpacity, 
    Animated, 
    Easing 
} from 'react-native';
import { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../database/account';

export default function Header() {
    const navigation = useNavigation();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const menuAnimation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        if (isMenuVisible) {
            Animated.timing(menuAnimation, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => setIsMenuVisible(false));
        } else {
            setIsMenuVisible(true);
            Animated.timing(menuAnimation, {
                toValue: 1,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            await AsyncStorage.removeItem('loggedInUser');
            navigation.replace('Login'); 
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={styles.header}>
            {/* Logo */}
            <Image source={require("../assets/StayWise.png")} style={styles.logo} />

            {/* Menu Button */}
            <TouchableOpacity onPress={toggleMenu} style={styles.burgerContainer}>
                <Image source={require("../assets/taskbar.png")} style={styles.burgerButton} />
            </TouchableOpacity>

            {/* Animated Dropdown Menu */}
            {isMenuVisible && (
                <Animated.View 
                    style={[
                        styles.menuContainer,
                        { transform: [{ translateY: menuAnimation.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }] }
                    ]}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
                        <Image source={require("../assets/logoutbutton.png")} style={styles.menuButtonImage} />
                        <Text style={styles.menuButtonText}>Logout</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90, // Slightly taller for better spacing
        width: "100%",
        backgroundColor: "#BFC8CF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
    burgerContainer: {
        padding: 5,
    },
    burgerButton: {
        width: 28,
        height: 28,
    },
    menuContainer: {
        position: "absolute",
        top: 90,
        right: 15,
        width: 180,
        backgroundColor: "#005d67",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        opacity: 0.95,
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
    },
    menuButtonImage: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    menuButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
