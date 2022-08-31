const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
    origin: true,
    Credentials: true
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkoej.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("sa_ecommerce").collection('products');
        app.get("/products", async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)

        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query)
            res.send(product)
        })


        app.get('/search/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category }
            const categoryProduct = await productCollection.find(query).toArray()
            res.send(categoryProduct)
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('My server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})