var express = require('express');
var router = express.Router();
let Assignment = require('../model/assignment')
/*CRUD*/
/*Read Operation --> Get route for the assignment list*/
router.get('/',async(req,res,next)=>{
    try{
        const AssignmentList = await Assignment.find();
        res.render('Assignment/list',{
            title:'Assignments', 
            AssignmentList:AssignmentList
        })
    }
    catch(err){
        console.error(err)
        res.render('Assignment/list',{
            error:'Error on Server'})
    }
})
/*Create Operation --> Get route for Add assignment*/
router.get('/add',async(req,res,next)=>{
    try{
        res.render('Assignment/add',{
            title:"Add Assignment"
        });
    }
    catch(err){
        console.error(err)
        res.render('Assignment/list',{
            error:'Error on Server'})
    }
});
/*Create Operation --> Post route for processing the Add page*/
router.post('/add',async(req,res,next)=>{
    try{
        let newAssignment = Assignment({
        "Course":req.body.Course,
        "Name":req.body.Name,
        "Status":req.body.Status,
        "Due":req.body.Due
        })
        Assignment.create(newAssignment).then(()=>{
            res.redirect('/tracker')
        })
    }
    catch(err){
        console.error(err)
        res.render('Assignment/list',{
            error:'Error on Server'})
    }
});
/*Update Operation --> Get route for the Edit page*/
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const AssignmentToEdit = await Assignment.findById(id);
        res.render('Assignment/edit',
            {
                title:'Edit Assignment',
                Assignment:AssignmentToEdit
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
        let updatedAssignment = Assignment({
            "_id":id,
            "Course":req.body.Course,
            "Name":req.body.Name,
            "Status":req.body.Status,
            "Due":req.body.Due
        })
        Assignment.findByIdAndUpdate(id,updatedAssignment).then(()=>{
            res.redirect('/tracker')
        })
    }
    catch(err){
        console.error(err);
        res.render('Assignment/list',{
            error:'Error on server'
        })
    }
});
/*Delete Operation --> Get route for the Deletion*/
router.get('/delete/:id',(req,res,next)=>{
    try{
        let id=req.params.id;
        Assignment.deleteOne({_id:id}).then(()=>{
            res.redirect('/tracker')
        })
    }
    catch(err){
        console.error(err);
        res.render('Assignment/list',{
            error:'Error on server'
        })
    }
});
module.exports = router;
