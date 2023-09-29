const { User, bookSchema } = require('../models');
// const Book = require('../models/Book.js');
const { signToken, AuthenticationError, authMiddleware } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
        users: async (parent, { id }, context) => {

            return await User.find({});
        },
        user: async (parent, { id }, context) => {

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

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            console.log(user)
            const token = signToken(user);
            console.log(token)
            return { token, user };
        },

        saveBook: async (parent, { bookId, authors, description, image, link, title }, context) => {
            if (context.user) {

                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: {
                            savedBooks: {
                                bookId,
                                title: title,
                                description: description,
                                authors,
                                link,
                                image
                            }
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            }
            throw AuthenticationError;
        },

        removeBook: async (parent, { bookId }, context) => {

            if (context.user) {


                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true, runValidators: true },
                );

                return updatedUser
            }


            throw AuthenticationError;
        }

    },
};

module.exports = resolvers;
