require("dotenv").config();
const express = require("express");
const app = express();

// //<=========Do this for EJS ==============>
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("view engine", "ejs");

//require spotify-web-api-node package here:
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/artist-search", (req, res) => {
  const { artist } = req.body;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const items = data.body.artists.items.map((element) => element);

      //const url = items[0].images[0].url;
      //console.log("url", url);
      //console.log("items", items);
      //console.log("images", images);
      res.redirect("artist-search-results");

      app.get("/artist-search-results", (req, res) => {
        res.render("artist-search-results", { items: items });
      });
      return items;
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
