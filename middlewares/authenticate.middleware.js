const jwt = require('jsonwebtoken')
require("dotenv").config()
const fs = require('fs');

const authenticate = async (req, res, next) => {
    try {
        const token = res.locals.normaltoken || req.cookies.normaltoken || req.headers.authorization
        console.log(token)

        const data = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))

        if (data.includes(token)) {
            res.send("login again ")
        } else {
            if (token) {
                const decoded = jwt.verify(token, process.env.normalkey)
                if (decoded) {
                    res.locals.userId = decoded.userId;
                    next()
                } else {
                    res.send({msg:"login again",status:"faild"})
                    console.log("again login")
                }
            } else {
                res.send({msg:"login again",status:"faild"})
                console.log("again login....")
            }
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}
module.exports = { authenticate }

