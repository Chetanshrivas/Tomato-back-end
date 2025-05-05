import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';


const foodRouter = express.Router();
// image storage engine
const storage = multer.diskStorage({
// where the image will be stored   
    destination:"uploads",
    filename : (req , file, cb) => {
            return cb(null , `${Date.now()}${file.originalname}`)
     }
});
const upload = multer({storage : storage}) ;

//route
foodRouter.post("/add" , upload.single("image") , addFood) ;
foodRouter.get('/list' , listFood) ;
foodRouter.post('/remove' , removeFood) ;


// default export
export default foodRouter;
