const jwt = require('jsonwebtoken');
type JwtPayload = import('jsonwebtoken').JwtPayload;
type Secret = import('jsonwebtoken').Secret;
type SignOptions = import('jsonwebtoken').SignOptions;

import { env } from './env';

export const generateToken = (userId: number): string => {
    const options: SignOptions = { expiresIn: 24 };

    return jwt.sign(
        { userId }, 
        env.JWT_SECRET as Secret, 
        options
    );
};

export const verifyToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, env.JWT_SECRET as Secret);
};
