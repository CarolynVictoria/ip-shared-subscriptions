import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Directory to save files
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`); // Rename the file
	},
});

const upload = multer({ storage });

// Ensure the 'uploads' directory exists
if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads');
}

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
	console.log(req.file); // Log info about the uploaded file
	res.send({ message: 'File uploaded successfully', file: req.file });
});

app.get('/', (req, res) => {
	res.send('Backend is running!');
});

// set up test data
app.get('/api/resource', (req, res) => {
	const sampleData = [
		{ id: 1, name: 'Item 1', description: 'This is item 1' },
		{ id: 2, name: 'Item 2', description: 'This is item 2' },
		{ id: 3, name: 'Item 3', description: 'This is item 3' },
	];
	res.json(sampleData);
});

// Start the server
const PORT = 5555;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
