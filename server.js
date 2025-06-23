require('dotenv').config({ path: 'src/.env' });

const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001; // Было 3000
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Define Mongoose Schema
const applicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    birthDate: { type: String },
    age: { type: Number },
    citizenship: { type: String },
    address: { type: String },
    institution: { type: String },
    specialty: { type: String },
    course: { type: Number },
    studyForm: { type: String },
    gpa: { type: Number },
    studyInterest: { type: String },
    howKnow: { type: String },
    practiceBenefits: { type: String },
    previousPractice: { type: String },
    internetResearch: { type: String },
    clientOrders: { type: String },
    teamwork: { type: String },
    practiceExpectations: { type: String },
    supplierMonitoring: { type: String },
    skills: [{ type: String }],
    practiceActivities: { type: String },
    hobbies: { type: String },
    practicalExperience: { type: String },
    professionalTasks: { type: String },
    socialMedia: { type: String },
    futureVision: { type: String },
    exhibitions: { type: String },
    adDesign: { type: String },
    printMaterials: { type: String },
    creativeConcepts: { type: String },
    threeDExperience: { type: String },
    printPrep: { type: String },
    multitasking: { type: String },
    emailCampaigns: { type: String },
    coldCalling: { type: String },
    contractExperience: { type: String },
    excelSkills: { type: String },
    printerSkills: { type: String },
    souvenirs: { type: String },
    writingExperience: { type: String },
    editingSkills: { type: String },
    logoDesign: { type: String },
    magazineCovers: { type: String },
    businessCards: { type: String },
    workExperience: { type: String },
    previousJobs: { type: String },
    likesToDo: { type: String },
    interestedInJob: { type: String },
    internshipPeriod: { type: String },
    submissionDate: { type: String },
    signature: { type: String },
    interviewer: { type: String },
    photo: { type: String }, // Base64 encoded photo
    submittedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// Configure Multer for temporary file storage
const TEMP_UPLOADS_DIR = path.resolve(__dirname, 'temp_uploads');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.mkdir(TEMP_UPLOADS_DIR, { recursive: true });
            console.log(`Temporary folder created/exists: ${TEMP_UPLOADS_DIR}`);
            cb(null, TEMP_UPLOADS_DIR);
        } catch (err) {
            console.error('Error creating temporary folder:', err);
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
    }
});

require('dotenv').config({ path: './.env' }); // Add explicit path

console.log('Environment variables:', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? '***' : 'MISSING' // Don't log actual URI
});

if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined');
  process.exit(1);
}

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // or your domain in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create temporary directory on startup
(async () => {
    try {
        await fs.mkdir(TEMP_UPLOADS_DIR, { recursive: true });
        console.log(`Temporary directory created: ${TEMP_UPLOADS_DIR}`);
    } catch (err) {
        console.error('Error creating temporary directory:', err);
        process.exit(1);
    }
})();

// API Endpoint
app.post('/api/application', upload.single('photo'), async (req, res) => {
    console.log('Received form data:', req.body);
console.log('Received file:', req.file);
    try {
        console.log('=== Processing /api/application request ===');
        console.log('Form data:', JSON.stringify(req.body, null, 2));
        console.log('File:', req.file);

        // Validate required fields
        if (!req.body.fullName || !req.body.phone) {
            console.log('Error: Missing fullName or phone');
            return res.status(400).json({
                error: 'Full name and phone number are required'
            });
        }

        // Convert photo to Base64 if uploaded
        let photoBase64 = null;
        if (req.file) {
            console.log('Reading photo file:', req.file.path);
            const photoBuffer = await fs.readFile(req.file.path);
            photoBase64 = `data:${req.file.mimetype};base64,${photoBuffer.toString('base64')}`;
            // Clean up temporary file
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting temp file:', err));
            console.log('Photo converted to Base64');
        }

        // Prepare application data
        const applicationData = {
            ...req.body,
            skills: Array.isArray(req.body.skills) ? req.body.skills : req.body.skills ? [req.body.skills] : [],
            photo: photoBase64,
            submittedAt: new Date()
        };

        // Save to MongoDB
        console.log('Saving to MongoDB...');
        const application = new Application(applicationData);
        const savedApplication = await application.save();
        console.log('Application saved, ID:', savedApplication._id);

        console.log('=== Request processing complete ===');
        res.status(201).json({
            success: true,
            message: 'Application successfully saved',
            applicationId: savedApplication._id.toString()
        });
    } catch (error) {
        console.error('Error saving application:', error);
        // Clean up temporary file if exists
        if (req.file && await fs.access(req.file.path).then(() => true).catch(() => false)) {
            await fs.unlink(req.file.path).catch(err => console.error('Error deleting temp file:', err));
        }
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handling middleware
// В server.js измените настройки CORS:
app.use(cors({
    origin: 'http://localhost:3000', // или ваш домен в production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});