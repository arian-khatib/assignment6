const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Create a Schema variable to point to mongoose.Schema
let Schema = mongoose.Schema;

// Define the loginHistory schema as specified
const loginHistorySchema = new Schema({
  dateTime: Date,
  userAgent: String
});

// Define the userSchema with the properties and types specified
let userSchema = new Schema({
  userName: {
    type: String,
    unique: true // Ensure userName is unique
  },
  password: String, // Password field
  email: {
    type: String,
    unique: true // Ensure email is unique
  },
  loginHistory: [loginHistorySchema] // Array of loginHistory objects
});


let User; 

const initialize = () => {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(MONGODB_URI);
        db.on('error', (err) => {
            reject(err); // Reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model('users', userSchema); // Define the User model on new connection
            resolve(); // Resolve the promise without returning any data
        });
    });
};


const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        // Encrypt the user's password before saving it to the database
        bcrypt.hash(userData.password, 10)
            .then((hash) => {
                userData.password = hash; // Replace the plain text password with the hashed one
                let newUser = new User(userData);
                newUser.save()
                    .then(() => resolve()) // If save operation is successful, resolve the promise
                    .catch((err) => {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        } else {
                            reject(`There was an error creating the user: ${err}`);
                        }
                    });
            })
            .catch((err) => {
                reject(`Error hashing password: ${err}`); // Reject the promise if an error occurs during hashing
            });
    });
};

const checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .then((user) => {
                if (!user) {
                    reject("Unable to find user: " + userData.userName);
                } else {
                    bcrypt.compare(userData.password, user.password)
                        .then((result) => {
                            if (result) {
                                // Update login history
                                if (user.loginHistory.length === 8) {
                                    user.loginHistory.pop();
                                }
                                user.loginHistory.unshift({
                                    dateTime: new Date().toString(),
                                    userAgent: userData.userAgent
                                });
                                User.updateOne({ userName: userData.userName }, { $set: { loginHistory: user.loginHistory } })
                                    .then(() => resolve(user)) // If everything is successful, resolve with the user object
                                    .catch((err) => reject("There was an error verifying the user: " + err));
                            } else {
                                reject("Incorrect Password for user: " + userData.userName);
                            }
                        })
                        .catch((err) => reject("Error comparing passwords: " + err));
                }
            })
            .catch((err) => reject("Unable to find user: " + userData.userName));
    });
};

module.exports = { initialize, registerUser, checkUser };
