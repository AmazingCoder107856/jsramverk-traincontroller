/**
 * Connects to database
 */

import { MongoClient as mongo } from "mongodb";
const databaseName = "trains";
const collectionName = "tickets";

const database = {
    getDb: async function getDb() {
        let dsn = 'mongodb+srv://'+process.env.ATLAS_USERNAME+':'+process.env.ATLAS_PASSWORD+
        '@jsramverk.k20ii9n.mongodb.net/?retryWrites=true&w=majority';

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn);
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    },

    getUserDb: async function getUserDb() {
        let dsn = 'mongodb+srv://'+process.env.ATLAS_USERNAME+':'+process.env.ATLAS_PASSWORD+
        '@cluster0.twkapwr.mongodb.net/?retryWrites=true&w=majority';

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn);
        const db = client.db(databaseName);
        const collection = db.collection("users");

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

export default database;
