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
        id: Int
        name: String
        age: Int
        college: String
    }

    type Query {
        hello: String!
        welcomeMessage(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalAPI: [Post]
        message: String
        getUsersSql: [User]
        getUserSql(id: Int!): [User]
    }
    input UserInput{
        id: Int!
        name: String!
        age: Int!
        college: String!
    }
    type Mutation{
        setMesseage(newMessage: String): String
        createUser(user: UserInput): User
        createUserSql(user: UserInput): User
        updateUserSql(id: Int!, name: String!, age: Int!, college: String!): User
        deleteUserSql(id: Int!): User
    }

`);

const user = {};
var data = "";

//Person Path DataBase
const RomanPath = 'DESKTOP-NRHU0LQ';
const OfriPath = 'LAPTOP-UVC3IKLO';
const ShlomoPath = 'DESKTOP-ADIHTO9'; //need to enter
const Guest = ''; //Enter Your values

var config = {
  connectionString:
    `Driver=SQL Server;Server=${ShlomoPath}\\SQLEXPRESS;Database=people;Trusted_Connection=true;`,
};
sql.connect(config);

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

  getUsers: async () => {
    const users = [
      {
        name: "shlomo m",
        age: 34,
        college: "tec",
      },
      {
        name: "shlomo mh",
        age: 340,
        college: "tecn",
      },
    ];
    return users;
  },
  getUsersSql: async () => {
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
      .then((result) => result.data);
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
  updateUserSql: async ({ id, name, age, college }) => {
    try {
      (
        await new sql.Request()
          .query(`update users set name='${name}', age=${age}, college='${college}'
      where id=${id}`)
      ).recordset;
      return { id, name, age, college };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  createUserSql: async (args) => {
    try {
      await new sql.Request().query(
        ` INSERT INTO users VALUES ('${args.user.id}', '${args.user.name}', '${args.user.age}',  '${args.user.college}')`
      );
      return args.user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteUserSql: async ({ id }) => {
    try {
      (
        await new sql.Request()
          .query(`delete from users where id=${id}`)

      ).recordset;
     return { id };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getUserSql: async ({ id }) => {
    try {
     return (

         await new sql.Request()
          .query(`select * from users where id=${id}`)
            ).recordset;
     
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
/* 
QUERIES TO CHECK VALIDATION

# query{
#   getUsersSql{
#     id
#     name
#     age
#     college
#   }
# }

# mutation{
#   updateUserSql(id: 2, name: "Antuan", age: 13, college:"ssr") {
#     id
#     name
#     age
#     college
#   }
# }

# mutation{
#   createUserSql(  
#     user: {
#       id: 5,
#       name: "Daria",
#       age:33,
#       college: "Tto"
#     }
#   ){
#     id
#     name
#     age
#     college
#   }
# }

# mutation{
#   deleteUserSql (id:2){
#     name
#   }
  
# }
#query{
#   getUserSql(id:5){
#     name
#     college
#     age
#   }
# }
*/
