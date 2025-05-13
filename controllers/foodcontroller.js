import foodModel from '../models/foodModel.js';
import fs from 'fs';


// add food itmes ( this is our controller function)
const addFood = async (req, res) => {
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,       
        price: req.body.price,
        category: req.body.category,
        image: req.file.path  // ✅ Cloudinary gives back a URL here
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to add food item" });
    }
};


// add all food list
const listFood = async (req , res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({ success : true, data : foods});

    } catch (error) {
        console.log(error);
        res.json({ success : false, message : "Failed to get food list" });
    }
};

//remove food item 
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

         //Optionally delete from cloudinary using:
         //const publicId = extractPublicId(food.image);
         //await cloudinary.uploader.destroy(publicId);

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to remove food item" });
    }
};


export { addFood , listFood , removeFood } ;
