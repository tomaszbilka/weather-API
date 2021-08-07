const express = require( "express" );
const https = require( "https" );
const ejs = require( "ejs" );


const app = express();

app.set( "view engine", "ejs" );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );
app.use( express.static( "public" ) );

app.get( "/", ( req, res ) => {
    res.render( "index.ejs" )
} );

app.get( "/weather", ( req, res ) => {
    res.render( "weather.ejs" )
} );

app.post( "/weather", ( req, res ) => {
    res.redirect( "/" );
} );

app.post( "/", ( req, res ) => {

    const query = req.body.cityName;
    const apiKey = "a2170f82f2548c5adfad60fc95987377#";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    https.get( url, response => {
        //console.log( response.statusCode );

        if ( response.statusCode === 200 ) {
            response.on( "data", data => {
                const weatherData = JSON.parse( data );
                const temp = weatherData.main.temp.toFixed( 1 );
                const weatherDescription = weatherData.weather[ 0 ].description;
                const icon = weatherData.weather[ 0 ].icon;
                const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                res.render( "weather", { city: query, description: weatherDescription, icon: imgUrl, temperature: temp } );
            } );
        } else {
            res.render( "weather", { city: query, description: "you put wrong city name", icon: "https://image.flaticon.com/icons/png/512/158/158391.png", temperature: "" } );
        }

    } );
} );


//port server in heroku
let port = process.env.PORT;
if ( port == null || port == "" ) {
    port = 3000;
};

app.listen( port, () => console.log( `Server is running` ) );