const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session')
const path = require('path')

const Post = require('./model/post')
const Comment = require('./model/comment')



const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
const { postSchema, reviewSchema } = require('./schemas.js');

const postRouter = require('./router/post');
const commentRouter = require('./router/comment');
const userRouter = require('./router/user');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError'); 

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))




mongoose.connect('mongodb://localhost:27017/thought')
.then(() => {
    console.log("Connection SuccessFull")
}).catch(() => {
    console.log("Database NOt Connect")
})


const validPost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validCommnet = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



app.get('/', (req, res) =>{
    res.render('index')
})

app.use('/', postRouter)
app.use('/', commentRouter)
app.use('/', userRouter)




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log('Server is Running on 3000')
})