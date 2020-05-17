var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

//App Config
mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser());
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Schema & Model
var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES

// INDEX
app.get('/',(req,res)=>{
	res.redirect("/blogs");
});

app.get('/blogs',(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err){
			console.log("ERROR");
		}else{
			res.render("index",{blogs: blogs});
		}
	});
});


//NEW
app.get('/blogs/new',(req,res)=>{
	res.render('new');
});

//CREATE
app.post('/blogs',(req,res)=>{
	//create blog
	
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
			res.render('new');
		}else{
			res.redirect('/blogs');
		}
	});
});


//SHOW
app.get("/blogs/:id",function (req,res) {
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("index");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("index");
		}else{
			res.render("edit",{blog:foundBlog});;
		}
	});
	
});

//UPDATE ROUTE
app.put("/blogs/:id/",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,(err,updatedBlog)=>{
		if(err){
			res.redirect("index");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DESTROY ROUTE
app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

//Server 
app.listen(3000,()=>{
	console.log('Server Started...');
})