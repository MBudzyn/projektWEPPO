var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});


const { MongoClient } = require('mongodb');

// Adres lokalnej bazy danych MongoDB
const uri = 'mongodb://127.0.0.1:27017';

// Nazwa bazy danych
const mainDataBase = 'MainDataBase';

// Nazwa kolekcji
const users_collection = 'uzytkownicy';
const products_collection = "produkty"
const orders_collection = "zamowienia"

async function dodajUzytkownika(_typ,_haslo,_nick) {
    const client = new MongoClient(uri);

    const nowyUzytkownik = {
        typ: _typ,
        haslo: _haslo,
        nick: _nick,
        koszk: []
    };

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(users_collection);
        const wynik = await kolekcja.insertOne(nowyUzytkownik);
        console.log(`Użytkownik dodany do kolekcji. ID dokumentu: ${wynik.insertedId}`);

    } finally {
        await client.close();
    }
}

async function dodajProdukt(_cena, _nazwa) {
    const client = new MongoClient(uri);

    const nowyProdukt = {
        cena: _cena,
        nazwa: _nazwa
    };

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(products_collection);
        const wynik = await kolekcja.insertOne(nowyProdukt);
        console.log(`Produkt dodany do kolekcji. ID dokumentu: ${wynik.insertedId}`);

    } finally {
        await client.close();
    }
}

async function dodajZamowienie(_user_id, _products_ids) {
    const client = new MongoClient(uri);

    const noweZamowienie= {
        user_id: _user_id,
        products_ids: _products_ids
    };

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(orders_collection);
        const wynik = await kolekcja.insertOne(noweZamowienie);
        console.log(`Produkt dodany do kolekcji. ID dokumentu: ${wynik.insertedId}`);

    } finally {
        await client.close();
    }
}

// Uruchom funkcję, aby dodać użytkownika do kolekcji
//dodajUzytkownika("zwykly", "aooaoi","ushgai");

async function pobierzWszystkieIdKluczy(kolekcja) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(kolekcja);

        // Pobierz wszystkie dokumenty z kolekcji
        const dokumenty = await kolekcjaMongoDB.find({}).toArray();

        // Zwróć tylko ID kluczy
        const idKlucze = dokumenty.map(dokument => dokument._id);

        return idKlucze;

    } finally {
        await client.close();
    }

}


http.createServer(app).listen(process.env.PORT || 10000)
console.log('started');

