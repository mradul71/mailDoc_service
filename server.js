const express = require("express");
const ejs = require('ejs');
const app = express();
const path = require('path');
const multer = require('multer');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // code to set the ejs for rendering template
 
// let storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, './uploads')
//     },
//     filename: function(req, file, callback) {
//         console.log(file)
//         callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
//    })
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', ()=>{
    console.log("connected to mongoose");
})

mongoose.connection.on('error', ()=>{
    console.log("An error occured");
})
 
app.get('/', function(req, res) {
        res.render('index');
})
 
app.use('/', require('./routes/files'));
app.use('/files/download', require('./routes/download'));
//   app.post('/api/file', function(req, res) {
//     let upload = multer({
//         storage: storage,
//         fileFilter: function(req, file, callback) {
//             let ext = path.extname(file.originalname)
//             if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//                 return callback(res.end('Only images are allowed'), null)
//             }
//             callback(null, true)
//         }
//     }).single('userFile');
//     upload(req, res, function(err) {
//         res.end('File is uploaded')
//     })
//   })
    app.use("/send/email", require("./routes/email"));

   let port = process.env.PORT || 3000
   app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
   })