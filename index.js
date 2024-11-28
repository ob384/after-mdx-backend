const express = require("express");
const { DAO } = require("./api/dao");
const app = express();
const cors = require("cors");
new DAO();

app.use(cors());

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})

app.use(express.static('docs'))

app.use(express.urlencoded({extended: true}))

app.listen(process.env.PORT || 3001)

app.post('/signup', (req, res) => {
  console.log(req.body);
  DAO.addUser(req.body).catch((e)=> (console.log(e.message)));
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