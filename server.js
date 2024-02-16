/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Arian Khatib Student ID: 119670222 Date:2/16/2024
*
*  Published URL: 
*
********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const unCountryData = require("./modules/unCountries");

const HTTP_PORT = process.env.PORT || 8080;


app.use(express.static('public'));


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});


app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});


app.get("/un/countries", async (req, res) => {
    try {
        const { region } = req.query;
        if (region) {
            const countriesByRegion = await unCountryData.getCountriesByRegion(region);
            res.json(countriesByRegion);
        } else {
            const allCountries = await unCountryData.getAllCountries();
            res.json(allCountries);
        }
    } catch (err) {
        res.status(404).send("Error retrieving countries: " + err.message);
    }
});


app.get("/un/countries/:a2code", async (req, res) => {
    try {
        const country = await unCountryData.getCountryByCode(req.params.a2code);
        if (country) {
            res.json(country);
        } else {
            throw new Error("Country not found");
        }
    } catch (err) {
        res.status(404).send("Country not found: " + err.message);
    }
});


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});


unCountryData.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.error("Error initializing data service: ", err);
});
