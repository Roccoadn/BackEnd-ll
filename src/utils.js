import multer from 'multer';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/public/img');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
}); 

export const upload = multer({ storage });

export default __dirname;

