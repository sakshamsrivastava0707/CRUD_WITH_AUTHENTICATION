
const Router = require('express')
const bcrypt = require('bcryptjs')
const config = require('../../config')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
// User Model
const User = require('../../models/User')
const mongoose = require('mongoose');


const { JWT_SECRET } = config;
const router = Router();

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error('Couldnt sign the token');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/auth
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
 
  const { name, email, password ,_id} = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({
      _id : new mongoose.Types.ObjectId,
      name,
      email,
      password: hash
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    // jwt token is setup heree 
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      message: "keep the token safe with you",
      user: {
        
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data if send with proper token
 * @access  Private
 */

router.get('/user', auth, async (req, res) => {
  try {
    // this will select users data without the password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User does not exist');
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   DELETE api/auth/delete/:id
 * @desc    Delete user data if send with proper token
 * @access  Private
 */
router.delete('/delete/:id',auth, async (req,res)=> {
  const id = req.params.id;
  User.remove({_id:id},(err,result)=>{
    if(err)
    {
        console.log(err);
        res.status(500).send('error occured in deleting');
    }
    else{
        res.status(200).json({msg:"successfully deleted"});
    }} )
})

/**
 * @route  UPDATE api/auth/update/:id
 * @desc    update user data if send with proper token
 * @access  Private
 */
router.put('/update/:id', auth , async(req,res)=>{
  const {name, email, password , id} = req.body;
  console.log('is this working')
  try{
    await User.update({_id:id},{$set:{name, email, password}})
  
    return res.status(200).json({msg:"successfully updated"});

  }catch(err){
   return res.status(500).send('error occured in updatating');
  }
})


module.exports = router;
