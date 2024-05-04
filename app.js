
const express = require('express');const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb+srv://bhavinjoshi57:cjTomFAGk6wtVMYG@billingappc1.t7vqvim.mongodb.net/?retryWrites=true&w=majority&appName=BillingAppC1';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        database = client.db('billing_app'); 
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

app.use(async (req, res, next) => {
    if (!database) {
        await connectToDatabase();
    }
    next();
});

app.get('/salesman', async (req, res) => {
    try {
        const collection = database.collection('salesman');
        const documents = await collection.find().toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching salesman data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/salesman', express.json(), async (req, res) => {
    const { name, number } = req.body;
    try {
        if (!name && !number) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const collection = database.collection('salesman');
        const result = await collection.insertOne({ name, number });
        
        res.status(201).json({ message: 'Salesman added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Error adding new salesman:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/products', async (req, res) => {
    try {
        const collection = database.collection('products');
        const documents = await collection.find().toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching products data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/products', express.json(), async (req, res) => {
    const { productName, variant } = req.body;
    try {
        if (!productName && !variant) {
            return res.status(400).json({ error: 'productName and variant are required' });
        }
        
        const collection = database.collection('products');
        const result = await collection.insertOne({ productName, variant });
        
        res.status(201).json({ message: 'Products added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Error adding new products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/orders', async (req, res) => {
    try {
        const collection = database.collection('orders');
        const documents = await collection.find().toArray();
        res.json(documents);
    
    } catch (error) {
        console.error('Error fetching orders data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/orders', express.json(), async (req, res) => {
    const { userName, mobile, products, paymentAmount, paymentRecived } = req.body;
    if(!(userName && mobile && products && paymentAmount && paymentRecived)){ 
        return res.status(400).json({ error: 'userName, mobile, products, paymentAmount, paymentRecived and variant are required' });
    }
    let date = new Date();
    try {
        const collection = database.collection('orders');
        const result = await collection.insertOne({ userName, mobile, products, paymentAmount, paymentRecived, date});
        
        res.status(201).json({ message: 'Orders added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Error adding new orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/userdata', async (req, res) => {
    try {
        const collection = database.collection('user');
        const documents = await collection.find().toArray();
        res.json(documents);
    
    } catch (error) {
        console.error('Error adding new user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/userdata', express.json(), async (req, res) => {
    const { userName, mobile, balance } = req.body;
    try {
        if(!(userName && mobile && balance)){ 
            return res.status(400).json({ error: 'userName, mobile and balance are required' });
        }
        const collection = database.collection('user');
        const result = await collection.insertOne({ userName, mobile, balance});
        
        res.status(201).json({ message: 'user added successfully', _id: result.insertedId });
    } catch (error) {
        console.error('Error adding new user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

