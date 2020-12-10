const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();
const { readDB, writeDB } = require("../lib/utilities");
const { check, validationResult } = require("express-validator");
const { userInfo } = require("os");
const upload = multer({});
const projectsImagePath = path.join(__dirname, "../../public/img/projects");
const projectFilePath = path.join(__dirname, "projects.json")

router.get("/", async (req, res,next) => {
  
    try {
        const projectDB = await readDB(projectFilePath); //RUNS FUNCTION TO GET DATABASE
        if (projectDB.length > 0) {
          res.status(201).send(projectDB); //SENDS RESPONSE to the DB 
        } else {
          const err = {};
          err.httpStatusCode = 404;
          next(err);
        }
      } catch (err) {
        err.httpStatusCode = 404;
        next(err);
      }
    });


router.get("/:id", (req, res, next) => {
  try {
    console.log("here generated id", req.params.id);
    const projectsContent = readFile("projects.json");

    const index = projectsContent.findIndex(
      (project) => project.ID === req.params.id
    );
    if (index !== -1) {
      res.send(projectsContent[index]);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", (req, res, next) => {
  try {
    const projectsContent = readFile("projects.json");
    console.log(req.query);
    if (req.query && req.query.name) {
      const filterprojects = projectsContent.filter(
        (proj) =>
          proj.hasOwnProperty("name") &&
          proj.name.toLowerCase() === req.query.name.toLowerCase()
      );
      res.send(filterprojects);
    } else {
      res.send(projectsContent);
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  [
    check("name").exists().withMessage("name is a mandatory field"),
    check("description").exists().withMessage("Needs a description"),
    check("repoUrl").exists().isURL().withMessage("has to be a valid repoUrl"),
    check("liveUrl").exists().isURL().withMessage("has to be a valid Live URL"),
  ],
  (req, res,next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.httpStatusCode = 400;
        err.message = errors;
        next(err);
      } else {
        const projectDB = readFile("projects.json");
        const newproject = {
          ...req.body,
          ID: uniqid(),
          modifiedAt: new Date(),
        };

        projectDB.push(newproject);

        fs.writeFileSync(
          path.join(__dirname, "projects.json"),
          JSON.stringify(projectDB)
        );

        res.status(201).send({ id: newproject.ID });
      }
    } catch (error) {
      next(error);
    }
  }
);
router.put("/:id", (req, res, next) => {
    
  try {
    console.log(req.params.id)
    const projectDataBase = readFile(); // get data
    const singleProject = projectDataBase.filter(
      (project) => project.ID === req.params.id
    );
    if (singleProject.length > 0) {
      const filteredDB = projectDataBase.filter(
        (project) => project.ID !== req.params.id
      );
      console.log(singleProject);
      const editedProject = {
        ...req.body,
        ID: singleProject[0].ID,
        StudentID: singleProject[0].StudentID,
        CreationDate: singleProject[0].CreationDate,
        ModifiedDate: new Date(),
      };
      filteredDB.push(editedProject);
      fs.writeFileSync(projectFilePath, JSON.stringify(filteredDB));
      res.status(201).send(filteredDB); //send resp with the whole data
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const projectDataBase = readFile(); //run the fun and get data
    const singleProject = projectDataBase.find(
      (project) => project.ID === req.params.id
    );
    console.log(singleProject)
    if (singleProject) {
      const filteredDB = projectDataBase.filter(
        (project) => project.ID !== req.params.id
      );
      fs.writeFileSync(projectFilePath, JSON.stringify(filteredDB));
      res.status(201).send(filteredDB); //SENDS RESPONSE WITH GOOD CODE AND WHOLE DATABSE
    } else {
      const err = {};
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (err) {
    err.httpStatusCode = 404;
    next(err);
  }
});

module.exports = router;
