const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt')

const registerUser = async (req, res = express.response) => {

    const { email, password } = req.body;

    try {

        //if user already exists throws an 400
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email has an assigned account'
            });
        }

        user = new User(req.body);

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generate Jason Web Token
        const token = await generateJWT(user.id, user.name)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact your admin'
        })
    }

}

const loginUser = async (req, res = express.response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email doesnt have an assigned account'
            });
        }

        //Password validation
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        //Generate Jason Web Token
        const token = await generateJWT(user.id, user.name)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact your admin'
        })
    }


}

const renewToken = async (req, res = express.response) => {

    const { uid, name } = req;

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    registerUser,
    loginUser,
    renewToken
}