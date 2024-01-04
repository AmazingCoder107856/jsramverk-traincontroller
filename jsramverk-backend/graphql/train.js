import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const TrainType = new GraphQLObjectType({
    name: 'Train',
    description: 'This represents a train',
    fields: () => ({
        trainnumber: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: GraphQLString },
        timestamp: { type: GraphQLString },
        bearing: { type: GraphQLString },
        status: { type: GraphQLString },
        speed: { type: GraphQLString }
    })
});

export default TrainType;
