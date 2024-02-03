/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Arian Khatib Student ID: 119670222 Date: 2/3/2024
*
*  Online (Cyclic) Link: 
*
********************************************************************************/

const unCountryData = require('./modules/unCountries');

app.get('/', (req, res) => {
    res.send('Assignment 2: Arian Khatib - 119670222');
});

app.get('/un/countries', (req, res) => {
    unCountryData.getAllCountries()
        .then(countries => {
            res.json(countries);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

app.get('/un/countries/code-demo', async (req, res) => {
    const countryCode = 'AF'; 

    try {
        const country = await unCountryData.getCountryByCode(countryCode);
        res.json(country); 
    } catch (error) {
        res.status(404).send(`Error: ${error.message}`);
    }
});

app.get('/un/countries/region-demo', (req, res) => {
    unCountryData.getCountriesByRegion(regionName)
        .then(countries => {
            res.json(countries);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});