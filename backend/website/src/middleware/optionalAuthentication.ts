import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const optionalAuth = (req: Request & { [key: string]: any }, res: Response, next: NextFunction) => {
    // Attempt to retrieve token from Authorization header or cookies
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    console.log("Received Authorization header:", req.header('Authorization'));
    console.log(process.env.JWT_SECRET as string)
  
    console.log("User:",(req as any).user);
    console.log(token)
    
    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Decoded token:",decoded);
        (req as any).user = decoded;
        console.log("User:",(req as any).user);
    } catch (error) {
        console.log("Invalid token, proceeding without authentication");
    }
    
    next();
};

const optionalHostAuth = (req: Request & { [key: string]: any }, res: Response, next: NextFunction) => {
    // Attempt to retrieve token from Authorization header or cookies
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.hostToken;
    console.log("Received Authorization header:", req.header('Authorization'));
    console.log("host token",req.cookies?.hostToken);   
    console.log(process.env.JWT_SECRET_HOST as string)
    console.log("token",token)

    console.log("Host user:",(req as any).hostUser);

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_HOST as string);
        console.log("Decoded token:",decoded);
         (req as any).hostUser = decoded;
        console.log("Host user:",(req as any).hostUser);
       
    } catch (error) {
        console.log("Invalid token, proceeding without authentication");
    }
    
    next();
};


export {optionalAuth,optionalHostAuth};
