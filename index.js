// Elevator App using nodejs

// Simmulating an elevator using event emitters and event listeners.

// Setting up the EventEmitter and requiring events built in to nodejs.
const EventEmitter = require("events");
const elevator = new EventEmitter();

// Elevator starts on the first floor and a passenger will get on the elevator.
// each time a trip is completed from destination back to ground floor.
var currentFloor = 1;
var currentPassenger;

// Create a passengers object with name and desination(desired floor).
const passengers = [
	{ name:'PJ', destination: 3 },
	{ name:'Ai Hua', destination: 10 },
	{ name:'Yin Yin', destination: 5 },
	{ name:'Harold', destination: 4 },
];

// Create a function elevatorUp that takes passenger as an arg.
function elevatorUp(passengers) {
	console.log("Floor : ", currentFloor);

	// if currrent floor is less than the pass destination then increment(move up 1 floor).
	if (currentFloor < passengers.destination) {
		currentFloor++;

		// This setTimout Function sets 1 second per increased floor.
		setTimeout(function() {
			elevator.emit("up", currentPassenger);
		}, 1000);

// if passengers are on their desired floor that states that the passenger has gotten off
// the elevator.
	} else if (currentFloor === passengers.destination) {
		setTimeout(function() {
			console.log(passengers.name + " has gotten off on Floor: " + passengers.destination);

			// Remove the listener because the elevator has reached the top, and is now going
			// back down to the ground floor(1).
			elevator.removeListener("up", elevatorUp);
			elevator.on("down", elevatorDown);

			// Elevator will travel down to floor 1, taking 1 second per floor.
			setTimeout(function() {
				elevator.emit("down", elevatorDown);
			}, 1000);
		}, 1000);
	}
}

function elevatorDown() {
	console.log("Floor : ", currentFloor);

	// if currrent floor is greater than the pass destination then decrement(move down 1 floor).
	if (currentFloor > 1) {
		currentFloor--;

		// This setTimout Function sets 1 second per decraesed floor.
		setTimeout(function() {
			elevator.emit("down");
		}, 1000);

	// if the elevator is on the ground floor wait a second for a passenger to get on.
	} else if (currentFloor === 1) {
		setTimeout(function() {
			// Remove the listener because the elevator has reached the ground floor
			// and is now going back up with a passenger to the desired floor.
			elevator.removeListener("down", elevatorDown);
			elevator.on("up", elevatorUp);

			// if the array of passengers is less than 0, then the currentPassenger is
			// equal to the first passenger in the array (PJ).
			if (passengers.length > 0) {
				currentPassenger = passengers[0];
				console.log(currentPassenger.name + " has gotten on the elevator.");

				// The shift method allow for the removal of the first person in the array
				// and will rotate through the array taking one off the list per trip.
				passengers.shift();

				// this sets a tiemout that moves the elevator up 1 floor per second.
				setTimeout(function() {
					elevator.emit("up", currentPassenger);
				}, 1000);

			// if the elevator is done taking passengers up after it has returned to
			// the ground floor then run the message in the console. and display it after
			// 1 sec.
			} else {
				setTimeout(function() {
					console.log("There are no more passengers in the lobby!");
				}, 1000);
			}
		}, 1000);
	}
}

// This down listener listens for the final trip to the ground floor.
elevator.on("down", elevatorDown);
// This emitter emits the final trip to floor 1.
elevator.emit("down", currentPassenger);
