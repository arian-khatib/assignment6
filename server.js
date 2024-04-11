/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Arian Khatib Student ID: 119670222 Date:4/11/2024
*
*  Published URL: 
*
********************************************************************************/
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const authData = require('./modules/auth-service');
const unCountryData = require("./modules/unCountries");
const clientSessions = require('client-sessions');

const mongoose = require('mongoose');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(clientSessions({
  cookieName: 'session',
  secret: 'your_session_secret_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render("home", { currentRoute: '/' }); 
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/countries', (req, res) => {
  res.render('countries');
});

app.get('/country', (req, res) => {
  res.render('country');
});

app.get('/un/addCountry', ensureLogin, (req, res) => {
  unCountryData.getAllRegions().then((regions)=>{res.render('addCountry',{regions:regions});})
});

app.post('/un/addCountry', ensureLogin, (req, res) => {
  unCountryData.addCountry(req.body)
    .then(() => unCountryData.getAllCountries())
    .then((countryData) => res.render('countries', { region: "All", countries: countryData }))
    .catch((error) => res.render('500', { message: `Error: ${error}` }));
});

app.post('/un/editCountry/:code', ensureLogin, (req, res) => {
  unCountryData.getCountryByCode(req.params.code)
    .then((country) => unCountryData.editCountry(country.a2code, req.body))
    .then(() => unCountryData.getAllCountries())
    .then((countryData) => res.render('countries', { region: "All", countries: countryData }))
    .catch((error) => res.render('500', { message: `Error: ${error}` }));
});

app.get("/un/countries", async (req, res) => {
  try {
    let countries = req.query.region ? await unCountryData.getCountriesByRegion(req.query.region) : await unCountryData.getAllCountries();
    let region = req.query.region ? req.query.region.charAt(0).toUpperCase() + req.query.region.slice(1) : "All";
    res.render("countries", { region, countries, currentRoute: '/un/countries' }); // Pass the currentRoute variable
  } catch (err) {
    res.status(404).render("404", {message: err.toString()});
  }
});

app.get("/un/deleteCountry/:code", ensureLogin, (req, res) => {
  unCountryData.deleteCountry(req.params.code)
    .then(() => unCountryData.getAllCountries())
    .then((countryData) => res.render('countries', { region: "All", countries: countryData }))
    .catch((error) => res.render('500', { message: `Error: ${error}` }));
});

app.get("/un/countries/:code", async (req, res) => {
  try {
    let country = await unCountryData.getCountryByCode(req.params.code);
    res.render("country", {country, currentRoute: ''}); // Here, pass the currentRoute variable
  } catch (err) {
    res.render("404", {message: err.toString()});
  }
});

app.get("/un/editCountry/:code", ensureLogin, (req, res) => {
  unCountryData.getCountryByCode(req.params.code)
    .then((country) => res.render("editCountry", {country}))
    .catch((err) => res.status(404).render('404', {message: err.toString()}));
});

app.get('/login', (req, res) => {
    res.render("login", { errorMessage: "", userName: "" });
});

app.get('/register', (req, res) => {
    res.render("register", { errorMessage: "", successMessage: "", userName: "" });
});

app.post('/register', (req, res) => {
    authData.registerUser(req.body)
        .then(() => {
            res.render("register", { successMessage: "User created", errorMessage: "", userName: "" });
        })
        .catch((err) => {
            res.render("register", { errorMessage: err, userName: req.body.userName, successMessage: "" });
        });
});

app.post('/login', (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName,
                email: user.email,
                loginHistory: user.loginHistory
            };
            res.redirect('/un/countries');
        })
        .catch((err) => {
            res.render("login", { errorMessage: err, userName: req.body.userName });
        });
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get('/userHistory', ensureLogin, (req, res) => {
    res.render("userHistory");
});

app.use((req, res) => {
  res.status(404).render("404", {message: "Page not found"});
});



const MONGODB_URI = 'mongodb+srv://ArianKhatib:Arian123!@atlascluster.0bg41pj.mongodb.net/assignment6';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));
  })
  .catch((err) => console.log("Unable to connect to MongoDB:", err));
