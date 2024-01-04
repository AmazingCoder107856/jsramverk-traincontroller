/* global it describe before beforeEach*/

/**
 * Test file for graphql mutations
 */

process.env.NODE_ENV = 'test';

import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';
import { getDb, getUserDb } from "../db/database.js";
const collectionName = "tickets";
import { resetCollection } from "../db/src/functions.js";

import { readFileSync } from "fs";
import { resolve } from "path";
const docs = JSON.parse(readFileSync(
    resolve(__dirname, "../db/src/setup.json"),
    "utf8"
));

// const { GraphQLSchema } = require('graphql')

// const RootQueryType = require("../graphql/root.js");
// const RootMutationType = require("../graphql/mutate.js");

// const schema = new GraphQLSchema({
//     query: RootQueryType,
//     mutation: RootMutationType
// });

const newTicket = `mutation{addTicket(
    id: 3,
    code: "ANA005",
    trainnumber: "1221",
    traindate: "2023-10-25"
    ){
        id
        code
        trainnumber
        traindate
    }}`;


const updateTicket = `mutation{updateTicket(
    id: 1,
    code: "ANA006",
    trainnumber: "8888",
    traindate: "2023-10-25"
    ){
        id
        code
        trainnumber
        traindate
    }}`;

should();
use(chaiHttp);

let token;
let apiKey;

describe('mutation', () => {
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
        await resetCollection("tickets", docs)
            .catch(err => console.log(err));
    });

    beforeEach(async () => {
        const response = await request(server).get('/token');

        token = response._body.data.token;

        await request(server).get('/register').send({email: "app@email.se", password: "test"});
        let db = await getUserDb();

        let found = await db.collection.findOne({ email: "app@email.se" });

        apiKey = found.key;
    });

    /* make a new ticket */
    describe('make new ticket in graphql', () => {
        it('should get 200 when making new ticket', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: newTicket})
                .end((err, res) => {
                    res.body.data.addTicket.should.have.property('id');
                    res.body.data.addTicket.should.have.property('code');
                    res.body.data.addTicket.should.have.property('trainnumber');
                    res.body.data.addTicket.should.have.property('traindate');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.addTicket.id.should.equal(3);
                    // res.body.data.Codes.should.be.an("array");
                    // res.body.data.Codes.length.should.equal(0);

                    done();
                });
        });
    });

    /* update ticket in graphql */
    describe('update ticket in graphql', () => {
        it('should get 200 when updating a ticket', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: updateTicket})
                .end((err, res) => {
                    res.body.data.updateTicket.should.have.property('id');
                    res.body.data.updateTicket.should.have.property('code');
                    res.body.data.updateTicket.should.have.property('trainnumber');
                    res.body.data.updateTicket.should.have.property('traindate');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.updateTicket.code.should.equal("ANA006");

                    done();
                });
        });
    });
});
