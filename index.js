import express from "express";
import cors from "cors";
import mongoose from "mongoose";




const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("DB Connected");
})

const userSchema = new mongoose.Schema({
        email: String,
        password: String,
        rePassword: String,
        firstName: String,
        lastName: String,
        gender: String,
        country: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=>{
   const{email, password} = req.body;
   User.findOne({email: email}, (err, user)=>{
    if(user){
        if(password === user.password){
            res.send({message: "Login Successfull", user:user});
        }else{
            res.send({message: "password did't match"});
        }
    }else{
        res.send({message: "user not registered"});
    }
   })
})
app.post("/register", (req, res)=>{
    const {email, password, firstName, lastName, gender, country} = req.body;
    User.findOne({email: email}, (err, user)=>{
        if(user){
            res.send({message: "user already registered", user:user});
        }else {
            const user = new User({
                email,
                password,
                firstName,
                lastName,
                gender,
                country
            })
            user.save(err=>{
                if(err){
                    res.send(err);
                }else{
                    res.send({message: "Successfully Register", user:user});
                }
            })
        }
    })
    
})

app.listen(9002, ()=>{
    console.log("Be started on port 9002");
})
