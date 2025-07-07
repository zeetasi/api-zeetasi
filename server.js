const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: 'http://zeetasi-chiphost.web.id',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const uploadPath = path.join(__dirname, 'public', 'uploads');

const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('imageUpload');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Hanya file gambar yang diizinkan!');
    }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ error: 'Tidak ada file yang dipilih!' });
            } else {
                console.log(`File berhasil diunggah: ${req.file.filename}`);
                res.status(200).json({
                    message: 'File berhasil diunggah!',
                    url: `/uploads/${req.file.filename}`
                });
            }
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
})
