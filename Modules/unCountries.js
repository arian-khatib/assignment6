
require('dotenv').config();
const Sequelize = require('sequelize');
let sequelize=new Sequelize('SenecaDB', 'SenecaDB_owner', 'mD8Ki6duXcnV', {
  host: 'ep-rough-heart-a5lktagu.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Region = sequelize.define('Region', {
  id:  {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  subs: Sequelize.STRING
},
{
  createdAt: false, 
  updatedAt: false, 
}

);

const Country = sequelize.define( 'Country',{
    a2code:{
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name:Sequelize.STRING,
    official: Sequelize.STRING,
    nativeName: Sequelize.STRING,
    permanentUNSC: Sequelize.BOOLEAN,
    wikipediaURL: Sequelize.STRING,
    capital: Sequelize.STRING,
    regionId: Sequelize.INTEGER,
    languages: Sequelize.STRING,
    population: Sequelize.INTEGER,
    flag: Sequelize.STRING
},
{
  createdAt: false, 
  updatedAt: false, 
}
);


Country.belongsTo(Region, {foreignKey: 'regionId'});


function initialize() {
  return sequelize.sync().then(() => {
        console.log("Database synchronized successfully");      
    }).catch((error) => {
        console.error("Error synchronizing database:", error);
        throw error; 
      });
  }


function getAllCountries() {
  return Country.findAll({ include: [Region] })}

function getAllRegions(){
  return Region.findAll();
}


function getCountryByCode(countryCode) {
  return Country.findOne({  include: [Region], where: { a2code: countryCode.toUpperCase() }});
}


function addCountry(countryData){
  return Country.create({
    a2code:countryData.a2code,
    name:countryData.name,
    official: countryData.official,
    nativeName: countryData.nativeName,
    permanentUNSC: (countryData.permanentUNSC)=="on",
    wikipediaURL: countryData.wikipediaURL,
    capital: countryData.capital,
    regionId: countryData.regionId,
    languages: countryData.languages,
    population: countryData.population,
    flag: countryData.flag
  });
 
}

function editCountry(countryCode, countryData) {
  return new Promise((resolve, reject) => {
    Country.update({a2code:countryData.a2code,
      name:countryData.name,
      official: countryData.official,
      nativeName: countryData.nativeName,
      permanentUNSC: (countryData.permanentUNSC)=="on",
      wikipediaURL: countryData.wikipediaURL,
      capital: countryData.capital,
      regionId: countryData.regionId,
      languages: countryData.languages,
      population: countryData.population,
      flag: countryData.flag}, {
      where: { a2code: countryCode }
    })
    .then(() => {
      resolve();
    })
    .catch((error) => {
      reject(error.errors[0].message);
    });
  });
}


function getCountriesByRegion(region) {
  region= region.substring(0,1).toUpperCase() + region.substring(1).toLowerCase();
  return Country.findAll({
    include: [Region],
    where: {'$Region.name$': region}
  })
};

function deleteCountry(countryCode) {
  return new Promise((resolve, reject) => {
    Country.destroy({
      where: {
        a2code: countryCode
      }
    })
    .then(() => {
      resolve(); 
    })
    .catch((error) => {
      reject(error.errors[0].message); 
    });
  });
}

module.exports = { initialize, getAllCountries, getCountryByCode, getCountriesByRegion, addCountry, getAllRegions, editCountry, deleteCountry }

