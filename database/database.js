import * as SQLite from 'expo-sqlite';

async function createDatabase() {
    return await SQLite.openDatabaseAsync('staywise.db');
}

async function resetDatabase() {
    try {
        const db = await createDatabase();
        await db.execAsync("DROP TABLE IF EXISTS accounts");
        await db.execAsync("DROP TABLE IF EXISTS room");
        await db.execAsync("DROP TABLE IF EXISTS bed");
        await db.execAsync("DROP TABLE IF EXISTS tenants");
        console.log("Database reset and tables dropped.");
    } catch (error) {
        console.error("Error resetting database:", error);
    }
}

export default createDatabase;
export { resetDatabase };