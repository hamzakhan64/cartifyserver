

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Final check log
console.log('☁️ Cloudinary Configuration Active:', {
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    key_last_4: process.env.CLOUDINARY_API_KEY ? `***${process.env.CLOUDINARY_API_KEY.slice(-4)}` : 'MISSING'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cartify-products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
