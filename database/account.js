import createDatabase from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

async function hashPassword(password) {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
}

async function setupAccountsTable() {
    try {
        const db = await createDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        console.log("Accounts table is ready.");
        await checkAndInsertDefaultAccount();
    } catch (error) {
        console.error("Error setting up accounts table:", error);
    }
}

async function checkAndInsertDefaultAccount() {
    try {
        const db = await createDatabase();
        const result = await db.getAllAsync("SELECT COUNT(*) as count FROM accounts");
        const count = result[0]?.count || 0;

        if (count === 0) {
            const hashedPassword = await hashPassword("12345");
            await db.runAsync(
                "INSERT INTO accounts (email, password) VALUES (?, ?)",
                ["gresare@ssct.edu.ph", hashedPassword]
            );
            console.log("Default account created.");
        }
    } catch (error) {
        console.error("Error inserting default account:", error);
    }
}

async function loginAccount(email, password) {
    try {
        const db = await createDatabase();
        const hashedPassword = await hashPassword(password);
        console.log("Input Hashed Password:", hashedPassword);

        const result = await db.getAllAsync(
            "SELECT * FROM accounts WHERE email = ?",
            [email]
        );

        if (result.length > 0) {
            console.log("Stored Password:", result[0].password);
        }

        if (result.length > 0 && result[0].password === hashedPassword) {
            await AsyncStorage.setItem('loggedInUser', email);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error logging in:", error);
        return false;
    }
}

async function checkAuth(callback) {
    try {
        const userEmail = await AsyncStorage.getItem('loggedInUser');
        callback(userEmail !== null);
    } catch (error) {
        console.error("Error checking authentication:", error);
        callback(false);
    }
}

async function logoutUser() {
    try {
        await AsyncStorage.removeItem('loggedInUser');
        console.log("User logged out.");
    } catch (error) {
        console.error("Error logging out:", error);
    }
}

async function resetDatabase() {
    try {
        const db = await createDatabase();
        await db.execAsync("DROP TABLE IF EXISTS accounts");
        console.log("Accounts table dropped.");

        await setupAccountsTable();
        console.log("Database reset and accounts table recreated.");
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}

export { setupAccountsTable, loginAccount, checkAuth, logoutUser, resetDatabase };
