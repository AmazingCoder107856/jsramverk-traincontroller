/* global it describe before beforeEach */

/**
 * Test file for graphql queries
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

const codesQuery = `{ Codes {
    Code,
    Level1Description,
    Level2Description,
    Level3Description
}}`;

const delaysQuery = `{ Delays {
    OperationalTrainNumber, 
    LocationSignature, 
    FromLocation { LocationName }, 
    ToLocation { LocationName }, 
    AdvertisedTimeAtLocation, 
    EstimatedTimeAtLocation } }`;


const ticketsQuery = `{ Tickets {
    id,
    code,
    trainnumber,
    traindate }
    }`;


should();
use(chaiHttp);

let token;
let apiKey;

describe('root', () => {
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

    /* GET codes from graphql */
    describe('Get codes from graphql', () => {
        it('should get 200 when getting codes', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: codesQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Codes');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Codes.length.should.equal(2);

                    done();
                });
        });
    });

    /* GET delays from graphql */
    describe('Get delays from graphql', () => {
        it('should get 200 when getting delays', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: delaysQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Delays');
                    res.should.have.status(200);
                    res.body.data.Delays.length.should.equal(2);


                    done();
                });
        });
    });

    /* GET tickets from graphql */
    describe('Get tickets from graphql', () => {
        it('should get 200 when getting tickets', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: ticketsQuery})
                .end((err, res) => {
                    res.body.data.should.have.property('Tickets');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Tickets.should.be.an("array");
                    res.body.data.Tickets.length.should.equal(2);

                    done();
                });
        });
    });

    /* GET single code from graphql */
    describe('Get single code from graphql', () => {
        it('should get 200 when getting single code', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: `{Code(Code: "ANA002"){Level1Description}}`})
                .end((err, res) => {
                    res.body.data.should.have.property('Code');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Code.Level1Description.should.equal('Brofel');

                    done();
                });
        });
    });

    /* GET single ticket from graphql */
    describe('Get single ticket from graphql', () => {
        it('should get 200 when getting single ticket', (done) => {
            request(server)
                .post("/graphql?api_key=" + apiKey)
                .set('x-access-token', token)
                .send({ query: `{Ticket(id: 1){code}}`})
                .end((err, res) => {
                    res.body.data.should.have.property('Ticket');
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.Ticket.code.should.equal("ANA002");

                    done();
                });
        });
    });
});
