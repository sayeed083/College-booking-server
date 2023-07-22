const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000



//MiddleWare
app.use(cors())
app.use(express.json())



//MongoDB Starts


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nuw1j2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // TODO
        // await client.connect();

        //Database and Collections Here
        // const userCollection = client.db("summerCamp").collection("user");
        // const animeCollection = client.db("AnimeDB").collection("animeData");
        // const testCollection = client.db("AnimeDB").collection("test");


        // CRUD HERE

        // app.get('/all-anime', async (req, res) => {
        //     const result = await animeCollection.find().toArray()
        //     res.send(result)
        // });
        // app.get('/test-anime', async (req, res) => {
        //     const result = await testCollection.find().toArray()
        //     res.send(result)
        // });


































        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Admission Going On..')
})

app.listen(port, () => {
    console.log(`Admission is online at: ${port}`);
})
