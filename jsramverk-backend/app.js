require('dotenv').config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';

import { fetchTrainPositions } from './models/trains.js';
import delayed from './routes/delayed.js';
import tickets from './routes/tickets.js';
import { getTickets } from "./models/tickets.js";
import codes from './routes/codes.js';
import token from './routes/token.js';
import login from './routes/login.js';
import register from './routes/register.js';
import { checkAPIKey, checkToken } from './models/auth.js';

import { createHandler } from 'graphql-http/lib/use/express';

// const expressPlayground = require('graphql-playground-middleware-express')
//     .default

import { GraphQLSchema } from 'graphql';

import RootQueryType from "./graphql/root.js";
import RootMutationType from "./graphql/mutate.js";

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.use(morgan('dev'));

app.disable('x-powered-by');

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = require("socket.io")(httpServer, {
    cors: {
        //origin: "https://www.student.bth.se",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World! This is the API for the course jsramverk, by students glpa22 and haco22'
    });
});

// for developing mode
// app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.use("/login", login);
app.use("/register", register);
app.use("/token", token);

app.all('*', checkAPIKey);
app.all('*', checkToken);

app.use('/graphql', createHandler({
    schema: schema
}));

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

let allTickets = [];

io.sockets.on('connection', async function(socket) {
    allTickets = await getTickets();
    console.log(socket.id);
    allTickets.map((ticket) => {
        ticket.locked = false;
        console.log(ticket);

        return ticket;
    });

    socket.emit("allTickets", allTickets);

    socket.on("lockSocket", function(data) {
        allTickets.forEach((ticket) => {
            if (ticket.id === data) {
                ticket.locked = true;
            }
        });

        io.emit("allTickets", allTickets);
    });

    socket.on("changeStatus", async function(data) {
        allTickets = await getTickets();
        allTickets.forEach((ticket) => {
            if (ticket.id === data) {
                ticket.locked = false;
            }
        });

        io.emit("allTickets", allTickets);
    });

    // socket.on("alltrains", async function() {
    //     allTrains = await trains.fetchTrainPositions(io);

    //     io.emit("allTrains", allTrains);
    // });
});

const server = httpServer.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
});

fetchTrainPositions(io);


export default server;
