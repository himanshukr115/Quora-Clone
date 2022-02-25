const express = require('express')
const router = express.Router()

const Post = require('../model/post')
const Comment = require('../model/comment')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError'); 
const { postSchema, reviewSchema } = require('../schemas.js');

const validCommnet = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/show/:id/comment',validCommnet, async(req, res) =>{
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body);
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/show/${post._id}`);
})

router.delete('/show/:id/comments/:commentId', catchAsync(async (req, res) => {
 const {id , commentId}    = req.params;
    await Post.findByIdAndUpdate(id, {$pull: {comments : commentId}})
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/show/${id}`)
}))


module.exports = router