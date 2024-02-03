
const countryData = require("../data/countryData");
const regionData = require("../data/regionData");


let countries = [];


function initialize() {
    return new Promise((resolve, reject) => {
        try {
            countryData.forEach(country => {
          
                const region = regionData.find(region => region.id === country.regionId);
                const countryWithRegion = {
                    name: country.name,
                    official: country.official,
                    nativeName: country.nativeName,
                    a2code: country.a2code,
                    permanentUNSC: country.permanentUNSC,
                    wikipediaURL: country.wikipediaURL,
                    capital: country.capital,
                    regionId: country.regionId,
                    languages: country.languages,
                    population: country.population,
                    flag: country.flag,
                    region: region
                };
                countries.push(countryWithRegion);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


function getAllCountries() {
    return new Promise((resolve, reject) => {
        if (countries.length > 0) {
            resolve(countries);
        } else {
            reject(new Error("Countries array is empty. Call initialize() first."));
        }
    });
}


function getCountryByCode(countryCode) {
    return new Promise((resolve, reject) => {
        const country = countries.find(country => country.a2code.toLowerCase() === countryCode.toLowerCase());
        if (country) {
            resolve(country);
        } else {
            reject(new Error(`Unable to find country with code: ${countryCode}`));
        }
    });
}

function getCountriesByRegion(region) {
    return new Promise((resolve, reject) => {
        const filteredCountries = countries.filter(country =>
            country.region.name.toLowerCase().includes(region.toLowerCase())
        );
        if (filteredCountries.length > 0) {
            resolve(filteredCountries);
        } else {
            reject(new Error(`Unable to find countries in region: ${region}`));
        }
    });
}
module.exports = { initialize, getAllCountries, getCountryByCode, getCountriesByRegion };
