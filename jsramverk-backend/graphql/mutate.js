import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';


import { createTicket, updateTicket as _updateTicket } from "../models/tickets.js";

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

                return await createTicket(newTicket);
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

                return await _updateTicket(updatedTicket);
            }
        },
    })
});

export default RootMutationType;
