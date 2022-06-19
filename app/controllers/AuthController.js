const bcrypt = require('bcrypt')
const User = require("../models/User")
const userQuery = require('../models/userQuery')
const authMethod = require('../auth/auth.method')

const randToken = require('rand-token')

class Auth {
    register = async (req, res) => {
        const email = req.body.email.toLowerCase()
        const user = await userQuery.getUser(email)

        if (user.length) return res.status(409).send({ name: 'email', message: 'Tài khoản đã tồn tại' })
        else {
            const saltRounds = 10;
            const password = bcrypt.hashSync(req.body.password, saltRounds)
            // const password = bcrypt.hash(req.body.password, saltRounds)
            const newUser = new User({
                email,
                password,
                level: 1,
                phone: 0,
                avatar: 'avatar.png',
                birthDay: '',
                bookmark: [],
                voted: [],
            })

            const createUser = await userQuery.createUser(newUser)
            if (!createUser) {
                return res.status(400).send({ name: 'email', message: 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại' });
            }
            return res.status(201).send({
                email,
            });
        }
    }


    login = async (req, res) => {
        const email = req.body.email.toLowerCase()
        const password = req.body.password

        const getUser = await userQuery.getUser(email)
        console.log('getUser', getUser)
        if (!getUser.length) {
            return res.status(401).send({ name: 'email', message: 'Tài khoản không tồn tại!' })
        } else {
            const user = JSON.parse(JSON.stringify(getUser[0]));

            const hash = user.password
            const isPasswordValid = bcrypt.compareSync(password, hash)
            // const isPasswordValid = bcrypt.compare(password, hash)

            if (!isPasswordValid) {
                return res.status(401).send({ name: 'password', message: 'Mật khẩu không chính xác!' });
            }

            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

            const dataForAccessToken = {
                email: user.email,
            }

            const accessToken = await authMethod.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            )

            if (!accessToken) {
                return res.status(401).send({ message: 'Đăng nhập không thành công, vui lòng thử lại!' });
            }

            let refreshToken = randToken.generate(process.env.REFRESH_TOKEN_SIZE); // tạo 1 refresh token ngẫu nhiên
            if (!user.refreshToken) {
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                console.log("Update Token refresh")
                await userQuery.updateRefreshToken(user.email, refreshToken);
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = user.refreshToken;
            }


            delete user['password']
            return res.json({
                message: 'Đăng nhập thành công!',
                accessToken,
                refreshToken,
                user,
            });
        }
    }

    refreshToken = async (req, res) => {
        const accessTokenFromHeader = req.headers.x_authorization
        if (!accessTokenFromHeader) res.status(400).send('Không tìm thấy access token!')

        const refreshTokenFromBody = req.body.refreshToken
        if (!refreshTokenFromBody) res.status(400).send('Không tìm thấy refresh token!')

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE

        const decoded = await authMethod.decodeToken(accessTokenFromHeader, accessTokenSecret)

        if (!decoded) res.status(400).send('Access token không hợp lệ.')

        const email = decoded.payload.email;
        const getUser = await userQuery.getUser(email)
        const user = JSON.parse(JSON.stringify(getUser[0]));

        if (!user) {
            res.status(401).send('User không tồn tại.')
        }

        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token không hợp lệ.')
        }

        const dataForAccessToken = {
            email,
        }

        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        )

        if (!accessToken) {
            return res.status(400).send('Tạo access token không thành công, vui lòng thử lại.');
        }

        return res.json({
            accessToken,
        });
    }

    authTokenLogin = async (req, res) => {
        const accessToken = req.body.accessToken
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

        if (!accessTokenSecret) return res.status(401).send({ message: 'Không tìm thấy access token' })

        const verified = await authMethod.verifyToken(accessToken, accessTokenSecret)


        if (!verified) return res.status(401).send({ message: 'Đăng nhập đã hết hạn sau 20 ngày, vui lòng đăng nhập lại' })

        const getUser = await userQuery.getUser(verified.payload.email)
        const user = JSON.parse(JSON.stringify(getUser[0]));
        delete user['password']
        return res.send({ message: 'Đã xác thực', user })
    }
}

module.exports = new Auth