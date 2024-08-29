const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const userController = {}

userController.register = async(req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    try{
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)
    } catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

userController.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
        const user = await User.findOne({ email: body.email });
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password);
            if (isAuth) {
                const tokenData = { id: user._id };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token, profile: user });
            }
            return res.status(404).json({ errors: 'invalid email/password' });
        }
        res.status(404).json({ errors: 'invalid email/password' });
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};


userController.profile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

userController.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;

        // If password is provided, hash it
        if (body.password) {
            const salt = await bcryptjs.genSalt();
            const hash = await bcryptjs.hash(body.password, salt);
            body.password = hash;
        } else {
            // Remove the password field if it's not provided
            delete body.password;
        }

        // Update the user profile
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            body,
            { new: true, runValidators: true } // Ensure validation on update
        );

        // Ensure the updated user object includes the profile picture URL
        const updatedUser = await User.findById(req.user.id);

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};


userController.checkEmail=async(req,res)=>{
    const email=req.query.email
    const user=await User.findOne({email:email})
    if(user){
       res.json({'is_email_registered':true})
    }else{
       res.json({'is_email_registered':false})
    }
 }

module.exports = userController