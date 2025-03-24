import createDatabase from './database';

// Tenants Table with necessary fields
async function tenantsTable() {
    try {
        const db = await createDatabase();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS tenants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                email TEXT NOT NULL,
                address TEXT NOT NULL,
                room_number INTEGER NOT NULL,
                bed_number INTEGER NOT NULL
            );
        `);
        console.log("Tenants table is ready.");
    } catch (error) {
        console.error("Error creating tenants table:", error);
    }
}

async function addTenant(name, phone_number, email, address, room_number, bed_number) {
    try {
        const db = await createDatabase();
        await tenantsTable();
        await db.runAsync(
            'INSERT INTO tenants (name, phone_number, email, address, room_number, bed_number) VALUES (?, ?, ?, ?, ?, ?)',
            [name, phone_number, email, address, room_number, bed_number]
        );
        return { success: true, message: 'Tenant added successfully' };
    } catch (error) {
        console.error('Error adding tenant:', error);
        return { success: false, message: 'Error adding tenant' };
    }
}


async function getTenants() {
    try {
        const db = await createDatabase();
        const tenants = await db.getAllAsync('SELECT * FROM tenants');
        return tenants;
    } catch (error) {
        console.error('Error getting tenants:', error);
        return [];
    }
}

async function updateTenant(name, phone_number, email, address, room_number, bed_number) {
    try {
        const db = await createDatabase();
        await db.runAsync(
            'UPDATE tenants SET name = ?, phone_number = ?, email = ?, address = ?, room_number = ?, bed_number = ? WHERE id = ?',
            [name, phone_number, email, address, room_number, bed_number, id] // 🔴 id is undefined!
        );
        return { success: true, message: 'Tenant updated successfully' };
    } catch (error) {
        console.error('Error updating tenant:', error);
        return { success: false, message: 'Error updating tenant' };
    }
}

async function deleteTenant(id) {
    try {
        const db = await createDatabase();
        await db.runAsync('DELETE FROM tenants WHERE id = ?', [id]);
        return { success: true, message: 'Tenant deleted successfully' };
    } catch (error) {
        console.error('Error deleting tenant:', error);
        return { success: false, message: 'Error deleting tenant' };
    }
}

async function dropTenantsTable() {
    try {
        const db = await createDatabase();
        await db.execAsync('DROP TABLE IF EXISTS tenants');
        console.log("Tenants table dropped.");
    } catch (error) {
        console.error("Error dropping tenants table:", error);
    }
}


export { tenantsTable, addTenant, getTenants, updateTenant, deleteTenant, dropTenantsTable };
