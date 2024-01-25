var fs = require('fs');
var http = require('http');

(async function () {
    var pfx = await fs.promises.readFile('cert.pfx');
    var server = http.createServer({
        pfx: pfx,
        passphrase: 'pass'
    },
    (req, res) => {
        res.setHeader('Content-type', 'text/html; charset=utf-8');
        res.end(`hello world`);
    });
    server.listen(process.env.PORT || 10000);
    console.log('started');
})();

const { MongoClient } = require('mongodb');

// Adres lokalnej bazy danych MongoDB
const uri = 'mongodb://127.0.0.1:27017';

// Nazwa bazy danych
const mainDataBase = 'MainDataBase';

// Nazwa kolekcji
const users_collection = 'uzytkownicy';
const products_collection = "produkty"

const nowyProdukt = {
    cena: 10,
    nazwa: "produkt1"
}

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


// Uruchom funkcję, aby dodać użytkownika do kolekcji
dodajUzytkownika("zwykly", "aooaoi","ushgai");