const express = require("express")
const multer = require ("multer")
const {writeFile,createReadStream}=require("fs-extra")
// Including fs and zlib module 
var fs = require('fs'); 
const zlib = require('zlib'); 

  
// Constructing finished from stream 
const { pipeline } = require('stream'); 
const { join } = require("path");
const router = express.Router()
const upload = multer({})// Multer is a Node.js middleware for handling, which is primarily used for uploading files.
const projectsImagesPath= join(__dirname, "../../public/img/projects");

router.post ("/uploadphoto/:id",upload.single("projectImage"),async(req,res,next)=>{
    console.log(req.params.id);
    console.log(req.file.originalname);
  try{
    await writeFile(
        join(projectsImagesPath, `${req.params.id}.jpg`),
        req.file.buffer
      );
      res.send("ok");
  }
    catch (error) {
      console.log(error);
      next(error);
    }



})

module.exports=router;