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
        res.end(`hello world ${new Date()}`);
    });
    server.listen(process.env.PORT || 10000);
    console.log('started');
})();

const { MongoClient } = require('mongodb');

// Adres lokalnej bazy danych MongoDB
const uri = 'mongodb://localhost:27017';

// Nazwa bazy danych
const databaseName = 'NowaBazaDanych';

// Nazwa kolekcji
const collectionName = 'uzytkownicy';

// Przykładowy użytkownik
const nowyUzytkownik = {
    id: 1,
    id_koszyka: 101,
    haslo: 'haslo123',
    nick: 'nowy_uzytkownik'
};

async function dodajUzytkownika() {
    const client = new MongoClient(uri);

    try {
        // Połącz z bazą danych
        await client.connect();

        // Utwórz lub pobierz kolekcję
        const kolekcja = client.db(databaseName).collection(collectionName);

        // Dodaj użytkownika do kolekcji
        const wynik = await kolekcja.insertOne(nowyUzytkownik);

        console.log(`Użytkownik dodany do kolekcji. ID dokumentu: ${wynik.insertedId}`);
    } finally {
        // Zamknij połączenie
        await client.close();
    }
}

// Uruchom funkcję, aby dodać użytkownika do kolekcji
//dodajUzytkownika();