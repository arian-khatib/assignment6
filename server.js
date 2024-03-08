/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Arian Khatib Student ID: 119670222 Date:2/16/2024
*
*  Published URL: https://funny-fawn-waders.cyclic.app
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const unCountryData = require("./modules/unCountries");

const HTTP_PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}


app.get("/", (req, res) => {
    res.render("home", { page: '/' });
});


app.get("/about", (req, res) => {
    res.render("about", { page: '/about' });
});

app.get("/un/countries", async (req, res) => {
    try {
        const countries = await unCountryData.getAllCountries(); // Fetch the countries data
        res.render("countries", {
            countries: countries,
            page: '/un/countries' // Ensure this to highlight the navbar link
        });
    } catch (error) {
        console.error("Failed to fetch countries:", error);
        res.status(500).send("Error loading country data.");
    }
});


app.get('/un/countries/:a2code', async (req, res) => {
    try {
        const country = await unCountryData.getCountryByCode(req.params.a2code);
        if (!country) {
            throw new Error("Country not found");
        }
        res.render("country", {
            country: country,
            page: '' 
        });
    } catch (error) {
        res.status(404).render("404", { 
            message: "I'm sorry, we're unable to find the country you're looking for.",
            page: '' 
        });
    }
});



app.use((req, res) => {
    res.status(404).render("404", {
        message: "The page you are looking for cannot be found.",
        page: '' 
    });
});

unCountryData.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.error("Error initializing data service: ", err);
});
