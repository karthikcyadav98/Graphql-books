const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const mongoose = require('mongoose');

const app = express();

//connect to mongo altas
const db = require('./config/keys').mongoURI;
mongoose.connect(db).then(() => console.log('MongoDB Connected')).catch((err) => console.log(err));

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

port = process.env.PORT || 5000;

app.listen(port, () => console.log('Server running on port ', port));
