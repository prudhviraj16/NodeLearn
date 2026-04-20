const mongoose = require('mongoose')
const fs = require('fs')
const Hotel = require('../models/hotel')
const connectionString ='mongodb+srv://admin:mz8gMRnRTqAM5D65@cluster0.qit5kfq.mongodb.net/bookmystay?appName=Cluster0'
mongoose.connect(connectionString)
.then((conn) => console.log("Connection to DB successful"))
.catch(err => console.log("Couldn't connect to MongoDB"))

const hotels = JSON.parse(fs.readFileSync('./hostels.json','utf-8'))

const deleteDocuments = async() => {
    try{
        await Hotel.deleteMany();
        console.log("Deleted Successfully")
    }catch(err){
        console.log("Error Deleting")
    }
    procesexit()
}

const importDocuments = async() => {
    try{
        await Hotel.create(hotels);
        console.log("Documents imported successfully")
    }catch(err){
        console.log("Error importing documents")
    }
    process.exit()
}
console.log(process.argv)
if(process.argv[2] === '-delete'){
    deleteDocuments()
}
if(process.argv[2] === '-import'){
    importDocuments()
}
