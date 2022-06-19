const User = require('../models/User')
const userQuery = require('../models/userQuery')
const authMethod = require('./auth.method')

exports.isAuth = async (req, res, next) => {
    try {
        const accessTokenFromHeader = req.headers.x_authorization


        if (!accessTokenFromHeader) return res.status(401).send({ message: 'Không tìm thấy access token' })

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

        const verified = await authMethod.verifyToken(accessTokenFromHeader, accessTokenSecret)


        if (!verified) return res.status(401).send({ message: 'Bạn không đủ quyền truy cập vào tính năng này' })
        else {
            const getUser = await userQuery.getUser(verified.payload.email)
            const user = JSON.parse(JSON.stringify(getUser[0]));
            if (user.level === 1) {
                req.user = user
                return next()
            } else return res.status(401).send({ message: 'Bạn không đủ quyền truy cập vào tính năng này' })
        }
    } catch (error) {
        return res.status(401).send({ message: 'Có lỗi xảy ra, vui lòng thử lại sau' })
    }

}
