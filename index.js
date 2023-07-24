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
        const admissionCollection = client.db("admissionDB").collection("allAdmission");


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
            // console.log("Already Here:", existUser);
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













        app.post('/allAdmissions', async (req, res) => {
            const admissionClass = req.body.fullClass;
            const userClass = req.body.currentUser;
            console.log({ admissionClass, userClass });
        
            const userId = userClass.userId;
            const filter = { _id: new ObjectId(userId) };
            const userData = {
                $set: {
                    name: userClass.name,
                    email: userClass.email,
                    userImage: userClass.userImage,
                    address: userClass.address,
                    collegeName: userClass.collegeName
                },
            };
        
            try {
                const result = await admissionCollection.insertOne(admissionClass); // Assuming admissionCollection is properly initialized.
                const updateUserData = await userCollection.updateOne(filter, userData);
        
                res.send({ result, updateUserData });
            } catch (error) {
                console.error(error);
                res.status(500).send("An error occurred.");
            }
        });














        app.get('/allAdmissions', async (req, res) => {
            const result = await admissionCollection.find().toArray()
            res.send(result)
        });
        app.get('/allAdmissions/:email', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await admissionCollection.find(query).toArray();
            res.send(result)
        })





        app.put('/allCollege/review/:id', async (req, res) => {
            const id = req.params.id
            const feedbackClass = req.body;
            console.log(feedbackClass, 'classData');
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const feedbackClassData = {
                $set: {

                    review: feedbackClass.review,
                    rating: feedbackClass.rating,
                    name: feedbackClass.name,
                    image: feedbackClass.image,
                    admissionDate: feedbackClass.admissionDate,
                    events: feedbackClass.events,
                    researchHistory: feedbackClass.researchHistory,
                    admissionProcess: feedbackClass.admissionProcess,
                    researchWorks: feedbackClass.researchWorks,
                    sportsCategories: feedbackClass.sportsCategories,
                    sportsInformation: feedbackClass.sportsInformation


                },
            };


            const result = await collegeCollection.updateOne(filter, feedbackClassData, options);

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
