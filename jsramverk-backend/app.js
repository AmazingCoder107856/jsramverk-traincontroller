import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import trainsModel from './models/trains.js';
import delayed from './routes/delayed.js';
import tickets from './routes/tickets.js';
import ticketsModel from "./models/tickets.js";
import codes from './routes/codes.js';
import token from './routes/token.js';
import login from './routes/login.js';
import register from './routes/register.js';
import authModel from './models/auth.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { createHandler } from 'graphql-http/lib/use/express';

import { GraphQLSchema } from 'graphql';

import RootQueryType from "./graphql/root.js";
import RootMutationType from "./graphql/mutate.js";

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.options('*', cors());

app.use(morgan('dev'));

app.disable('x-powered-by');

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const io = new Server (httpServer, {
    cors: {
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

app.use("/login", login);
app.use("/register", register);
app.use("/token", token);

app.all('*', authModel.checkAPIKey);
app.all('*', authModel.checkToken);

app.use('/graphql', createHandler({
    schema: schema
}));

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

let allTickets = [];

io.sockets.on('connection', async function(socket) {
    allTickets = await ticketsModel.getTickets();
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
        allTickets = await ticketsModel.getTickets();
        allTickets.forEach((ticket) => {
            if (ticket.id === data) {
                ticket.locked = false;
            }
        });

        io.emit("allTickets", allTickets);
    });
});

const server = httpServer.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
});

trainsModel.fetchTrainPositions(io);


export default server;
