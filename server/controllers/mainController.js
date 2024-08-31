//GET Homepage
exports.homepage = async(req, res)=>{
    const locals={
        title : 'Scribly',
        description: 'Notes app'
    }
    res.render('index', {
        locals,
        layout: '../views/layouts/frontPage'
    })
}


//GET About
exports.about = async(req, res)=>{
    const locals={
        title : 'About | Scribly',
        description: 'Notes app'
    }
    res.render('about', locals)
}