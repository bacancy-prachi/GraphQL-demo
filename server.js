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

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
        type: new GraphQLList(BookType),
        description: 'List of All Books',
        resolve: () => books 
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