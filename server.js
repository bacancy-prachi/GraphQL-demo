const express = require('express')
const expressGraphQL = require('express-graphql')
const{
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull

}= require('graphql')
const app = express()

const authors = [
    { id: 1, name: 'Prachi Jain' },
    { id: 2, name: 'Bhargav Thummar' },
    { id: 3, name: 'Digesh Parecha' }
]

const books = [
    { id: 1, name: "The shinning", authorId: 1 },
    { id: 2, name: "Dark Shadow", authorId: 1 },
    { id: 3, name: "The platform", authorId: 2 },
    { id: 4, name: "Doctor Sleep", authorId: 3 },
    { id: 5, name: "Ouija", authorId: 1 },
    { id: 6, name: "The shutter island", authorId: 2 },
    { id: 7, name: "Gone girl", authorId: 3 },
    { id: 8, name: "The mask", authorId: 2 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
         }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: { 
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
            },
        books: {
        type: new GraphQLList(BookType),
        description: 'List of All Books',
        resolve: () => books 
        },
        authors: {
        type: new GraphQLList(AuthorType),
        description: 'List of All Authors',
        resolve: () => authors 
        },
        author: {
            type: AuthorType,
            description: 'A signle author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
            }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})
    
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server Running'))