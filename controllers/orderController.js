import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// Add this console.log for debugging:
//console.log("Attempting to read Stripe Key:", process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// if (!process.env.STRIPE_SECRET_KEY) {
//     console.error("!!! Stripe Secret Key is undefined IN orderController.js !!!");
//     // This indicates dotenv didn't load before this file was imported/run
// }
  

// placing user order from frontend
const placeOrder = async (req, res) => {  

    const frontend_url = "http://localhost:5173" ;

    try {
        const newOrder = await orderModel({
            userId : req.user.userId ,
            items : req.body.items,
            amount : req.body.amount,
            address: req.body.address,          
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.userId , {cartData : {}});

        const line_items = req.body.items.map((item)=>({
            price_data: {
            currency: "inr",
               product_data:{
                    name:item.name
               },
               unit_amount:item.price*100,
            },
            quantity: item.quantity,
        }));   

        line_items.push({
            price_data:{
                currency: "inr",
                product_data:{ 
                    name: "Delivery Charges" 
                },
                unit_amount: 50*100// Assuming a flat delivery charge of 50 INR
            },
            quantity: 1 // Assuming one delivery charge per order
        })

        const session = await stripe.checkout.sessions.create({
            line_items : line_items ,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({ success : true , session_url : session.url}) ;


    } 
    catch (error) {
        console.log(error) ;
        res.json({ success: false, message: 'Internal Server Error Hai' });
    }
}

const verifyOrder = async (req , res) => {
    const {orderId , success} = req.body ;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId ,{payment:true});
            res.json({success : true , message :"Paid" }) ;
        }
        else{
            await orderModel.findByIdAndDelete(orderId) ;
            res.json({success : false , message :" Not-Paid" }) ;
        }
    } 
    catch (error) {
        console.log(error);
        res.json({success : false , message :"error" }) ;
    }
}

// user order for frontend
const userOrders = async (req, res)=>{
    try {
        const orders = await orderModel.find({userId : req.user.userId}) ; 
        res.json({ success : true , data:orders});
    } 
    catch (error) {
        console.log(error);
        res.json({success : false , message:"Error"});
    }
}

// to find all the user orders in admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json( {success:true , data :orders})
    }
    catch (error) {
        console.log(error);
        res.json({success:false , message:"Error"});
    }
}

export { placeOrder , verifyOrder , userOrders  ,listOrders};