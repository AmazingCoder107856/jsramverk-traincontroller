import { openDb } from '../db/database.js';

const trains = {
    fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
        let db;

        try {
            db = await openDb();
        } catch (error) {
            return {
                status: error.status,
                message: error.message,
            };
        } finally {
            await db.close();
        }
    }
};

export default trains;
