module.exports = {wypiszProdukty, dodajDoKoszyka, usunZKoszyka, wypiszUzytkownikow, wypiszZamowienia, znajdzProdukt, 
    pobierzWszystkieIdKluczy, dodajUzytkownika, dodajProdukt, modyfikujProdukt, usunProdukt, dodajZamowienie};
// funkcje do korzytstania z bazy danych
const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';

// Nazwa bazy danych
const mainDataBase = 'MainDataBase';

// Nazwa kolekcji
const users_collection = 'uzytkownicy';
const products_collection = "produkty";
const orders_collection = "zamowienia";



async function pobierzWszystkieIdKluczy(kolekcja) {
    const client = new MongoClient(url);

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
// operacje na użytkownikach ----------------------------------------------------------------------------------------------
async function dodajDoKoszyka(idUzytkownika, idProduktu) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(users_collection);

        // Dodaj produkt do koszyka
        await kolekcjaMongoDB.updateOne({ _id: idUzytkownika }, { $push: { koszk: idProduktu } });

        console.log(`Produkt o ID ${idProduktu} został dodany do koszyka użytkownika o ID ${idUzytkownika}.`);

    } finally {
        await client.close();
    }
}
async function usunZKoszyka(idUzytkownika, idProduktu) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(users_collection);

        // Dodaj produkt do koszyka
        await kolekcjaMongoDB.updateOne({ _id: idUzytkownika }, { $pull: { koszk: idProduktu } });

        console.log(`Produkt o ID ${idProduktu} został usunięty z koszyka użytkownika o ID ${idUzytkownika}.`);

    } finally {
        await client.close();
    }
}

async function wypiszUzytkownikow() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(users_collection);

        const result = await kolekcja.find({}).toArray();
        return result;

    } finally {
        await client.close();
    }
}

async function dodajUzytkownika(_typ,_haslo,_nick) {
    const client = new MongoClient(url);

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




//koniec operacji na użytkownikach --------------------------------------------------------------------------------------------------------
// operacje na produktach -----------------------------------------------------------------------------------------------------
async function wypiszProdukty() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(products_collection);

        const result = await kolekcja.find({}).toArray();
        return result;

    } finally {
        await client.close();
    }
}

async function znajdzProdukt(idProduktu){
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(products_collection);

        const result = await kolekcja.findOne({_id: idProduktu});
        return result;

    } finally {
        await client.close();
    }

}

async function dodajProdukt(_cena, _nazwa, _opis) {
    const client = new MongoClient(url);

    const nowyProdukt = {
        cena: _cena,
        opis: _opis, 
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


async function modyfikujProdukt(idProduktu, noweDane) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(products_collection);

        // Sprawdź, czy produkt o danym ID istnieje
        const istniejacyProdukt = await kolekcjaMongoDB.findOne({ _id: idProduktu });

        if (!istniejacyProdukt) {
            console.log(`Produkt o ID ${idProduktu} nie został znaleziony.`);
            return null;
        }

        // Zaktualizuj dane produktu
        await kolekcjaMongoDB.updateOne({ _id: idProduktu }, { $set: noweDane });

        console.log(`Produkt o ID ${idProduktu} został zaktualizowany.`);
        return true;

    } finally {
        await client.close();
    }
}

async function usunProdukt(idProduktu) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(products_collection);

        // Sprawdź, czy produkt o danym ID istnieje
        const istniejacyProdukt = await kolekcjaMongoDB.findOne({ _id: idProduktu });

        if (!istniejacyProdukt) {
            console.log(`Produkt o ID ${idProduktu} nie został znaleziony.`);
            return null;
        }

        // Usuń produkt
        await kolekcjaMongoDB.deleteOne({ _id: idProduktu });

        console.log(`Produkt o ID ${idProduktu} został usunięty.`);
        return true;

    } finally {
        await client.close();
    }
}
//koniec operacji na produktach -------------------------------------------------------------------------------------------
// operacje na zamowieniach ----------------------------------------------------------------------------------------------
async function wypiszZamowienia() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(orders_collection);

        const result = await kolekcja.find({}).toArray();
        return result;

    } finally {
        await client.close();
    }
}
async function dodajZamowienie(_user_id, _products_ids) {
    const client = new MongoClient(url);

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

