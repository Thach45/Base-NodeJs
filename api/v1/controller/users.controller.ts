import { Request, Response } from "express";
import User from "../../../model/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ShowUser } from "../../../type/user";
import dotenv from "dotenv";

dotenv.config();
export const register = async  (req: Request, res: Response): Promise<void> =>  {

    const { email, password } = req.body;
    
    const existEmail = await User.findOne({ email }).lean<ShowUser>();
    
    
    if (existEmail ) {
         res.status(400).json({
            status: 'error',
            message: 'Email already exists',
        });
        return
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword,
        role: 'user'
    });
   
    newUser.save()
        .then(() => {
            res.status(201).json({
                status: 'success',
                message: 'User registered successfully',
                data: {
                    email: newUser.email,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt
                }
            });
        })
        .catch((error: any) => {
            res.status(500).json({
                status: 'error',
                message: 'Error registering user',
                error: error.message
            });
        });
}
    
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const auth = await User.findOne({ email }).lean<ShowUser>();
    if (!auth) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid email or password',
        });
        return
    }
    if (!auth || !(await bcrypt.compare(password, auth.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return
      }
    if(auth && await bcrypt.compare(password, auth.password)) {
        const accessToken = jwt.sign({
            id: auth._id,
            role: auth.role
        }, 
        process.env.JWT_ACCESS_TOKEN as string, 
        { expiresIn: '20S' });
        const  refreshToken = jwt.sign({
            id: auth._id,
            role: auth.role
        }, 
        process.env.JWT_REFRESH_TOKEN as string, 
        { expiresIn: '365d' });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: {
                email: auth.email,
                role: auth.role,
                accessToken: accessToken,
            }
        });
    }
    
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string, (err: any, user: any) => {
        if (err) {
            console.log(err);
            res.status(403).json({ message: "Forbidden" });
            return
        }
        const accessToken = jwt.sign({
            id: user.id,
            role: user.role
        }, 
        process.env.JWT_ACCESS_TOKEN as string, 
        { expiresIn: '20s' });
        const newRefreshToken = jwt.sign({
            id: user.id,
            role: user.role
        },
        process.env.JWT_REFRESH_TOKEN as string,
        { expiresIn: '365d' });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.status(200).json({
            status: 'success',
            message: 'User refresh token successfully',
            data: {
                accessToken: accessToken,
            }
        });
    });
}

export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');
    res.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
    });
    return
}