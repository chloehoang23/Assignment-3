// MVC --> Model, View, Controller (Routers)
let mongoose = require('mongoose')
// create a model class
let assignmentModel = mongoose.Schema({
    Course:String,
    Name:String,
    Status:String,
    Due:Date
},
{
    collection:"Assignments"
}
)
module.exports = mongoose.model('Assignment', assignmentModel)
