const express = require('express');
	bodyParser = require("body-parser")
	uuid = require("uuid");

const morgan = require('morgan');
const app = express();
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js")

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;


mongoose.connect('mongodb://localhost:27017/dbname', { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

app.use(bodyParser.json());

app.use(morgan("common"));



let movies = [
	{
	  title: 'The Shawshank Redemption (1994)',
	  description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
	  genre: 'Drama',
	  director: {
		  name: 'Frank Darabont' 
	  },
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BNjQ2NDA3MDcxMF5BMl5BanBnXkFtZTgwMjE5NTU0NzE@._V1_CR0,60,640,360_AL_UX477_CR0,0,477,268_AL_.jpg'
	},
	{
	  title: 'The Godfather (1972)',
	  description: "An organized crime dynasty's aging patriarch transfers control of his clandestine empire to his reluctant son.",
	  genre: 'Crime, Drama',
	  director: {
		name: 'Francis Ford Coppola'
	  },
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg'
	},
	{
	  title: 'The Godfather: Part II (1974)',
	  description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
	  genre: 'Crime, Drama',
	  director: {
		name: 'Francis Ford Coppola'
	  },
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg'
	},
	{
	  title: 'The Dark Knight (2008)',
	  description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
	  genre: 'Action, Crime, Drama',
	  director: {
		name: 'Christopher Nolan'
	  }, 
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg'
	},
	{
	  title: '12 Angry Men (1957)',
	  description: 'A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the business.',
	  genre: 'Drama',
	  director: {
		name: 'Paul Thomas Anderson'
	  }, 
	  image_URL: 'https://images-na.ssl-images-amazon.com/images/I/91irMeVhBYL._SL1500_.jpg'
	},
	{
	  title: "Schindler's List (1993)",
	  description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
	  genre: 'Biography, Drama, History',
	  director: {
		name: 'Steven Spielberg'
	  },
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg'
	},
	{
	  title: 'The Lord of the Rings: The Return of the King (2003)',
	  description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
	  genre: ' Action, Adventure, Drama',
	  director: {
		name: 'Peter Jackson'
	  }, 
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg'
	},
	{
	  title: 'Pulp Fiction (1994)',
	  description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
	  genre: 'Crime, Drama',
	  director: {
		name: 'Quentin Tarantino'
	  },  
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR1,0,182,268_AL_.jpg'
	},
	{
	  title: 'The Good, the Bad and the Ugly (1966)',
	  description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
	  genre: 'Western',
	  director: {
		name: 'Sergio Leone'
	  },   
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_UX182_CR0,0,182,268_AL_.jpg'
	},
	{
	  title: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
	  description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
	  genre: 'Action, Adventure, Drama',
	  director: {
		name: 'Peter Jackson'
	  },    
	  image_URL: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_UX182_CR0,0,182,268_AL_.jpg'
	}
  ];



// default text response 
app.get("/", (req,res) => {
	res.send("Welcome to MyFlix!");
});

app.get('/movies', (req, res) => {
	Movies.find()
	.then((movies) => {
	  res.status(201).json(movies);
	})
	.catch((err) => {
	  console.error(err);
	  res.status(500).send('Error: ' + err);
	});
  });


app.get('/users', (req, res) => {
	Users.find()
	  .then((users) => {
		res.status(201).json(users);
	  })
	  .catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	  });
  });

// GET JSON movie info when looking for specific title
app.get("/movies/:Title", (req,res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			res.json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error: " + err);
		});
});


//GET JSON genre info when looking for specific genre
app.get("/genres/:Name", (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then ((genre) => {
      res.json(genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});


//GET a page about a specific Director
app.get("/director/:Name",(req,res) => {
	Directors.findOne({ Name: req.params.Name })
	.then((director) => {
	  res.json(director);
	})
	.catch((err) => {
	  console.error(err);
	  res.status(500).send("Error: " + err);
	});
});
  
  

//allow users to register
app.post("/users", (req, res) => {
	Users.findOne({ Username: req.bodyUsername })
	.then((user) => {
		if (user) {
			return res.status(400).send(req.body.Username + "already exists")
		} else {
			Users.create({
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			})
				.then((user) => {
					res.status(201).json(user);
				})
				.catch((error) => {
					console.error(error);
					res.status(500).send("Error" + error);
				});
		}
	})
	.catch((error) => {
		console.error(error);
		res.status(500).send("Error") + error);
	});
});
  
  
// allows users to update info
app.put("/users/:Username", (req, res) => {
	Users.findOneAndUpdate(
		{Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new:true },
		(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send("Error" + err);
		} else {
			res.json(updatedUser);
		}
	}
	);
});

//alow user to deregister
app.delete("/users/:Username", (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username})
		.then((user) => {
			if (user) {
				res.status(400).send(req.params.Username + "was not found");	
			} else {
				res.status(200).send(req.params.Username + "was deleted.");
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Error:" + err);
		});
});

//add movie to usernames list
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$push: { Fav: req.params.Username },
		},
		{ new: true }, 
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send("Error:" + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

//remove movie from usernames list
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{ $pull: { Fav: req.params.MovieID} },
		{ new: true },
		(error, updatedUser) => {
			if (error) {
				console.error(error);
				res.status(500).send("Error:" + error);
			} else {
				res.json(updatedUser);
			}
		}
	);
});


app.get('/users/:userId'), function(req, res) {
	res.send('Getting a User')
}


app.use(express.static('public'));





app.use(bodyParser.urlencoded({
	extended: true
}));

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Error');
});


app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});