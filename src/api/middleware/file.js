import multer, { diskStorage } from 'multer';

const IMAGE_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = diskStorage({
  destination: (req, file, cb) => {
    const imageValidity = IMAGE_TYPE[file.mimetype];
    let error = new Error('Invalid type');
    if (imageValidity) {
      error = null;
    }
    cb(null, 'src/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    const extension = IMAGE_TYPE[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + extension);
  },
});

export default multer({ storage: storage }).single('image');
