import bcrypt from 'bcrypt';
import { findByUsernameOrEmail } from './user.service';
import {findHostByEmail} from './host.service';
import { Response } from 'express';
import { findPartner } from './partner.service';


const loginUser = async ({ usernameOrEmail, password }: { usernameOrEmail: string, password: string }): Promise<any> => {
    try {
        const user = await findByUsernameOrEmail(usernameOrEmail);
        
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            throw new Error('Incorrect password');
        }

        const { password: _, ...userWithoutPassword } = user.get({ plain: true });
        let partner = await findPartner(user.id);
        console.log("partner", partner)
        if(partner){
            return {...userWithoutPassword, partnerId: partner.id};
        }
       
        return userWithoutPassword;
    } catch (err) {
        throw new Error((err as Error).message || ''); 
    }
};

const loginHost = async ({ email, password }: { email: string, password: string }): Promise<any>=> {
    try {
        const host = await findHostByEmail(email);
        
        if (!host) {
            throw new Error('Host not found');
        }
        const isMatch = await bcrypt.compare(password, host.password);
        
        if (!isMatch) {
            throw new Error('Incorrect password');
        }

        const { password: _, ...hostWithoutPassword } = host.get({ plain: true });

        return hostWithoutPassword;
    } catch (err) {
        throw new Error((err as Error).message || ''); 
    }
};

const clearToken = (res: Response): void => {
    res.clearCookie(process.env.USER_TOKEN_COOKIE_NAME || 'token', {
        httpOnly: true,
        sameSite: 'strict'
    });
};


const clearHostToken = (res: Response): void => {
    res.clearCookie(process.env.HOST_TOKEN_COOKIE_NAME || 'hostToken', {
        httpOnly: true,
        sameSite: 'strict'
    });
};


export {
    clearHostToken,
    loginUser,
    clearToken,
    loginHost
};