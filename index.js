
const express = require('express');
const bodyParser = require("body-parser");

const morgan = require('morgan');
const app = express();

const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');

const mongoose = require("mongoose");
const Models = require("./models.js")

/* mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true, useUnifiedTopology: true
}); */


mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(morgan("common"));

const cors = require('cors');

/* let allowedOrigins = [
  "http://localhost:2000/",
  "http://localhost:1234",
  "http://localhost:4200",
  "https://lukeferenc.github.io"
];
*/

app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


// default text response 
app.get("/", (req,res) => {
	res.send("Welcome to MyFlix!");
});


/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns the movie object
  * @requires authentication JWT
 */

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


  /**
 * Get all users
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors. "url/users"
 * @returns {object} - returns users object
 *  @requires authentication JWT
 */

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


/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by title
 * @param {string} Title - is used to get specific movie "url/movies/:title"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */

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


/**
 * Get all genres
 * @method GET
 * @param {string} endpoint - endpoint to fetch genres. "url/genres"
 * @returns {object} - returns the genre object
 * @requires authentication JWT
 */

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


/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} Name - is used to get specific director "url/directors/:Name"
 * @returns {object} - returns a specific director
 */

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
  
  
/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail address
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */

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
  
/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:Usename"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */

app.put("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
	let hashedPassword = Users.hashPassword(req.body.Password);
	Users.findOneAndUpdate(
		{Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: hashedPassword,
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

/**
  * Delete user by username
  * @method DELETE
  * @param {string} endpoint - endpoint - delete user by username
  * @param {string} Username - is used to delete specific user "url/users/:Username"
  * @returns {string} success/error message
  * @requires authentication JWT
  */

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

/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} Title, Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */

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


/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */

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

/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} Username - is used to get specific user "url/users/:Username"
 * @returns {object} - returns a specific user
 * @requires authentication JWT
 */

app.get("/users/:Username",
  function (req, res) {
    Users.findOne({
        Username: req.params.Username
      })
      .then(function (user) {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);


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

