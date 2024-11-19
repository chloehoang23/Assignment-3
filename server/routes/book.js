var express = require('express');
var router = express.Router();
let Book = require('../model/book')
/*CRUD*/
/*Read Operation --> Get route for the book list*/
router.get('/',async(req,res,next)=>{
    try{
        const BookList = await Book.find();
        res.render('Book/list',{
            title:'Books', 
            BookList:BookList
        })
    }
    catch(err){
        console.error(err)
        res.render('Book/list',{
            error:'Error on Server'})
    }
})
/*Create Operation --> Get route for Add book*/
router.get('/add',async(req,res,next)=>{
    try{
        res.render('Book/add',{
            title:"Add Book"
        });
    }
    catch(err){
        console.error(err)
        res.render('Book/list',{
            error:'Error on Server'})
    }
});
/*Create Operation --> Post route for processing the Add page*/
router.post('/add',async(req,res,next)=>{
    try{
        let newBook = Book({
        "Name":req.body.Name,
        "Author":req.body.Author,
        "Published":req.body.Published,
        "Description":req.body.Description,
        "Price":req.body.Price
        })
        Book.create(newBook).then(()=>{
            res.redirect('/bookslist')
        })
    }
    catch(err){
        console.error(err)
        res.render('Book/list',{
            error:'Error on Server'})
    }
});
/*Update Operation --> Get route for the Edit page*/
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const BookToEdit = await Book.findById(id);
        res.render('Book/edit',
            {
                title:'Edit Book',
                Book:BookToEdit
            }
        )
    }
    catch(err){
        console.error(err)
        next(err);
    }
});
/*Update Operation --> Post route for processing Edit page*/
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id = req.params.id;
        let updatedBook = Book({
            "_id":id,
            "Name":req.body.Name,
            "Author":req.body.Author,
            "Published":req.body.Published,
            "Description":req.body.Description,
            "Price":req.body.Price
        })
        Book.findByIdAndUpdate(id,updatedBook).then(()=>{
            res.redirect('/bookslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Book/list',{
            error:'Error on server'
        })
    }
});
/*Delete Operation --> Get route for the Deletion*/
router.get('/delete/:id',(req,res,next)=>{
    try{
        let id=req.params.id;
        Book.deleteOne({_id:id}).then(()=>{
            res.redirect('/bookslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Book/list',{
            error:'Error on server'
        })
    }
});
module.exports = router;