const Note = require('../models/Notes')
const mongoose = require('mongoose')

//GET Dashboard
exports.dashboard= async(req,res)=>{
    let perPage = 12;
    let page = req.query.page || 1;

    const locals={
        title: 'Dashboard | Scribly',
        description: 'Notes app',
    }
    /*async function insertDummyCategoryData(){
        try{
            await Note.insertMany([
                {
                    user: "66a127d4206530f5b36e8ac2",
                    title: "Shopping List",
                    body: "Biscuits, Shampoo, Detergent",
                    createdAt: "1671634422539"
                },
                {
                    user: "66a127d4206530f5b36e8ac2",
                    title: "Shopping List2",
                    body: "Biscuits, chocolates, Detergent",
                    createdAt: "1671634422539"
                },
            ])
        } catch(error){
            console.log("err", +error)
        }
    }
    insertDummyCategoryData();*/
    
    /*
    try{
        const notes = await Note.find({})
        console.log(notes)
    } catch (error) {
        console.log(error);
    }
    res.render('dashboard/index', {
        userName: req.user.firstName,
        locals,
        notes,
        layout: "../views/layouts/dashboard",
      });
    */
    
    try {
        const notes = await Note.aggregate([
          { $sort: { updatedAt: -1 } },
          { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
          {
            $project: {
              title: { $substr: ["$title", 0, 30] },
              body: { $substr: ["$body", 0, 100] },
            },
          }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
    
        const count = await Note.countDocuments();
    
        res.render('dashboard/index', {
          userName: req.user.firstName,
          locals,
          notes,
          layout: "../views/layouts/dashboard",
          current: page,
          pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
    }
}

//GET View Specific Note
exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
      .where({ user: req.user.id })
      .lean();
    const locals={
        title: 'View Note | Scribly',
        description: 'Notes app',
    }
  
    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        locals,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Something went wrong.");
    }
};

//PUT Update Specific Note
exports.dashboardUpdateNote = async (req, res) => {
    try {
      await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
      ).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
};

// DELETE Delete Note
exports.dashboardDeleteNote = async (req, res) => {
    try {
      await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
};

//GET Add Notes
exports.dashboardAddNote = async (req, res) => {
    const locals={
        title: 'Add Note | Scribly',
        description: 'Notes app',
    }
    res.render("dashboard/add", {
      locals,
      layout: "../views/layouts/dashboard",
    });
};

//POST Add Notes
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
};

//GET Search
exports.dashboardSearch = async (req, res) => {
    try {
      res.render("dashboard/search", {
        searchResults: "",
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
        console.log(error);
    }
};
  
//POST Search For Notes
exports.dashboardSearchSubmit = async (req, res) => {
    const locals={
        title: 'Search Notes | Scribly',
        description: 'Notes app',
    }
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const searchResults = await Note.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      }).where({ user: req.user.id });
  
      res.render("dashboard/search", {
        searchResults,
        locals,
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
};
