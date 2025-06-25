require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Явное указание базы данных в URI
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://anketa:wwwwww@cluster0.cnnbdke.mongodb.net/anketa_db?retryWrites=true&w=majority';

console.log('Connecting to MongoDB with URI:', MONGODB_URI);

// Подключение к MongoDB с улучшенным логированием
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Current database:', mongoose.connection.name);
    console.log('Collections:', Object.keys(mongoose.connection.collections));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Схема с явным указанием коллекции
const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  // ... все остальные поля
}, { 
  strict: false,
  collection: 'applications' // Явное указание имени коллекции
});

const Application = mongoose.model('Application', applicationSchema);

// Улучшенный эндпоинт с проверкой сохранения
app.post('/api/application', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    const newApp = new Application(req.body);
    const savedApp = await newApp.save();
    
    // Проверка что документ действительно сохранен
    const foundApp = await Application.findById(savedApp._id);
    if (!foundApp) {
      throw new Error('Document not found after saving');
    }
    
    console.log('Verified saved document:', foundApp);
    
    res.status(201).json({
      success: true,
      data: foundApp
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Тестовый эндпоинт для проверки
app.get('/api/test', async (req, res) => {
  try {
    const count = await Application.countDocuments();
    const docs = await Application.find().limit(5);
    res.json({ count, docs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Статическая папка для production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Обработка несуществующих роутов
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});