import userModel from '../models/userModel.js'

// add item to user's shopping cart
const addToCart = async (req , res)=>{
   try {
    //console.log(req.body.userId) ;
    let userData = await userModel.findById(req.user.userId) ; 
       if (!userData) {
       return res.json({ success: false, message: 'User not found' });
         }

        let cartData = userData.cartData || {};

     if( !cartData[req.body.itemId]){
        cartData[req.body.itemId] = 1 ;
     }
     else{
        cartData[req.body.itemId] += 1;
     }
    await userModel.findByIdAndUpdate(req.user.userId , {cartData}) ;
    res.json({ success : true , message: 'Item added to cart successfully' });

    }
    catch (error) {
        console.log(error) ;
        res.json({ success: false, message: 'Failed to add item to cart' });
        
    }
}

// remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        //console.log(req.body.userId) ;
        let userData = await userModel.findById(req.user.userId) ;
        let cartData = await userData.cartData ;
        if(cartData[req.body.itemId] > 0 ){
            cartData[req.body.itemId] -= 1 ;   
        }
        await userModel.findByIdAndUpdate( req.user.userId , {cartData} );
        res.json({ success: true, message: 'Item removed from cart successfully' });
    } 
    catch (error) {
        console.log(error); 
        res.json({ success: false, message: 'Failed to remove item from cart' }); 
    }

}


// fetch user cart data
const getCart = async (req , res) => {
    try {      
        //console.log(req.user.userId) ;
        let userData = await userModel.findById(req.user.userId) ;
        let cartData = await userData.cartData || {} ;
        res.json({ success: true ,cartData})
    } 
    catch (error) {
        console.log(error); 
        res.json({ success: false , message: 'Failed to fetch cart data' });
    }
}

export { addToCart, removeFromCart, getCart }