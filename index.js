const express = require("express");
const { DAO } = require("./api/dao");
const app = express();
const cors = require("cors");
const session = require('express-session');
const crypto = require("crypto");
const cookieParser = require('cookie-parser');


new DAO();


// app.use(cors({
  //   origin: 'https://ob384.github.io/', // Frontend domain
  //   credentials: true,
  // }));
  app.use(cors())
  app.use(cookieParser());

// app.use(session({
//   secret: crypto.randomBytes(16).toString("hex"),
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true, // Prevents client-side scripts from accessing the cookie
//     secure: true, // Set to `true` in production with HTTPS
//     maxAge: 24 * 60 * 60 * 1000 // Session expiration time in milliseconds
//   }
// }))

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})


app.listen(process.env.PORT || 3001)

app.post('/signup', (req, res) => {
  
  DAO.addUser(req.body).then(()=>{
    const username = req.body.email.split("@")[0];  // Assuming the username is part of the email


    // Set the cookie with the username (expires in 1 day)
    res.cookie('username', username, {
      httpOnly: false,   // Allow access to the cookie via JavaScript
      secure: false,     // Set to true in production if you're using HTTPS
      maxAge: 6 * 60 * 60 * 1000, // 6 hours expiration
      sameSite: 'None',  // Allow cross-origin cookies
      domain: 'ob384.github.io'  // Correct domain, without protocol or path
    });

  res.redirect(`${req.headers.referer}after-mdx-front-end/`)
  }).catch((e)=> (console.log(e.message)));
})

app.get("/session-test", (req, res)=>{
  // console.log(req.session.username);
  console.log('Session Username:', req.session.username);
  res.send(req.session.username)
})

app.get('/api/username', (req, res) => {
  // Retrieve the username from the cookie
  const username = req.cookies.username || '';  // Default to empty string if no cookie is set
  res.json({ username });
});

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



