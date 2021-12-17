const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', async (req, res)=>{
    const posts = await Post.find({});
    res.send(posts);
})

router.post('/', async (req, res)=>{
    console.log(req.body);
    const post = new Post({
      text: req.body.text || 'Default text',
      usersName: req.body.usersName || "Noname",
      data: Date(),
    })
    await post.save();
    console.log(post)
    return res.json(post);
})

router.put('/:id', async (req, res)=>{
    const post = await Post.findById(req.params.id);
        if(post){
            post.text = req.body.text;
            post.usersName = req.body.usersName ;
        } 
    await post.save();
    return res.json(post);
})

router.delete('/:id', async (req,res)=>{
    const post = await Post.findById(req.params.id);
        if(post){
              await post.delete();
                return res.send(`Post id ${post.id} was deleted!`).status(200);
        } else return res.send('Error').status(400)
})
module.exports = router;