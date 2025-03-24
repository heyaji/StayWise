import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Footer() {
    const navigation = useNavigation();
    
    return (
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
                <Image source={require('../assets/dashboard.png')} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Rooms")}>
                <Image source={require('../assets/roomicon.png')} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Bed")}>
                <Image source={require('../assets/bedicon.png')} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Tenants")}>
                <Image source={require('../assets/tenanticon.png')} style={styles.footerIcon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#CBD5E1' },
    footerIcon: { width: 30, height: 30, resizeMode: 'contain' },
});