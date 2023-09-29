const { Book, User } = require('../models');
const { signToken, AuthenticationError, authMiddleware } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { id }, context) => {
            console.log(context)
            let user =  await User.findOne({ _id: context.user._id });
            // console.log(user)
            return user
        },
         users: async (parent, {id}, context) => {

            return await User.find({  });
        },
         user: async (parent, {id}, context) => {

            return await User.findOne({ _id: id });
        }
    },

    Mutation: {

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
              }
        
              const correctPw = await user.isCorrectPassword(password);
        
              if (!correctPw) {
                throw AuthenticationError;
              }
        
              const token = signToken(user);

        
              return { token, user };
        },

        addUser: async (parent, {username, email, password }) => {
            const user = await User.create({ username, email, password } );
            console.log(user)
            const token = signToken(user);
            console.log(token)
            return { token, user };
        },

        saveBook: async (parent, {bookId}, context) => {
            if (context.user) {
                return Book.findOneAndUpdate(
                  { _id: bookId },
                  {$addToSet: { savedBooks: { bookId } }, },
                  {
                    new: true,
                    runValidators: true,
                  }
                );
              }
              throw AuthenticationError;
        },

        removeBook: async (parent, {bookId }, context) => {
            const user = await Book.delete(
                { bookId }
            );
            
            if (context.user) {
                return Book.findOneAndUpdate(
                  { _id: bookId },
                  {$pull: {  savedBooks: { bookId }}},
                  { new: true, runValidators: true}
                );
              }
              throw AuthenticationError;
        }
       
    },
};

module.exports = resolvers;
