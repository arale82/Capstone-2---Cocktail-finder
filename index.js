import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_URL = "http://www.thecocktaildb.com/api/json/v1/1/";
/* if it needs a token to work, add config here
const yourBearerToken = "cd5802dc-6835-42d6-b11e-1f219990eae0";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
}; */

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//home page -> show random cocktail
app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL+"random.php");
    res.render("index.ejs", { drink: result.data.drinks[0], random: true });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

//detail of one cocktail (id = i)
app.get("/detail", async (req, res) => {
  try {
    const result = await axios.get(API_URL+"lookup.php?i="+req.query.id);
    res.render("index.ejs", { drink: result.data.drinks[0] });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

//index -> list of cocktail in alphabetical order filtered by start letter.
app.get("/index", async (req, res) => {
  try {
    const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", ];
    let letterChosen = "a";
    if(req.query.i){
      letterChosen = req.query.i;
    }
    const result = await axios.get(API_URL+"search.php?f="+letterChosen);
    res.render("list.ejs", { drinks: result.data.drinks,  alphabet : alphabet, letterChosen: letterChosen});
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

//ingr -> list of cocktails filtered by ingredient. starting with First ingredient of the list.
app.get("/ingr", async (req, res) => {
  try {
    const ingredients = [ "Light rum","Applejack","Gin","Dark rum","Sweet Vermouth","Strawberry schnapps","Scotch","Apricot brandy","Triple sec","Southern Comfort","Orange bitters","Brandy","Lemon vodka","Blended whiskey","Dry Vermouth","Amaretto","Tea","Champagne" ]
    let ingrChosen = "Light rum";
    if(req.query.i){
      ingrChosen = req.query.i;
    }
    const result = await axios.get(API_URL+"filter.php?i="+ingrChosen);
    res.render("list-ingredients.ejs", { drinks: result.data.drinks,  ingredients : ingredients, ingrChosen: ingrChosen});
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
