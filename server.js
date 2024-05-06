const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Product = require("./models/productModel")
const app = express()

var cors = require('cors')
app.use(cors())

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/page', function (req, res) {
  res.send('Hello Page, this is ramiahs page')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login request with email:', email); // Log the received email
  
    // Find the user by email
    const user = await Product.findOne({ email });

    console.log('Found user:', user); // Log the user object retrieved from the database

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored password hash
    console.log('Comparing password:', password, 'with stored hash:', user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid email or password');
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If the password is valid, send the user data back as response
    console.log('Login successful');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get classification
app.get('/user/classification', async (req, res) => {
  try {
    const { email } = req.query; // Extract the email from the request query
  
    // Find the user by email
    const user = await Product.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the classification from the user object (replace with your actual logic)
    const classification = user.classification;

    // Send the classification back as response
    res.status(200).json({ classification });
  } catch (error) {
    console.error('Error fetching user classification:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/change-password/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { phoneNumber, newPassword } = req.body;

    console.log('Email:', email);
    console.log('New Password:', newPassword);
    console.log('Phone Number:', phoneNumber);

    const user = await Product.findOne({ email });

    console.log('User:', user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User Phone Number:', user.phoneNumber);

    if (user.phoneNumber !== phoneNumber) {
      return res.status(403).json({ message: "Phone number does not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Hashed Password:', hashedPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({ message: 'Error changing password. Please try again.' });
  }
});



app.get('/products', async(req, res) => {
  try {
    const products = await Product.find({})
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message : error.message})
  }
})

// get a product
app.get('/products/:id', async(req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findById(id)
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message : error.message})
  }
})

app.post('/register', async (req, res) => {
  const { email, password, phoneNumber, classification } = req.body;

  // Check if all required fields are present
  if (!email || !password || !phoneNumber || !classification) {
    return res.status(400).json({ message: "Please provide all required fields (email, password, phoneNumber)" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = await Product.create({
      email,
      password: hashedPassword,
      phoneNumber,
      classification
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: error.message });
  }
});


// add a product
app.post('/product', async(req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log('Error adding product to database:', error.message);
    res.status(500).json({message : error.message})
  }
})

// update a product
app.put('/products/:id', async(req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    // cant find products in database
    if(!product){
      return res.status(404).json({message : "Cannot find product with id ${id}"})
    }
    const updatedProduct = await Product.findById(id)
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message : error.message})
  }
})

// delete a product
app.delete('/products/:id', async(req, res) => {
  try {
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id)
    // cant find products in database
    if(!product){
      return res.status(404).json({message : "Cannot find product with id ${id}"})
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message : error.message})
  }
})

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://rcurryjr:rNeqGTV8Ml0OY6LU@cluster0.omkgfxe.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  app.listen(3001, () => {
    console.log("Running on port 3001.")
  })
  console.log("Connected to mongoDB")
}) .catch (() => {
  console.log("Error connecting to MongoBD")
})