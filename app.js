//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "“Life moves pretty fast. If you don’t stop and look around once in a while, you could miss it.” ~ Ferris Bueller";
const homeSecondParagraph = "Writing a journal is a great way to unleash your creativity. Everyone has the potential to be creative, just that most of us haven’t discovered it yet. Your journal is the best place to start exploring your inner creativity. Write down anything that comes to your mind. Let your imaginations run wild and record it in Journey.";
const aboutContent = "Hello! this is a write your journal web-app developed by me, by using NodeJS and MongoDB as a project to write in my resume, but I guess you can use it to document your daily ideas and experiences.";
const contactContent = "You can contact me on ";

const app = express();

//posts array for holding all the posts
//let posts =[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

//MONGOOSE DATA BASE CONNECTION
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const postSchema = {
  date: Date,
  title: String,
  content: String
};
//MONGOOSE Model schema
const Post = mongoose.model("Post", postSchema);

//Static file storage
app.use(express.static("public"));

//Serving the home page
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      homeSecondParagraph: homeSecondParagraph,
      posts: posts
    });
  });
});

//Serving the about us page
app.get("/about", function(req, res) {
  res.render("about", {
    aboutText: aboutContent
  });
});

//Serving the contact us page
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactText: contactContent
  });
});

//Serving the COMPOSE page
app.get("/compose", function(req, res) {
  res.render("compose");
});

//It comes here when something gets published
app.post("/compose", function(req, res) {
  // var date  = new Date(req.body.postDate);
  // date = date.toDateString().split(' ').slice(1).join(' ') ;
  const post = new Post({
    date: req.body.postDate,
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //Pushing inside posts array
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

  //Redirecting to home page where all the posts can be seen
  //res.redirect("/");
});


//Gets directed in case we want to read the entire journal post
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      date: post.date,
      title: post.title,
      content: post.content
    });
  });

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
