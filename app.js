const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Post = require('./Post');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/blogposts');

app = express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extented: true}))

app.get("/", function(req, res){
    Post.find({}, function(err, posts){
        if (!err) {
            res.render('home', {posts,})
        }
    })
    
})

app.get("/compose", function(req, res){
    res.render('compose')
})
app.post("/compose", function(req, res){
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title,
        content,
        url: title,
    })
    post.save();

    res.redirect("/")
})

app.get("/posts/:post", function(req, res){
    const title = req.params.post;
    Post.find({title}, function(err, doc){
        if (err) res.send(err);
        else {
            res.render('post', {postInfo: doc[0],})
        }
    })
})

app.get("/delete/:post", function(req, res){
    const postTitle = req.params.post

    Post.findOneAndRemove({title: postTitle}, function(err, doc){
        // if (err) console.log(err);
        // else console.log(doc);
        null;
    })

    res.redirect("/");
})

app.get("/edit/:post", function(req, res){
    const title = req.params.post;
    console.log(title)
    Post.find({title}, function(err, doc){
        if (err) res.send(err);
        else {
            res.render('edit', {postInfo: doc[0],})
        }
    })
})

app.post("/edit/:post", function(req, res){
    const postTitle = req.params.post;


    const newTitle = req.body.newTitle;
    const newContent = req.body.newContent;

    // Post.findOneAndUpdate({title: postTitle}, {
    //     title: newTitle
    // })
    // this does not work

    res.redirect("/")
})


app.listen(3000, '192.168.0.100', function(err){
    if (err) console.log(err)
})