const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const productsModel = require('./modules/Products');
const ordersModel = require('./modules/Orders');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json({ limit: '10mb' })); // optional safety net
app.use(cors());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




const uri = "mongodb+srv://rickievishalyt:xjp840EvuPJfmhhC@cluster0.ryvrjjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  ssl: true
})
.then(() => {
  console.log('✅ MongoDB connected');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});


// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to /uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  res.status(200).json({ imageUrl });
});


app.post('/products', async (req, res) => {
  try {
    const newProduct = new productsModel(req.body);
    await newProduct.save();
    res.status(201).json({ msg: "new product added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" });
  }
});


app.post('/order', async (req, res) => {
  try {
    const newOrder = new ordersModel(req.body);
    await newOrder.save();
    res.status(201).json({ msg: "order sent" });
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
});


app.get('/orders', async (req, res) => {
  try {
    const orders = await ordersModel.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
});

app.post('/orders/update-status/close', async (req, res) => {
  try {
    const { orderId } = req.body;

    await ordersModel.findByIdAndUpdate(orderId, {
      'orderDetails.orderStatus.pending': false,
      'orderDetails.orderStatus.closed': true
    });

    res.status(200).json({ msg: 'Order status updated (via POST)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update order status' });
  }
});

app.post('/orders/update-status/pending', async (req, res) => {
  try {
    const { orderId } = req.body;

    await ordersModel.findByIdAndUpdate(orderId, {
      'orderDetails.orderStatus.pending': true,
      'orderDetails.orderStatus.closed': false
    });

    res.status(200).json({ msg: 'Order status updated (via POST)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update order status' });
  }
});

app.post('/orders/delete', async (req, res) => {
  try {
    const { orderId } = req.body;

    const deletedOrder = await ordersModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    res.status(200).json({ msg: 'Order deleted via POST' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete order' });
  }
});


app.get('/products', async (req, res) => {
  try {
    const products = await productsModel.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "error" });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
