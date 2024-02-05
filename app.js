var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
let baza = require('./base');


var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.set('view engine', 'ejs');
app.set('views', './views');

// middleware, który przekazuje do widoków zmienną user
app.use(async (req, res, next) => {
    if (req.signedCookies.user) {
        const users = await baza.wypiszUzytkownikow();
        const user = users.find(u => u.nick === req.signedCookies.user.nick);
        req.user = user;
    }
    next();
});

// strona główna
app.get('/', async (req, res) => {
    const products = await baza.wypiszProdukty();    
    res.render('index', { user: req.user, products , placeholder: "Wyszukaj produkt"});
});

app.get('/logout', (req, res) => {
    res.cookie('user', '', { maxAge: -1 });
    res.redirect('/');
});
app.get('/addToCart/:productId', async (req, res) => {
    const productId = req.params.productId;
    const user = req.user;
    await baza.dodajDoKoszyka(user._id, productId);
    res.redirect('/');    
});
app.get('/search', async (req, res) => {

    const search = req.query.search;
    if (!search) return res.redirect('/');
    const products = await baza.szukajProduktuPoFrazie(search);
    console.log(products);
    res.render('index', { user: req.user, products: products, placeholder: search});
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
    if (user && user.haslo === pwd && user.typ === "zwykly") {
        // wydanie ciastka
        res.cookie('user', user, { signed: true });
        // przekierowanie
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
        
    }else if (user && user.haslo === pwd && user.typ === "admin") {
        res.cookie('user', user, { signed: true });
        res.redirect('/admin');
    }else {
        res.render('login', { message: "Zła nazwa logowania lub hasło", user: req.user });
    }
});
//strona admina
app.get('/admin', async (req, res) => {
    const users = await baza.wypiszUzytkownikow();
    const products = await baza.wypiszProdukty();
    const orders = await baza.wypiszZamowienia();
    res.render('admin', { user: req.user, users, products, orders, placeholder: "Wyszukaj", stan: 0});
});

app.get('/state/:x', async (req, res) => {
    const state = req.params.x;
    const users = await baza.wypiszUzytkownikow();
    const products = await baza.wypiszProdukty();
    const orders = await baza.wypiszZamowienia();
    res.render('admin', { user: req.user, users, products, orders, placeholder: "Wyszukaj", stan: state});
});

// app.get('/editProduct/:productId', async (req, res) => {
//     const noweDane = {
//         cena: req.body.cenaEdit,
//         opis: req.body.opisEdit, 
//         nazwa: req.body.nazwaEdit
//     };
//     console.log(noweDane);
//     const productId = req.params.productId;
//     await baza.modyfikujProdukt(productId, noweDane);
//     res.redirect('/admin');
// });

app.get('/deleteProduct/:productId', async (req, res) => {
    const productId = req.params.productId;
    await baza.usunProdukt(productId);
    res.redirect('/admin');
});

//strona rejestrowania
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    const users = await baza.wypiszUzytkownikow();
    const user = users.find(u => u.nick === username);
    if (user) {
        res.render('register', { message: "Podana nazwa jest już zajęta!", user: req.user });    
    } else {
        baza.dodajUzytkownika("zwykly", pwd, username);
        const newUser = { nick: username, haslo: pwd }; 
        // wydanie ciastka
        res.cookie('user', newUser, { signed: true }); 
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl || '/');
    }
});
//strona koszyka
app.get('/koszyk', async (req, res) => {
    const orders = await baza.wypiszZamowienia();
    const products = await baza.wypiszProdukty();
    const userOrders = orders.filter(o => o.user_id.toString() === req.user._id.toString());
    console.log(userOrders);
    res.render('cart', { user: req.user, orders: userOrders, products });
});

app.get('/usun-z-koszyka/:productId', async (req, res) => {
    const productId = req.params.productId;
    const user = req.user;
    await baza.usunZKoszyka(user._id, productId);
    res.redirect('/koszyk');  
});
app.get('/zamow', async (req, res) => {
    if (req.user.koszk.length != 0) {
    await baza.dodajZamowienie(req.user._id, req.user.koszk);
    await baza.wyczyscKoszyk(req.user._id);
    }
    else {
        console.log("Koszyk jest pusty");
    }
    res.redirect('/koszyk');
});


http.createServer(app).listen(process.env.PORT || 10000)
console.log('started');

// Wywołanie przykładowego użycia
//baza.dodajProdukt(100,"zegarek")
//dodajZamowienie(43943,3223)
//operateOnParsedUsers();
// operateOnParsedProducts();
// operateOnParsedOrders();
// baza.dodajUzytkownika("admin","admin","admin")

