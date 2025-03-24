import createDatabase from './database';

async function roomTable() {
    try {
        const db = await createDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS room (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_number INTEGER NOT NULL,
                status TEXT NOT NULL
            );
        `);
        console.log("Rooms table is ready.");
    } catch (error) {
        console.error("Error creating rooms table:", error);
    }

}

async function addRoom(room_number, status) {
    try {
        const db = await createDatabase();
        await db.runAsync(
            'INSERT INTO room (room_number, status) VALUES (?, ?)',
            [room_number, status]
        );
        return { success: true, message: 'Room added successfully' };
    } catch (error) {
        return { success: false, message: 'Error adding room' };
    }
}

async function getRooms() {
    try {
        const db = await createDatabase();
        const result = await db.getAllAsync('SELECT * FROM room');
        return result;
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}

async function updateRoom(id, room_number, status) {
    try {
        const db = await createDatabase();
        await db.runAsync(
            'UPDATE room SET room_number = ?, status = ? WHERE id = ?',
            [room_number, status, id]
        );
        return true;
    } catch (error) {
        console.error('Error updating room:', error);
        return false;
    }
}

async function deleteRoom(id) {
    try {
        const db = await createDatabase();
        await db.runAsync('DELETE FROM room WHERE id = ?', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting room:', error);
        return false;
    }
}

roomTable();

export { roomTable, addRoom, getRooms, updateRoom, deleteRoom };
