const jwt = require('jsonwebtoken');
const db = require('../db/index')

const sign = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const sendToken = async (user, res) => {
    const token = sign(user.id_user);
    const cookieOptions = {
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    res.json({
        token,
        data: {
            user
        }
    });

}

exports.login = async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        next(new Error('Email or password was not introduced.'));
    }
    let user = await db.query('SELECT id_user,first_name,last_name,email from Users where email=$1 and password=$2', [req.body.email, req.body.password]);
    if (user.rows.length === 1) {
        user = user.rows[0];
        sendToken(user, res)
    } else {
        next(new Error('Email or password is incorrect.'))
    }
}
exports.signup = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
            next(new Error('Email, password, first_name, last_name was not introduced.'));
        }
        let user = await db.query('INSERT INTO Users(first_name,last_name,email,password) values($1,$2,$3,$4)', [req.body.first_name, req.body.last_name, req.body.email, req.body.password]);
        if (user.rowCount == 1) {
            res.json({ success: true });
        }
    } catch (err) {
        next(err);
    }
}
exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token && req.cookies.jwt) {
        token = req.cookies.jwt
    }
    if (!token) {
        return next(new Error('Not logged in.'));
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return next(err);
        }
        let user = await db.query('SELECT id_user,first_name,last_name,email from Users where id_user=$1', [decoded.id]);
        if (user.rows.length == 1) {
            req.user = user.rows[0];
            next();
        } else {
            next('User doesn\'t exist')
        }
    });
}
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return next();
                }
                db.query('SELECT id_user,first_name,last_name,email from Users where id_user=$1', [decoded.id]).then((user) => {
                    if (user.rows.length == 1) {
                        res.locals.user = user.rows[0];
                        return next();
                    } else {
                        return next();
                    }
                });
            })
        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        return next();
    }
};