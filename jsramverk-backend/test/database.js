/* global it describe before beforeEach */

/**
 * Test file for database actions
 */

process.env.NODE_ENV = 'test';

import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';
import { getDb, getUserDb } from "../db/database.js";
const collectionName = "tickets";
import { resetCollection } from "../db/src/functions.js";

should();
use(chaiHttp);

let token;
let apiKey;

describe('tickets', () => {
    before(async () => {
        const db = await getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });

    beforeEach(async () => {
        const response = await request(server).get('/token');

        token = response._body.data.token;

        await request(server).get('/register').send({email: "app@email.se", password: "test"});
        let db = await getUserDb();

        let found = await db.collection.findOne({ email: "app@email.se" });

        apiKey = found.key;
    });

    /* GET route */
    describe('GET /tickets', () => {
        it('should get 200 when getting tickets', (done) => {
            request(server)
                .get("/tickets?api_key=" + apiKey)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.equal(0);

                    done();
                });
        });
    });

    /* POST route */
    describe('POST /tickets', () => {
        it('should get 200 when adding ticket', (done) => {
            const doc = {
                id: 1,
                code: "A1102",
                trainnumber: 266,
                traindate: "2023-09-21",
            };

            request(server)
                .post("/tickets?api_key=" + apiKey)
                .set('x-access-token', token)
                .send(doc)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.include(doc);

                    done();
                });
        });
    });

    /* Reset function */
    describe('Reset collection',  () => {
        it('should reset collection to given values', (done) => {
            const doc = [{
                id: 1,
                code: "A1102",
                trainnumber: 266,
                traindate: "2023-09-21",
            },
            {
                id: 2,
                code: "B1103",
                trainnumber: 560,
                traindate: "2023-09-21"
            }];

            resetCollection(collectionName, doc);

            request(server)
                .get("/tickets?api_key=" + apiKey)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.equal(2);
                    res.body.data[1].code.should.include(doc[1].code);

                    done();
                });
        });
    });
});
