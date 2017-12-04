// 1. Loading modules with require
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
// new
var mongoose = require('mongoose');

// 2. set up express app (static directories, view engine, bodyparser)
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuring mongoose
mongoose.connect('mongodb://localhost/mongoose_lecture_december');

// Create and use models
// Schema first
var SelfDrivingCarsSchema = mongoose.Schema({
	name: {type: String, minlength: 5},
	make: {type: String, minlength: 5},
	licenseNumber: Number
})

// Register the schema to a model
mongoose.model('Car', SelfDrivingCarsSchema);

// Create a variable that represents the model
var Car = mongoose.model('Car');

// Express routing
app.get('/', function(req,res){
	// Query db for all cars
	Car.find({}, function(err, allCars){
		if(err){
			console.log("something went wrong");
			console.log(err);
			res.send(err);
		}else{
			console.log("got all cars");
			res.render('index', {cars: allCars});
		}
	})
})
app.post('/cars', function(req,res){
	// create a variable that represents the new car
	var newCar = new Car(req.body);
	// save the car instance
	newCar.save(function(err){
		if(err){
			console.log("something went wrong");
			console.log(err);
			res.send(err);
		}else{
			console.log("successfully saved new car");
			res.redirect('/');
		}
	})
})


// Server listen
app.listen(8000, function(){
	console.log("on port :8000");
})