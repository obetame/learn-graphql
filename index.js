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

const port = process.env.PORT;

if (port == undefined) {
	app.listen(12580);
	console.info('url: http://localhost:12580/graphql');
	// 请打开 http://localhost:12580/graphql
} else {
	app.listen(port);
	console.info('url: http://localhost:' + port + '/graphql');
}