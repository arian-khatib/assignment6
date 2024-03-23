/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Arian Khatib Student ID: 119670222 Date:3/07/2024
*
*  Published URL: 
*
********************************************************************************/

const unCountryData = require("./modules/unCountries");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use((req,res,next)=>{
  app.locals.currentRoute = req.path;
  next();
});

app.get('/', (req, res) => {
    res.render("home");
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

app.get('/un/addCountry', (req, res) => {
  unCountryData.getAllRegions().then((regions)=>{return res.render('addCountry',{regions:regions});} )
});


app.post('/un/addCountry', (req, res)=> {
  unCountryData.addCountry(req.body)
    .then(() => {
      return unCountryData.getAllCountries();
    })
    .then((countryData) => {
      res.render('countries', { region: "All", countries: countryData });
    })
    .catch((error) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    });
});

app.post('/un/editCountry/:code', (req, res)=> {
  unCountryData.getCountryByCode(req.params.code)
    .then((country) => {
      return unCountryData.editCountry(country.a2code, req.body); 
    })
    .then(() => {
      return unCountryData.getAllCountries();
    })
    .then((countryData) => {
      res.render('countries', { region: "All", countries: countryData });
    })
    .catch((error) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    });
});



app.get("/un/countries", async (req,res)=>{
 
  try{
    if(req.query.region){
      let countries = await unCountryData.getCountriesByRegion(req.query.region);
      let {region} = req.query;
      region = region.charAt(0).toUpperCase() + region.slice(1);
      if(countries.length)res.render("countries", {region, countries});
      else throw new Error("No Countries found for a matching region!!")
  
    }else{
      let countries = await unCountryData.getAllCountries();
      let region = req.query.region;
      res.render("countries", { region: "All ", countries});
    }
  }catch(err){
    res.status(404).render("404", {message:err});
  }

});

app.get("/un/deleteCountry/:code", (req, res)=>{
  unCountryData.deleteCountry(req.params.code)
  .then(()=>{return unCountryData.getAllCountries();
  })
  .then((countryData) => {
   res.render('countries', { region: "All", countries: countryData });
  })
  .catch((error) => {
    res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
  })
  }
  );


  app.get("/un/countries/:code", async (req,res)=>{
    try{
      let country = await unCountryData.getCountryByCode(req.params.code);
      res.render("country", {country});
     
    }catch(err){
      res.render("404", {message: err});
    }
  });




app.get("/un/editCountry/:code", (req,res)=>{
unCountryData.getCountryByCode(req.params.code)
.then((country)=>{res.render("editCountry", {country})})
.catch((err)=>res.status(404).render('404', {message: err}) )
})



app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

unCountryData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

