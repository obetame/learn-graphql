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

const port = process.argv[2];
if (port == undefined) {
	console.log("Error: port not defined, use 'npm start port' to define server port");
	console.log();
	process.exit();
}

app.listen(port);
console.log('Info: url: http://localhost:' + port + '/graphql');
// 请打开 http://localhost:12580/graphql
