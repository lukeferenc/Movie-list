const express = require('express');
const bodyParser = require("body-parser");

const morgan = require('morgan');
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js")

const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');


// mongoose.connect('mongodb://localhost:27017/test', { 
//	useNewUrlParser: true, 
//	useUnifiedTopology: true 
// });

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(morgan("common"));

const cors = require('cors');

app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// default text response 
app.get("/", (req,res) => {
	res.send("Welcome to MyFlix!");
});

app.get('/movies', /*passport.authenticate('jwt', { session: false }),*/ (req, res) => {
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
  Movies.findOne({
	  "Genre.Name":req.params.Name 
  })
    .then ((genre) => {
      res.json(genre.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});


//GET a page about a specific Director
app.get("/directors/:Name", passport.authenticate('jwt', { session: false }), (req,res) => {
	Movies.findOne({
		"Director.Name":req.params.Name
	})
	.then((movie) => {
	  res.json(movie.Director);
	})
	.catch((err) => {
	  console.error(err);
	  res.status(500).send("Error: " + err);
	});
});
  
  

//allow users to register
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
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
				res.status(200).send(req.params.Username + "was deleted.");
			} else {
				res.status(400).send(req.params.Username + "was not found");	
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
			$push: { FavouriteMovies: req.params.MovieID },
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
		{ $pull: { FavouriteMovies: req.params.MovieID} },
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



const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

