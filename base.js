module.exports = {wypiszProdukty, pobierzWszystkieIdKluczy, dodajUzytkownika, parsedUserToTable, operateOnParsedUsers, operateOnParsedUser, modyfikujUzytkownika, usunUzytkownika, dodajProdukt, operateOnParsedProduct, parsedProductToTable, operateOnParsedProducts, modyfikujProdukt, usunProdukt, dodajZamowienie, operateOnParsedOrder, parsedOrderToTable, operateOnParsedOrders, modyfikujZamowienie, usunZamowienie};
// funkcje do korzytstania z bazy danych
const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';

// Nazwa bazy danych
const mainDataBase = 'MainDataBase';

// Nazwa kolekcji
const users_collection = 'uzytkownicy';
const products_collection = "produkty";
const orders_collection = "zamowienia";


async function wypiszProdukty() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcja = client.db(mainDataBase).collection(products_collection);

        const result = await kolekcja.find({}, { projection: { _id: 0 } }).toArray();

        console.log(result);
        return result;

    } finally {
        await client.close();
    }
}

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

async function parsedUserToTable(idUzytkownika) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(users_collection);

        // Pobierz użytkownika o danym ID
        const uzytkownik = await kolekcjaMongoDB.findOne({ _id: idUzytkownika });

        // Sprawdź, czy użytkownik został znaleziony
        if (!uzytkownik) {
            console.log(`Użytkownik o ID ${idUzytkownika} nie został znaleziony.`);
            return null; // Możesz zdecydować, jak obsłużyć brak znalezionego użytkownika
        }

        // Zamień atrybuty obiektu na tablicę
        const tablicaAtrybutow = Object.values(uzytkownik);

        // Zamknij połączenie z bazą danych
        return tablicaAtrybutow;

    } finally {
        await client.close();
    }
}

async function operateOnParsedUsers() {
    try {
        const idKlucze = await pobierzWszystkieIdKluczy(users_collection);

        // Iteracja po idKlucze za pomocą pętli for
        for (let i = 0; i < idKlucze.length; i++) {
            const aktualnyId = idKlucze[i];
            const parsedUser = await parsedUserToTable(aktualnyId)


            // TODO funkcja operujaca na sparsowanym użytkowniku do tablicy
            console.log(`infromacje o użytkowniku: ${parsedUser}`);


        }

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
    }
}

async function operateOnParsedUser(userId) {
    try {
        const parsedUser = await parsedUserToTable(userId)
            // TODO funkcja operujaca na sparsowanym użytkowniku do tablicy
            console.log(`infromacje o użytkowniku: ${parsedUser}`);
        }

    catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
    }
}

//const noweDane = { typ: "nowyTyp", haslo: "noweHaslo", nick: "nowyNick" };
async function modyfikujUzytkownika(idUzytkownika, noweDane) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(users_collection);

        // Sprawdź, czy użytkownik o danym ID istnieje
        const istniejacyUzytkownik = await kolekcjaMongoDB.findOne({ _id: idUzytkownika });

        if (!istniejacyUzytkownik) {
            console.log(`Użytkownik o ID ${idUzytkownika} nie został znaleziony.`);
            return null;
        }

        // Zaktualizuj dane użytkownika
        await kolekcjaMongoDB.updateOne({ _id: idUzytkownika }, { $set: noweDane });

        console.log(`Użytkownik o ID ${idUzytkownika} został zaktualizowany.`);
        return true;

    } finally {
        await client.close();
    }
}

async function usunUzytkownika(idUzytkownika) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(users_collection);

        // Sprawdź, czy użytkownik o danym ID istnieje
        const istniejacyUzytkownik = await kolekcjaMongoDB.findOne({ _id: idUzytkownika });

        if (!istniejacyUzytkownik) {
            console.log(`Użytkownik o ID ${idUzytkownika} nie został znaleziony.`);
            return null;
        }

        // Usuń użytkownika
        await kolekcjaMongoDB.deleteOne({ _id: idUzytkownika });

        console.log(`Użytkownik o ID ${idUzytkownika} został usunięty.`);
        return true;

    } finally {
        await client.close();
    }
}


//koniec operacji na użytkownikach --------------------------------------------------------------------------------------------------------
// operacje na produktach -----------------------------------------------------------------------------------------------------

async function dodajProdukt(_cena, _nazwa) {
    const client = new MongoClient(url);

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

async function operateOnParsedProduct(productId) {
    try {
        const parsedProduct = await parsedProductToTable(userId)
            // TODO funkcja operujaca na sparsowanym użytkowniku do tablicy
            console.log(`infromacje o użytkowniku: ${parsedProduct}`);
        }

    catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
    }
}

async function parsedProductToTable(idProduktu) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(products_collection);

        // Pobierz użytkownika o danym ID
        const produkt = await kolekcjaMongoDB.findOne({ _id: idProduktu });

        // Sprawdź, czy użytkownik został znaleziony
        if (!produkt) {
            console.log(`Użytkownik o ID ${idProduktu} nie został znaleziony.`);
            return null; // Możesz zdecydować, jak obsłużyć brak znalezionego użytkownika
        }

        // Zamień atrybuty obiektu na tablicę
        const tablicaAtrybutow = Object.values(produkt);

        // Zamknij połączenie z bazą danych
        return tablicaAtrybutow;

    } finally {
        await client.close();
    }
}

async function operateOnParsedProducts() {
    try {
        const idKlucze = await pobierzWszystkieIdKluczy(products_collection);

        // Iteracja po idKlucze za pomocą pętli for
        for (let i = 0; i < idKlucze.length; i++) {
            const aktualnyId = idKlucze[i];
            const parsedProduct = await parsedProductToTable(aktualnyId)

            // TODO funkcja operujaca na sparsowanym użytkowniku do tablicy
            console.log(`infromacje o produkcie: ${parsedProduct}`);

        }

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
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


async function operateOnParsedOrder(orderId) {
    try {
        const parsedOrder = await parsedOrderToTable(orderId)
            // TODO funkcja operujaca na sparsowanym użytkowniku do tablicy
            console.log(`infromacje o użytkowniku: ${parsedOrder}`);
        }

    catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
    }
}

async function parsedOrderToTable(idZamowienia) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(orders_collection);

        // Pobierz zamowienie
        const order = await kolekcjaMongoDB.findOne({ _id: idZamowienia });

        // Sprawdź, czy użytkownik został znaleziony
        if (!order) {
            console.log(`Zamowienie o ID ${idZamowienia} nie został znaleziony.`);
            return null; // Możesz zdecydować, jak obsłużyć brak znalezionego użytkownika
        }

        // Zamień atrybuty obiektu na tablicę
        const tablicaAtrybutow = Object.values(order);

        // Zamknij połączenie z bazą danych
        return tablicaAtrybutow;

    } finally {
        await client.close();
    }
}

async function operateOnParsedOrders() {
    try {
        const idKlucze = await pobierzWszystkieIdKluczy(orders_collection);

        // Iteracja po idZamomwien
        for (let i = 0; i < idKlucze.length; i++) {
            const aktualnyId = idKlucze[i];
            const parsedOrder = await parsedOrderToTable(aktualnyId)

            // TODO funkcja operujaca na sparsowanym zamowieniu do tablicy
            console.log(`infromacje o zamowieniu: ${parsedOrder}`);
        }

    } catch (error) {
        console.error('Wystąpił błąd:', error);
        throw error;
    }
}


async function modyfikujZamowienie(idZamowienia, noweDane) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(orders_collection);

        // Sprawdź, czy zamówienie o danym ID istnieje
        const istniejaceZamowienie = await kolekcjaMongoDB.findOne({ _id: idZamowienia });

        if (!istniejaceZamowienie) {
            console.log(`Zamówienie o ID ${idZamowienia} nie zostało znalezione.`);
            return null;
        }

        // Zaktualizuj dane zamówienia
        await kolekcjaMongoDB.updateOne({ _id: idZamowienia }, { $set: noweDane });

        console.log(`Zamówienie o ID ${idZamowienia} zostało zaktualizowane.`);
        return true;

    } finally {
        await client.close();
    }
}

async function usunZamowienie(idZamowienia) {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const kolekcjaMongoDB = client.db(mainDataBase).collection(orders_collection);

        // Sprawdź, czy zamówienie o danym ID istnieje
        const istniejaceZamowienie = await kolekcjaMongoDB.findOne({ _id: idZamowienia });

        if (!istniejaceZamowienie) {
            console.log(`Zamówienie o ID ${idZamowienia} nie zostało znalezione.`);
            return null;
        }

        // Usuń zamówienie
        await kolekcjaMongoDB.deleteOne({ _id: idZamowienia });

        console.log(`Zamówienie o ID ${idZamowienia} zostało usunięte.`);
        return true;

    } finally {
        await client.close();
    }
}