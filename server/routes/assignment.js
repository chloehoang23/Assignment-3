var express = require('express');
var router = express.Router();
let Assignment = require('../model/assignment')
// Reference: https://momentjs.com/
const moment = require('moment');
/*CRUD*/
/*Read Operation --> Get route for the assignment list*/
router.get('/',async(req,res,next)=>{
    try{
        const AssignmentList = await Assignment.find();
        res.render('Assignment/list',{
            title:'Assignments', 
            displayName:req.user ? req.user.displayName:'',
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
        // Reference: https://momentjs.com/
        const defaultDueDate = moment().endOf('day').format('YYYY-MM-DDTHH:mm');
        res.render('Assignment/add',{
            title:"Add Assignment",
            displayName:req.user ? req.user.displayName:'',
            defaultDueDate: defaultDueDate
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
        let dueDate = req.body.Due;

        // Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
        if (dueDate && !dueDate.includes('T')) {
            dueDate = `${dueDate}T23:59`;
        }

        let newAssignment = Assignment({
        "Course":req.body.Course,
        "Name":req.body.Name,
        "Status":req.body.Status,
        "Due":dueDate
        })
        await Assignment.create(newAssignment).then(()=>{
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
        let dueDate = req.body.Due;

        // Ensure time is 23:59 if only date is provided
        if (dueDate && !dueDate.includes('T')) {
            dueDate = `${dueDate}T23:59`;
        }
        const AssignmentToEdit = await Assignment.findById(id);
        res.render('Assignment/edit',
            {
                title:'Edit Assignment',
                displayName:req.user ? req.user.displayName:'',
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
