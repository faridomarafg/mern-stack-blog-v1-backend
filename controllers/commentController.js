const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

//Create comment on post
const createComment = asyncHandler(async (req, res)=>{
    //find post id to comment on that;
    const postId = await Post.findById(req.params.id);
    
    //take comment data from client
    const comment = req.body;

    //Create and save comment!
    const newComment = new Comment({
        ...comment,
     post:postId, 
     user: req.user._id
    });

    await newComment.save();
    res.status(201).json(newComment);
});


// get all comments from post
const getComments = asyncHandler(async(req, res) => {
    
    const comments = await Comment.find({post: req.params.postId}).populate("user", '-password').populate('post','-photo');
    
    if(comments){
        return res.status(200).json(comments); 
    }else{
        return res.status(400).json({message:'Something went wrong!'})
    }
});


//Delete Comment
// const deleteComment = asyncHandler(async (req, res)=>{
//     //Find comment to delete it
//     const comment = await Comment.findById(req.params.id);

//     //check user to delete it's own comment;
//     if(comment.user.toString() === req.user._id.toString()){
//         await comment.deleteOne();
//         return res.status(200).json({message:'comment deleted'})
//     }else{
//         return res.status(401).json({message:'You cand delete your own Comment'})
//     }
// });

const deleteComment = asyncHandler(async (req, res)=>{
    //Find comment to delete it
    const comment = await Comment.findById(req.params.id);

    //check user to delete it's own comment;
    if(comment.user.toString() === req.user._id.toString()){
        await comment.deleteOne();
        return res.status(200).json({message:'comment deleted'})
    }else{
        return res.status(401).json({message:'You cand delete your own Comment'})
    }
});


module.exports ={
    createComment,
    getComments,
    deleteComment
}