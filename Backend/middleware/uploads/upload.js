
import multer from 'multer';
import path from 'path';

// Set up multer for file storage
const storage = multer.diskStorage({

 filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
 
 },
});

const upload = multer({ storage: storage });

export default upload;
