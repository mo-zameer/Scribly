require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const connectDB = require('./server/config/db')
const session = require('express-session') //store sessions in db when users log in
const passport = require('passport')//used for adding authentication
const MongoStore = require('connect-mongo')

const app= express() //creating express app
const port= process.env.PORT //storing port number

app.use(session({
    secret: 'Suii Scribly',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } //Session only active for 1hr
    // Date.now() - 30 * 24 * 60 * 60 * 1000
}))

//Initializing passport
app.use(passport.initialize())
app.use(passport.session())

//middleware for pass data from forms and page-page
app.use(express.urlencoded({extended:true})) //middleware to recognize the incoming Request Object as strings or arrays.
app.use(express.json()) //middleware to recognize the incoming Request Object as a JSON Object.
app.use(methodOverride("_method"))
//Connect to Database
connectDB()

//static files like ejs documents
app.use(express.static('public'))

//templating engine
app.use(expressLayouts)
app.set('layout', './layouts/main') //name:layout  value:./layouts/main
app.set('view engine', 'ejs')

//Routing
app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))

//Handle 404
app.get('*', (req, res)=>{
    //res.status(404).send('404 Page not found.')
    res.status(404).render('404')
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
}) 