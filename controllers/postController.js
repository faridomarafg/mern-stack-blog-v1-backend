const Post = require('../models/postModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');


//Create Post
const createPost = asyncHandler(async (req, res)=>{
    const post = req.body;
    const newPost = new Post({
        ...post,
        userId:req.user._id
    });
    
    await newPost.save();

    res.status(201).json(newPost);
});


//Get all posts without pagination
// const getPosts = asyncHandler(async (req, res)=>{
//     const posts = await Post.find();

//     res.status(200).json(posts)
// });


//Get all posts with pagination;
const getPosts = asyncHandler(async (req, res) => {
  const { page } = req.query;
  try {
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await Post.countDocuments({});
    const tours = await Post.find().limit(limit).skip(startIndex);
    res.json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
});

//Get post byId
const getPost = asyncHandler(async (req, res)=>{
    //find post by id
    const post = await Post.findById(req.params.id);
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message:'Post not found!'});
    }
});


//Get postByUser
const getPostByUser = asyncHandler(async (req, res)=>{
    //find user id to get post by that
    const {id} = req.params;
    
    const posts = await Post.find({creator:id});
    res.status(200).json(posts);
});

//Delete post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id)
  if(post.userId.toString() !== req.user._id.toString()){
    return res.status(401).json({message:'you can delete only your own post'})
  }
  await post.deleteOne()
  res.json({ message: "Post deleted successfully" });
});

//Update Post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if(post.userId.toString() !== req.user._id.toString()){
    return res.status(401).json({message:'you can update only your own post'})
  }
  const updatedPost = { ...req.body };
  
  await Post.findByIdAndUpdate(id, updatedPost, { new: true });
  res.json(updatedPost);

});

//Like Posts
const likePosts = asyncHandler(async (req, res)=>{
  const {id} = req.params;//post ID that we going to like that;

  if(!req.user){
    return res.status(401).json({message: 'You are not authorized to like it!'})
  }
  
  //check if the post id is valid or not;
  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({message:`No post exist with this id :${id}`});
  }

  //find post to like
  const post = await Post.findById(id);

  const index = post.likes.findIndex((id)=> id === String(req.user?._id));

  if(index === -1){
    post.likes.push(req.user?._id)
  }else{
    post.likes = post.likes.filter((id)=> id !== String(req.user?._id))
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, {new: true});
  res.status(200).json(updatedPost)
});



module.exports = {
    createPost,
    getPosts,
    getPost,
    getPostByUser,
    deletePost,
    updatePost,
    likePosts,
}