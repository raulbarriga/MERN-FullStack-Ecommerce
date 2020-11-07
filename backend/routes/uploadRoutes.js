import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();
// import { protect, admin } from "../middleware/authMiddleware.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); //null is for the error & the 2nd argument is where the uploads'll be stored
  },
  filename(req, file, cb) {
    //the 2nd argument is what the file(s)'ll be called
    //we're gonna keep the extension that the uploaded image has, so we use the path module from node.js (we have to import path above first though)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); //we're including the case if 2 files that are uploaded have the same name
  },
});

function checkFileType(file, cb) {
  //first we create an expression w/ the files tyoes we want:
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); //we're gonna text if the path.extname (the uploaded file's extension) passes the above filetypes expression variable
  //we also check the mime type (every file has this, e.g. a jpeg is image/jpeg)
  const mimetype = filetypes.test(file.mimetype); //it has to have one of the extensions in the filetypes variable expression above

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only"); //this is an error that we pass
  }
}

//this is what we're gonna use for middleware for multer
const upload = multer({
  storage, // allows to upload ANY file type, but we don't want that so below we filter certain file types:
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

//The above code is the config, below we create the route
//we just use '/' here b/c this uploadRoutes file's gonna be connected to /api/upload
//if the frontend, remember to call 'image' that we pass here inside .single('image')
router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`); //all we send back is the path
}); //we pass upload as middleware, & on it we can do multiple images if we wanted to, but we're just gonna do 1 image w/ .single()

export default router;
