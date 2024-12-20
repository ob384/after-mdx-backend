const express = require("express");
const { DAO } = require("./api/dao");
const app = express();
const cors = require("cors");
const session = require('express-session');
const crypto = require("crypto");
const cookieParser = require('cookie-parser');


new DAO();


app.use(cors({
    origin: 'https://ob384.github.io', // Frontend domain
    credentials: true,
  }));

  // app.use(cors())
  app.use(cookieParser());



app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})


app.listen(process.env.PORT || 3001)

app.post('/signup', (req, res) => {
  DAO.addUser(req.body).then(() => {
    const username = req.body.email.split("@")[0];

    res.cookie('username', username, {
      httpOnly: true,   
      secure: false,
      maxAge: 6 * 60 * 60 * 1000, 
      sameSite: 'strict',
    });

    
  }).catch((e) => {
    console.log(e.message);
  });
});

app.post('/login', (req, res) => {
  DAO.verifyUser(req.body).then((d)=>{
    res.cookie('username', d.username, {
      httpOnly: true,
      secure: false,   
      maxAge: 6 * 60 * 60 * 1000,
      sameSite: 'strict',      
    });

    
  }).catch((e) => console.log(e))
})


// Test session (for logging purposes)
app.get("/session-test", (req, res) => {
  console.log('Session Username:', req.session ? req.session.username : 'No session data');
  res.send(req.session ? req.session.username : 'No session data');
});

app.get('/api/username', (req, res) => {
  // Directly access the username from req.cookies
  const username = req.cookies.username || ''; 
  
  console.log(`Username from cookie in /api/username route: ${username}`);
  
  // Send the username back to the frontend
  res.json({ username: username });
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

app.post("/checkout", (req,res)=>{
  DAO.addOder(req.body).then(()=>{res.status(201).send("Order Completed")}).catch(()=>{res.status(400).send("Bad Order Could Not be completed")})
})





