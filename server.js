const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
var sql = require("mssql/msnodesqlv8");
const axios = require("axios");

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

    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }
    
    type User {
        name: String
        age: Int
        college: String
        id: Int
    }

    type Query {
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalAPI: [Post]
        message: String
        getUsersSql: [User]
    }
    input UserInput{
        name: String!
        age: Int!
        college: String!
    }
    type Mutation{
        setMesseage(newMessage: String): String
        createUser(user: UserInput): User
        deleteUser(id: Int!): User

    }

`);
  const users = {};
  var data ='';

var config = {
  connectionString:
    "Driver=SQL Server;Server=DESKTOP-ADIHTO9\\SQLEXPRESS;Database=people;Trusted_Connection=true;",
};
sql.connect(config)


var root = {
  hello: () => {
    return "Hello World";
  },

  welcomeMessage: (args) => {
    return `Hey ${args.name}, today is ${args.dayOfWeek}`;
  },

  getUser: () => {
    const user = {
      name: "Shlomo",
      age: 34,
      college: "tec",
    };
    return user;
  },

  getUsers: async() => {
    //return data.recordset;

    const users = [
        {
            name: 'shlomo m',
            age:34,
            college: 'tec',
        },
        {
            name: 'shlomo mh',
            age:340,
            college: 'tecn',
        }
    ];
    return users;
  },
  getUsersSql: async() =>{
    //return data.recordset;
    try {
      return (await new sql.Request().query(`SELECT * FROM users`)).recordset;
    } catch (err) {
      console.error(err);
      throw err;
    }

  },

  getPostsFromExternalAPI: () => {
    return axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then(result => result.data);
  },

  setMesseage: ({newMessage}) => {
    message=newMessage;
    return message;
  },

  message: () => message,
  createUser: (args)=> {
    console.log(args);
    return args.user;
},
deleteUser: async ({ id }) => {
  try {
    (
      await new sql.Request()
        .query(`delete from users where id=${id}`)
    ).recordset;
   //return  deletemessage;
  } catch (err) {
    console.error(err);
    throw err;
  }
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

app.listen(4000, () => console.log("Server on port 4000"));
