const express = require("express");
const { DAO } = require("./api/dao");
const app = express();
const cors = require("cors");
const session = require('express-session');
const crypto = require("crypto");
const { Console } = require("console");

new DAO();

app.use(cors({
  credentials: true,
}));

app.use(session({
  secret: crypto.randomBytes(16).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents client-side scripts from accessing the cookie
    secure: false, // Set to `true` in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds
  }
}))

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})


app.listen(process.env.PORT || 3001)

app.post('/signup', (req, res) => {
  
  DAO.addUser(req.body).then(()=>{
    req.session.username = req.body.email.split("@")[0];
    req.session.save();
    // res.send({ username: req.session.username || '' });
    // res.redirect(req.headers.referer)
    console.log(`Username from sign up session ${req.session.username}`);
    
    console.log(req.headers.referer)
    res.redirect(`${req.headers.referer}after-mdx-front-end/`)
    // res.redirect("/session-test")
  }).catch((e)=> (console.log(e.message)));
})

app.get("/session-test", (req, res)=>{
  // console.log(req.session.username);
  console.log('Session Username:', req.session.username);
})
// API Routes
app.get("/api/courses/trending", (req, res)=>{
  DAO.getTrendingCourses().then((d) =>(res.json(d)))
})

app.get('/api/courses/', (req,res)=>{
  DAO.getCourses().then((d) =>(res.json(d)))
})

app.get('/api/courses/pages', (req,res)=>{
  DAO.getCoursePages().then((d) =>(res.json(d)))
})

app.get('/api/courses/:courseID', (req, res)=>{
  // console.log(req.params.courseID);
  DAO.getCourse(req.params.courseID).then((d) => res.json(d))
})

app.get("/api/search/courses", (req, res)=>{
  // console.log(req.query['course-name']);
  DAO.search(req.query['course-name'].trim()).then(d => res.json(d))
})

// END OF API ROUTES THAT WORK

app.get("/api/username", (req, res) => {
  console.log(`Username console log ${req.session.username}`);
  res.json({ username: req.session.username || "" });
});

