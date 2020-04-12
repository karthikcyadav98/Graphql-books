const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = require('graphql');
const Book = require('./models/Book');
const Author = require('./models/Author');

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return Author.findById(parent.authorId);
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find({ authorId: parent.id });
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		books: {
			type: GraphQLList(BookType),
			resolve(parent, args) {
				return Book.find();
			}
		},
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },

			//Getting data from database
			resolve(parent, args) {
				return Book.findById(args.id);
			}
		},
		authors: {
			type: GraphQLList(AuthorType),
			resolve(parent, args) {
				return Author.find();
			}
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },

			//Getting data from database
			resolve(parent, args) {
				return Author.findById(args.id);
			}
		}
	})
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addBook: {
			type: BookType,
			args: {
				name: { type: GraphQLString },
				genre: { type: GraphQLString },
				authorId: { type: GraphQLID }
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		},
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: GraphQLString },
				age: { type: GraphQLInt }
			},
			resolve(parent, args) {
				let author = new Author({
					name: args.name,
					age: args.age
				});
				return author.save();
			}
		}
	})
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
