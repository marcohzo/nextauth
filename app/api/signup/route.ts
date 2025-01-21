import { NextResponse } from "next/server";
import User from '../../libs/mongo/models/user';
import bcrypt from 'bcryptjs';
import {connectDB} from '../../libs/mongo';


const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10) || 12;

export async function POST(request: Request){
    try {
    const {username, email, password} = await request.json()   
    if (!username || !email || !password) {
        return NextResponse.json({message: "All fields are required"}, {status: 400});
    }
    if (password.length < 8) {
        return NextResponse.json({message: "Password must be at least 8 characters long"}, {status: 400});
    }
    await connectDB();
    const userFound = await User.findOne({username});
    if (userFound) {
        return NextResponse.json({message: "User already exists"}, {status: 400});
    }
    const emailFound = await User.findOne({email});
    if (emailFound) {
        return NextResponse.json({message: "Email already exists"}, {status: 400});
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const newUser = new User({username, email, password: hashedPassword});
    const savedUser = await newUser.save();
    console.log(savedUser);
    return NextResponse.json(savedUser); 
   } catch (error) {
    console.log(error);
    return NextResponse.json({message: "Something went wrong"}, {status: 500});
   }
}