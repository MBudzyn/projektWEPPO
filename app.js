var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
let baza = require('./base');

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.set('view engine', 'ejs');
app.set('views', './views');

/**
* @param {http.IncomingMessage} req
* @param {http.ServerResponse} res
* @param {*} next
*/
function authorize(req, res, next) {
    if ( req.signedCookies.user ) {
        req.user = req.signedCookies.user;
        next();
    } else {
        res.redirect('/login?returnUrl='+req.url);
    }
}


// Wywołanie przykładowego użycia
//baza.dodajProdukt(100,"zegarek")
//dodajZamowienie(43943,3223)
//operateOnParsedUsers();
// operateOnParsedProducts();
// operateOnParsedOrders();
//dodajUzytkownika("zwykly","koniczyna","ADAM")

// wymaga logowania dlatego strażnik – middleware „authorize”
app.get( '/', async (req, res) => {
    const products = await baza.wypiszProdukty();
    res.render('index', { user : req.user, products} );
});

app.get( '/logout', authorize, (req, res) => {
    res.cookie('user', '', { maxAge: -1 } );
    res.redirect('/')
});

// strona logowania
app.get( '/login', (req, res) => {
    res.render('login');
});

app.post( '/login', (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    if ( username == pwd) {
        // wydanie ciastka
        res.cookie('user', username, { signed: true });
        // przekierowanie
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
    } else {
        res.render( 'login', { message : "Zła nazwa logowania lub hasło" }
);
    }
});

http.createServer(app).listen(process.env.PORT || 10000)
console.log('started');

