const express = require('express');
const bodyParser = require("body-parser");

const morgan = require('morgan');
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js")

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;


mongoose.connect('mongodb://localhost:27017/test', { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

app.use(bodyParser.json());

app.use(morgan("common"));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// default text response 
app.get("/", (req,res) => {
	res.send("Welcome to MyFlix!");
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
	Movies.find()
	.then((movies) => {
	  res.status(201).json(movies);
	})
	.catch((err) => {
	  console.error(err);
	  res.status(500).send('Error: ' + err);
	});
  });


app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.get("/genres/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/director/:Name", passport.authenticate('jwt', { session: false }), (req,res) => {
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
app.post("/users", passport.authenticate('jwt', { session: false }), (req, res) => {
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
		res.status(500).send("Error" + error);
	});
});
  
  
// allows users to update info
app.put("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
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