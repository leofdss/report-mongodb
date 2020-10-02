const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

const DATABASE = 'tizza';
const USERNAME = 'root';
const PASSWORD = 'root';

const path = '/mnt/storage/admin/TIZZA/Producao'

// Connection URL
const url = `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/${DATABASE}`;

const connect = () => {

    return new Promise((resolve, reject) => {

        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true,
            authSource: 'admin'
        }, function (err, client) {

            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });

    });

}

const find = (db, collection, query) => {
    return new Promise((resolve, reject) => {
        db.collection(collection).find(query).toArray((err, docs) => {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
}


/****************************************** */


const process = async () => {
    const client = await connect();
    try {

        const db = client.db('tizza');

        const oss = await find(db, 'os', { cobrarOrcamento: true, dataFaturamento: { $gte: "2020-07-02T21:26:50.718Z" } });

        const list = oss.map(obj => `${obj.id}-${obj.versao}`);
        console.log(list)

        fs.writeFile("./data", JSON.stringify(list, null, 2), function (err) {
            //Caro ocorra algum erro
            if (err) {
                return console.log('erro')
            }
            //Caso não tenha erro, retornaremos a mensagem de sucesso
            console.log('Arquivo Criado');
        });


        client.close();
        return 'ok';

    } catch (error) {
        client.close();
        return error;
    }
}


// Start
process().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});

