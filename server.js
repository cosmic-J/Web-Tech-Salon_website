const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the project root folder
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/beautyStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose connected to beautyStore DB');
});

db.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
    console.warn('Mongoose disconnected');
});

// Product Schema and Model
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String, required: true },
    benefits: [String],
    ingredients: String,
    usage: String,
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Service Schema and Model
const serviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String, required: true },
    benefits: [String],
    duration: String,
    variations: [
        {
            name: String,
            price: Number,
            description: String,
        }
    ],
    active: { type: Boolean, default: true }
});
const Service = mongoose.model('Service', serviceSchema);

// Appointment Schema and Model
const appointmentSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    services: [{
        _id: { type: String },  // Explicitly define _id as String type here to accept string IDs
        name: String,
        price: Number,
        variation: String,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    notes: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Delivery/Order Schema and Model
const deliverySchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    products: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 5.00 },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'processing' },
    createdAt: { type: Date, default: Date.now }
});
const Delivery = mongoose.model('Delivery', deliverySchema);

// Product API routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product' });
    }
});

// Service API routes
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find({ active: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Appointment API routes - FIXED VERSION with logs
app.post('/api/appointments', async (req, res) => {
    try {
        console.log('=== APPOINTMENT REQUEST RECEIVED ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const requiredFields = ['customerName', 'email', 'phone', 'date', 'time'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const appointmentData = {
            customerName: req.body.customerName,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            services: req.body.services || [],
            totalAmount: req.body.totalAmount || 0,
            notes: req.body.notes || '',
            status: 'pending'
        };

        console.log('Processed appointment data:', appointmentData);

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();
        
        console.log('=== APPOINTMENT SAVED SUCCESSFULLY ===');
        console.log('Saved appointment ID:', savedAppointment._id);
        
        res.status(201).json({ 
            success: true, 
            appointment: savedAppointment,
            message: 'Appointment booked successfully!' 
        });
        
    } catch (error) {
        console.error('=== APPOINTMENT SAVE ERROR ===');
        console.error('Error details:', error);
        
        res.status(400).json({ 
            success: false,
            error: 'Failed to book appointment: ' + error.message
        });
    }
});

app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Debug route to check appointments collection
app.get('/api/debug/appointments', async (req, res) => {
    try {
        const count = await Appointment.countDocuments();
        const recentAppointments = await Appointment.find().sort({ createdAt: -1 }).limit(5);
        
        res.json({ 
            collectionExists: true, 
            totalAppointments: count,
            recentAppointments: recentAppointments,
            message: 'Appointments collection is working correctly'
        });
    } catch (error) {
        res.status(500).json({ 
            collectionExists: false, 
            error: error.message 
        });
    }
});

// Delivery/Order API routes
app.post('/api/deliveries', async (req, res) => {
    try {
        const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        const deliveryData = {
            ...req.body,
            orderId: orderId
        };
        
        const delivery = new Delivery(deliveryData);
        await delivery.save();
        
        res.status(201).json({ 
            success: true, 
            delivery,
            message: 'Order placed successfully!' 
        });
    } catch (error) {
        res.status(400).json({ error: 'Failed to place order' });
    }
});

app.get('/api/deliveries', async (req, res) => {
    try {
        const deliveries = await Delivery.find().sort({ createdAt: -1 });
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
});

app.get('/api/deliveries/:orderId', async (req, res) => {
    try {
        const delivery = await Delivery.findOne({ orderId: req.params.orderId });
        if (!delivery) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Start server after all routes defined
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});