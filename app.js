var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
let baza = require('./base');

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.set('view engine', 'ejs');
app.set('views', './views');

// middleware, który przekazuje do widoków zmienną user
app.use((req, res, next) => {
    if (req.signedCookies.user) {
        req.user = req.signedCookies.user;
    }
    next();
});

// strona główna
app.get('/', async (req, res) => {
    const products = await baza.wypiszProdukty();
    res.render('index', { user: req.user, products });
});

app.get('/logout', (req, res) => {
    res.cookie('user', '', { maxAge: -1 });
    res.redirect('/');
});

// strona logowania
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    const users = await baza.wypiszUzytkownikow();
    const user = users.find(u => u.nick === username);
    if (user && user.haslo === pwd) {
        // wydanie ciastka
        res.cookie('user', user, { signed: true });
        // przekierowanie
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
        
    } else {
        res.render('login', { message: "Zła nazwa logowania lub hasło", user: req.user });
    }
});


http.createServer(app).listen(process.env.PORT || 10000)
console.log('started');

// Wywołanie przykładowego użycia
//baza.dodajProdukt(100,"zegarek")
//dodajZamowienie(43943,3223)
//operateOnParsedUsers();
// operateOnParsedProducts();
// operateOnParsedOrders();
//baza.dodajUzytkownika("zwykly","pass","nick")

