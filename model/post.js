const mongoose = require('mongoose')
const Comment = require('./comment')
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        requird: true
    },
    post: {
            type: String,
            requird: true
    
        },

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    })



    postSchema.post('findOneAndDelete', async function (doc) {
        if (doc) {
            await Comment.deleteMany({
                _id: {
                    $in: doc.comments
                }
            })
        }
    })


module.exports = new mongoose.model('Post', postSchema)