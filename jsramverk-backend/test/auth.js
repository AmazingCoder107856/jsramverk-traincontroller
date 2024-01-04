/* global it describe before beforeEach */

/**
 * Test file for checking route connections
 */

process.env.NODE_ENV = 'test';

import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js';
import { getUserDb } from '../db/database.js';
const collectionName = "users";
// const HTMLParser = require('node-html-parser');

should();
use(chaiHttp);

let found;

describe('auth', () => {
    before(async () => {
        const db = await getUserDb();

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
        let db = await getUserDb();

        found = await db.collection.findOne({ email: "test@email.se" });
    });

    describe('GET /token', () => {
        it('200 getting /token route', (done) => {
            request(server)
                .get("/token")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.equal("Token created");
                    done();
                });
        });
    });

    describe('POST /register', () => {
        it('401 register without email and password', (done) => {
            request(server)
                .post("/register")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("title");
                    res.body.errors.title.should.equal("Email or password missing");

                    done();
                });
        });

        it('401 register with invalid email', (done) => {
            request(server)
                .post("/register")
                .send({
                    email: "test",
                    password: "test"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("title");
                    res.body.errors.title.should.equal("Not a valid email");

                    done();
                });
        });

        it('201 register with email and password', (done) => {
            request(server)
                .post("/register")
                .send({
                    email: "test@email.se",
                    password: "test"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");
                    res.body.data.message.should.include("User successfully registered");

                    done();
                });
        });

        it('401 register with email that has already been registered', (done) => {
            request(server)
                .post("/register")
                .send({
                    email: "test@email.se",
                    password: "test"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("title");
                    res.body.errors.title.should.equal("Email already registered");

                    done();
                });
        });

        describe('POST /login', () => {
            it('401 login without email', (done) => {
                let user = {
                    password: "test",
                    api_key: found.key
                };

                request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property("errors");
                        res.body.errors.should.have.property("title");
                        res.body.errors.title.should.equal("Email, password or apikey missing");

                        done();
                    });
            });

            it('401 login without password', (done) => {
                let user = {
                    email: "test@email.se",
                    api_key: found.key
                };

                request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property("errors");
                        res.body.errors.should.have.property("title");
                        res.body.errors.title.should.equal("Email, password or apikey missing");

                        done();
                    });
            });

            it('401 login without apikey', (done) => {
                let user = {
                    email: "test@email.se",
                    password: "test"
                };

                request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property("errors");
                        res.body.errors.should.have.property("title");
                        res.body.errors.title.should.equal("Email, password or apikey missing");

                        done();
                    });
            });

            it('401 login user not found', (done) => {
                let user = {
                    email: "noone@email.se",
                    password: "test",
                    api_key: found.key
                };

                request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property("errors");
                        res.body.errors.should.have.property("title");
                        res.body.errors.title.should.equal("User not found");

                        done();
                    });
            });

            it('200 login', (done) => {
                let user = {
                    email: "test@email.se",
                    password: "test",
                    api_key: found.key
                };

                request(server)
                    .post("/login")
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("data");
                        res.body.data.should.have.property("message");
                        res.body.data.message.should.equal("User logged in");

                        done();
                    });
            });
        });
    });
});
