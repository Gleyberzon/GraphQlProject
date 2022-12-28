const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const axios = require(`axios`);
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "postgres",
  database: "graph",
});

client.connect();

const app = express();

/*
ID
String
Int
Float
List[]
Boolean
*/

let message = "this is a message";

const schema = buildSchema(`

        type Post{
            userId: Int
            id: Int
            title: String
            body: String
        }

        type User{
            name: String
            age: Int
            college: String
        }

        type Query {
            hello: String!
            welcomeMessage(name:String, dayOfweek: String!): String
            getUser: User
            getUsers: [User]
            getPostsFromExternalAPI: [Post]
            message: String
        }

        input UserInput{
            name: String!
            age: Int!
            college: String!
        }

        type Mutation{
            setMesseage(newMessage: String): String
            createUser(user: UserInput): User
        }
   `);

//createUser(name: String!, age: Int!, college: String!): User

const user = {};

const root = {
  hello: () => {
    return "hello world";
    //return null;
  },
  welcomeMessage: (args) => {
    console.log(args);
    return `hey ${args.name} today is ${args.dayOfweek}`;
  },
  getUser: () => {
    const user = {
      name: "shlomo m",
      age: 34,
      college: "tec",
    };
    return user;
  },
  getUsers: async () => {
    try {
      const result = await client.query(`SELECT * FROM "User"`);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getPostsFromExternalAPI: async () => {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return result.data;
  },
  setMesseage: ({ newMessage }) => {
    message = newMessage;
    return message;
  },
  message: () => message,
  createUser: (args) => {
    console.log(args);
    return args.user;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => console.log("server on port 4000"));
