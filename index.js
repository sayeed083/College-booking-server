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

        // await client.connect();

        //Database and Collections Here
        const userCollection = client.db("admissionDB").collection("user");
        const collegeCollection = client.db("admissionDB").collection("allCollege");


        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        });



 


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)

        });


        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);
        })











        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existUser = await userCollection.findOne(query)
            console.log("Already Here:", existUser);
            if (existUser) {
                return res.send({ message: 'User Already Exists' })
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        });





        app.patch('/user/updateUserInfo/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateTheUsers = req.body;
            const updatingTheUsers = {
                $set: {
                    name: updateTheUsers.name,
                    email: updateTheUsers.email
                }

            }
            const result = await userCollection.updateOne(filter, updatingTheUsers, options)
            res.send(result);


        })

        app.get('/allCollege', async (req, res) => {
            const result = await collegeCollection.find().toArray()
            res.send(result)
        });
        app.get('/allCollege/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collegeCollection.findOne(query);
            res.send(result);
            
        });






















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
