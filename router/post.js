const express = require('express')
const router = express.Router()

const Post = require('../model/post')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError'); 

const validPost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}




router.get('/new', (req, res) =>{
    res.render('./share/new')
})

router.post('/new', validPost,catchAsync(async(req, res) =>{
    const post = new Post(req.body)
    await post.save()
    .then(() => {
        console.log("Data save SuccessFull")
    }).catch(() => {
        console.log("Data NOt Save")
    })
    res.redirect("/show")
   
}))

router.get('/show', async(req, res) =>{
    const posts = await Post.find()
     res.render('./share/show', {posts})
})

router.get('/show/:id/', catchAsync(async(req, res) =>{
    const post = await Post.findById(req.params.id).populate('comments');
     res.render('./share/details', {post})
}))

router.get('/show/:id/edit', catchAsync(async(req, res) =>{
    const post = await Post.findById(req.params.id) 
    res.render('./share/edit', {post})
}))

router.put('/show/:id', validPost,async(req, res) => {
const { id } = req.params;
const data = await Post.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/show`);
})

router.delete('/show/:id', async (req, res) => {
    const { id } = req.params;
    const data = await Post.findByIdAndDelete(id);
    res.redirect('/show');
  })


module.exports = router