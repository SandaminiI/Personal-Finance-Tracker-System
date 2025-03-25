import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        password,
        currency
      } = req.body;
  
      //validation
      if (!name) {
        return res.send({ message: "First name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!phone) {
        return res.send({ message: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ message: "Address1" });
      }
      if (!password) {
        return res.send({ message: "A password is Required" });
      }

      //Check user
      const existingUser = await userModel.findOne({ email });
      //Existing user
      if (existingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Registered please Login",
        });
      }

      //register user
      const hashedPassword = await hashPassword(password);
  
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        currency: currency || "LKR"
      }).save();
  
      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Registration",
        error,
      });
    }
  };
  

//POST LOGIN
export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: true,
          message: "Email is not registered",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid password",
        });
      }
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          currency: user.currency,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };

  //test controller
export const testController = (req, res) => {
    try {
      res.send("Protected Routes");
    } catch (error) {
      console.log(error);
      res.send({ error });
    }
  };