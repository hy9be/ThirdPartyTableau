//
// Change these to your server's url (and port if not 80) and the site you wish to use it on.
//

//Loading of Module Dependencies
var XMLWriter = require('xml-writer');
var request = require("request");
var express = require("express");
var jsxml = require("node-jsxml");
var app = express();

//Express middleware set up
//Express is a web framework for NodeJS. This is what we're using to act as a web server
app.set('views', __dirname + '/views'); //This is the directory you are grabbing your templates from
app.engine('html', require('ejs').renderFile); //This tells node to use the ejs template
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public')); //This tells node to use the 'public' folder when sending Javascript or CSS files from server-side to client-side
app.use(express.cookieParser('Ronaldinho')); // Didn't end up using this for cookies, but a good standard
app.use(express.session()); // This allows you to save user-specific session data on the server and access it through the browser


//Routes
// This is how we tell the Express what to do and which page to load when the user navigates to different pages.
app.get('/flights', function(req, res) {
  res.render("index.ejs", {
    title: 'Flights',
    currentPage: 'flights',
    tableauViz: 'https://public.tableau.com/views/flights_Hackathon/Sheet1',
    filters:[{
      'title': 'Origin',
			'type': 'multiple',
			'options': ['EWR', 'LGA', 'JFK']
    }],
    err: req.session.err
  });
});


//Start this thing
var port = Number(process.env.PORT || 8001);
app.listen(port);
console.log("Listening on port " + port);
