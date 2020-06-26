const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
);

app.listen(12580);
console.log('please open http://localhost:12580/graphql');
// 请打开 http://localhost:12580/graphql
