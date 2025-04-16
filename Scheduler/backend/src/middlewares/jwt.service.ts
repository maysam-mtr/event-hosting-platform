import jwt from 'jsonwebtoken'

export const verifyJWT = async (
    token: string,
    secretKey: string,
): Promise<jwt.JwtPayload> => {
    try {
        const cleanToken = token.replace("Bearer ", '')
        const data = jwt.verify(cleanToken, secretKey)

        if (typeof data === 'string')
            throw new Error('Invalid token payload')

        return data as jwt.JwtPayload
    } catch (err: any) {
        throw new Error(err.message)
    }
}