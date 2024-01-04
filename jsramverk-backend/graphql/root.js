import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import { getCodes } from "../models/codes.js";
import { getDelayedTrains } from "../models/delayed.js";
import { getTickets } from "../models/tickets.js";

import CodeType from "./codes.js";
import DelayType from "./delayed.js";
import TicketType from "./tickets.js";


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        Code: {
            type: CodeType,
            description: 'A single code',
            args: {
                Code: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let codesArray = await getCodes();

                return codesArray.find(code => code.Code === args.Code);
            }
        },
        Codes: {
            type: new GraphQLList(CodeType),
            description: 'List of all codes',
            resolve: async function() {
                return await getCodes();
            }
        },
        Delay: {
            type: DelayType,
            description: 'A single delay',
            args: {
                OperationalTrainNumber: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let delaysArray = await getDelayedTrains();

                return delaysArray
                    .find(delay => delay.OperationalTrainNumber === args.OperationalTrainNumber);
            }
        },
        Delays: {
            type: new GraphQLList(DelayType),
            description: 'List of all delays',
            resolve: async function() {
                return await getDelayedTrains();
            }
        },
        Ticket: {
            type: TicketType,
            description: 'A single ticket',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: async function(parent, args) {
                let ticketArray = await getTickets();

                return ticketArray.find(ticket => ticket.id === args.id);
            }
        },
        Tickets: {
            type: new GraphQLList(TicketType),
            description: 'List of all tickets',
            resolve: async function() {
                return await getTickets();
            }
        }
    })
});

export default RootQueryType;
