const { RESTDataSource } = require('apollo-datasource-rest');
const { ApolloServer, gql } = require('apollo-server');

class SysUserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'localhost:5000/';
  }

  async User(id) {
    return this.get(
      `api/v1/sysusers/${id}`, // path
    );
  }

  async gettoken(clientId, userName, password) {
    return this.get(
      `token`, {
        clientId: clientId,
        userName: userName,
        password: password,
      }
    );
  }
}

const defineUser = `
type User {
  id: String
  code: String
  name: String
}

type Token {
  ClientId: String
  UserName: String
}

type Query {
  user(id: String): User
}
`;
const typeDefs = gqldefineUser;

const resolvers = {
  Query: {
    user : async (_source, { id }, { dataSources }) => {
      return dataSources.SysUserAPI.getuser(id);
    },
    gettoken : async (_source, { clientId, userName, password }, { dataSources }) => {
      return dataSources.SysUserAPI.gettoken(clientId, userName, password);
    },
  },
  }

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      sysuserAPI: new SysUserAPI()
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});