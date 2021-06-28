const express = require('express'), 
			morgan = require('morgan');

const app = express();

const bodyParser = require('body-parser'), 
	methodOverride = require('method-override');




app.use(morgan('common'));

app.use(bodyParser.json());

app.use(methodOverride());

app.use(express.static('public'));



app.get('/', (req,res) => {
	res.send('Welcome to my MovieList');
});

app.get('/movies', (req, res) => {
	res.json(MyMovies);
});

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});


app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});