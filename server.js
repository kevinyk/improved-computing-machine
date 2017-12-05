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
var Schema = mongoose.Schema;
var ManufacturerSchema = mongoose.Schema({
	name: {type:String, minlength: 4},
	cars: [{type: Schema.Types.ObjectId, ref: "Car"}]
})
mongoose.model("Manufacturer", ManufacturerSchema);

var SelfDrivingCarsSchema = mongoose.Schema({
	name: {type: String, minlength: 5},
	_make: {type: Schema.Types.ObjectId, ref: "Manufacturer"},
	licenseNumber: Number
})

// Register the schema to a model
mongoose.model('Car', SelfDrivingCarsSchema);

// Create a variable that represents the model
var Car = mongoose.model('Car');
var Manufacturer = mongoose.model("Manufacturer");
// Express routing
app.get('/', function(req,res){
	Manufacturer.find().populate('cars').exec(function(err,allManufacturers){
		if(err){
			console.log("something went wrong");
			console.log(err);
			res.send(err);
		}else{
			console.log("got all makers", allManufacturers);
			res.render('index', {makers: allManufacturers});
		}
	})
})

app.post('/manufacturers', function(req,res){
	var newMaker = new Manufacturer(req.body);
	newMaker.save(function(err){
		if(err){
			console.log("something went wrong");
			res.send(err);
		}else{
			console.log("added new car maker");
			res.redirect('/')
		}
	})
})

app.post('/cars', function(req,res){
	var newCar = new Car(req.body);
	// find the related model
	Manufacturer.findOne({_id: req.body._make}, function(err, foundMaker){
		if(err){
			console.log("something went wrong");
			res.send(err);
		}else{
			console.log("found Manufacturer, adding car");
			// save the item
			newCar.save(function(err){
				if(err){
					console.log("something went wrong");
					console.log(err);
					res.send(err);
				}else{
					// modify the related model
					foundMaker.cars.push(newCar._id);
					console.log("saved car, saving maker now");
					// save the related model
					foundMaker.save(function(err){
						if(err){
							console.log("something went wrong");
							console.log(err);
							res.send(err);
						}else{
							console.log("we made it");
							// done
							res.redirect('/');
						}
					})
				}
			})
		}
	})
})

// app.get('/', function(req,res){
// 	// Query db for all cars
// 	Car.find({}, function(err, allCars){
// 		if(err){
// 			console.log("something went wrong");
// 			console.log(err);
// 			res.send(err);
// 		}else{
// 			console.log("got all cars");
// 			res.render('index', {cars: allCars});
// 		}
// 	})
// })


// app.post('/cars', function(req,res){
// 	// create a variable that represents the new car
// 	var newCar = new Car(req.body);
// 	// save the car instance
// 	newCar.save(function(err){
// 		if(err){
// 			console.log("something went wrong");
// 			console.log(err);
// 			res.send(err);
// 		}else{
// 			console.log("successfully saved new car");
// 			res.redirect('/');
// 		}
// 	})
// })


// Server listen
app.listen(8000, function(){
	console.log("on port :8000");
})