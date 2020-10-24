const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const {v4: uuid4} = require("uuid");

let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        console.log(file);
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        console.log(uniqueName);
        callback(null, uniqueName);
    }
   })



router.post('/api/file', (req, res) => {
    
    let upload = multer({
        storage: storage,
        limit: {fileSize: 100 * 1024 * 500},
        fileFilter: function(req, file, callback) {
            let ext = path.extname(file.originalname).toLowerCase();
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext!=='.pdf' && ext !== '.txt' && ext!=='.html' && ext!=='.js' && ext!=='.css') {
                return callback(res.end("Only PDF's, HTML, images, JS or text documents are allowed"), null);
            }
            callback(null, true)
        }
    }).single('userFile');

    upload(req, res, async (err) => {
        if(!req.file){
            return res.json({error: "All fields are required"});
        }

         if(err){
             return res.status(500).send({error: err.message});
         }

         const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
         })
         const response = await file.save();
         if(response){
             console.log("saved to databse");
             return res.render("show", {file: `${process.env.APP_BASE_URL}/files/download/${response.uuid}`, uuid: `${response.uuid}`});
         }
    })
  })

  module.exports = router;
