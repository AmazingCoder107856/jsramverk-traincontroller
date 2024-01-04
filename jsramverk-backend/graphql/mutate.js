import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';


import ticketsModel from "../models/tickets.js";

import TicketType from "./tickets.js";

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addTicket: {
            type: TicketType,
            description: 'Add ticket',
            args: {
                id: { type: GraphQLInt },
                code: { type: GraphQLString },
                trainnumber: { type: GraphQLString },
                traindate: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let newTicket = {
                    id: args.id,
                    code: args.code,
                    trainnumber: args.trainnumber,
                    traindate: args.traindate
                };

                return await ticketsModel.createTicket(newTicket);
            }
        },
        updateTicket: {
            type: TicketType,
            description: 'Update ticket',
            args: {
                id: { type: GraphQLInt },
                code: { type: GraphQLString },
                trainnumber: { type: GraphQLString },
                traindate: { type: GraphQLString },
            },
            resolve: async function(parent, args) {
                let updatedTicket = {
                    id: args.id,
                    code: args.code,
                    trainnumber: args.trainnumber,
                    traindate: args.traindate
                };

                return await ticketsModel.updateTicket(updatedTicket);
            }
        },
    })
});

export default RootMutationType;
