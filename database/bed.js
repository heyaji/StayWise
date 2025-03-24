import createDatabase from './database';

// Bed Table with necessary fields from the form
async function bedTable() {
    try {
        const db = await createDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS bed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bed_number INTEGER NOT NULL,
                bed_status TEXT NOT NULL,
                room_number TEXT NOT NULL
            );
        `);
        console.log("Beds table is ready.");
    } catch (error) {
        console.error("Error creating beds table:", error);
    }
}

async function addBed(bed_number, bed_status, room_number) {
    try {
        console.log("Attempting to add bed:", bed_number, bed_status, room_number); // Log the values before insertion
        const db = await createDatabase();
        await db.runAsync(
            'INSERT INTO bed (bed_number, bed_status, room_number) VALUES (?, ?, ?)',
            [bed_number, bed_status, room_number]
        );
        console.log("Bed added successfully!");
        return { success: true };
    } catch (error) {
        console.error('Add bed error:', error);
        return { success: false, message: 'Error adding bed' };
    }
}


async function getBeds() {
    try {
        const db = await createDatabase();
        const beds = await db.getAllAsync('SELECT * FROM bed');
        return beds;
    } catch (error) {
        console.error('Error getting beds:', error);
        return [];
    }
}

async function updateBed(id, bed_number, bed_status, room_number) {
    try {
        const db = await createDatabase();
        await db.runAsync(
            'UPDATE bed SET bed_number = ?, bed_status = ?, room_number = ? WHERE id = ?',
            [bed_number, bed_status, room_number, id]
        );
        return { success: true, message: 'Bed updated successfully' };
    } catch (error) {
        console.error('Error updating bed:', error);
        return { success: false, message: 'Error updating bed' };
    }
}

async function deleteBed(id) {
    try {
        const db = await createDatabase();
        await db.runAsync('DELETE FROM bed WHERE id = ?', [id]);
        return { success: true, message: 'Bed deleted successfully' };
    } catch (error) {
        console.error('Error deleting bed:', error);
        return { success: false, message: 'Error deleting bed' };
    }
}

bedTable();

export { bedTable, addBed, getBeds, updateBed, deleteBed };
