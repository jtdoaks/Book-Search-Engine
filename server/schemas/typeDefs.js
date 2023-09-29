const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    description: String!
    bookId: ID!
    image: String
    title: String
    link: String
  }

  type Auth {
    token: ID!
   user: User
  }

type Query {
  me:User
  users: [User]
  user(id: ID!): User
}

  type Mutation {
    login(email: String!, password: String!): Auth

    addUser(username:String!, email: String!, password: String!): Auth

    saveBook(bookId: ID!, authors: String, description: String!, image: String, link: String, title:String):User
   
    removeBook(bookId: ID!):User
 
  }
`;

module.exports = typeDefs;
