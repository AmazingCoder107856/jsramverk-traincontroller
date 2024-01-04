import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    description: 'This represents a ticket',
    fields: () => ({
        id: { type: GraphQLInt },
        code: { type: GraphQLString },
        trainnumber: { type: GraphQLString },
        traindate: { type: GraphQLString },
    })
});

export default TicketType;
