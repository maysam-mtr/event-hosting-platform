import jwt from 'jsonwebtoken'

//! Should be done on the website's backend instead
// export const generateJWT = async (payload: any, secretKey: string) => {
//     try {
//         const token = `Bearer ${jwt.sign(payload, secretKey)}`
//         return token
//     } catch (err: any) {
//         throw new Error(err.message)
//     }
// }

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