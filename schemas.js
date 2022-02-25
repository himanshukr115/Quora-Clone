const Joi = require('joi');

module.exports.postSchema = Joi.object({
   
        title: Joi.string().required().min(3).max(100),
        post: Joi.string().required().min(10).max(500)
        
    }).required()
    

module.exports.reviewSchema = Joi.object({
   
        comment: Joi.string().required().min(3).max(30),
        
        
    }).required()