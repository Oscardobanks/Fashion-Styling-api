import jwt from 'jsonwebtoken'
import { CreateError } from './error.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) return next(CreateError(401, "Access Denied!"))
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (err) {
        return next(CreateError(401, "Access Denied!"))
    }
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return next(CreateError(401, "Access Denied!"))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next()
        } else {
            return next(CreateError(401, "Access Denied!"))
        }
    })
}