const express =  require('express');
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('./../jwt')
const User = require('./../models/user')

router.post('/signup', async (req, res)=>{

    try{
        const data = req.body // Assuming the request body contains the User data

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digits
        const aadharCardNumber = data.addharCardNumber.trim();
        if (!/^\d{12}$/.test(aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }


        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ addharCardNumber: data.addharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server error"});
    }
})

// Login router

router.post('/login', async(req, res)=>{
    try{
        const {addharCardNumber, password} = req.body;
        const user = await User.findOne({addharCardNumber: addharCardNumber});

    if(!user || !comparePassword(user)){
        return res.status(401).json({err: "Invalid user or passowrd"});
    }

    const payload = {
        id: user.id,
    }

    const token = generateToken(payload);

    res.json({token});

    }catch(err){
        console.log(err);
        res.status(401).json({err:"Inavlid token"});
    }
})

//profile Route
router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try{
        const userData = req.userData;
        
        const userId = userData.id;
        const user = await user.findById(userId);

        res.status(200).json({user});

    }catch(err){
        console.log(err);
        res.status(401).json({err: "Id not found"});
    }
})


router.put('/profile/password', jwtAuthMiddleware, async (req, res)=>{
    try{
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });

    }catch(err){
        console.log("Error", err);
        res.status(500).json({error: "error"});
    }
})



module.exports = router; 
