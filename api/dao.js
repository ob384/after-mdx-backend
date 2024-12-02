const {MongoClient, ObjectId} = require("mongodb");

const uri = `mongodb+srv://ob384:AewneOTcxz3dx1yC@after-mdx.w9ple.mongodb.net/`

const client = new MongoClient(uri)


class DAO {
  constructor(){
    client.connect();
  }

  static addUser = async (fname, lname,email, pwd)=>{
    try {
      // client.connect();
      const database = client.db("aftermdx")
      const collection = database.collection("users")
      const result = await collection.insertOne({firstname: fname, lastname:lname, "email": email, password: pwd})
      console.log(`Insertion ${result.insertedId}: Complete`);
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  static addUser = async (userObject)=>{
    try {
      // client.connect();
      const database = client.db("aftermdx")
      userObject.username = userObject.email.split( "@")[0]
      console.log(userObject);
      
      const collection = database.collection("users")
      await collection.createIndex({ username: 1 }, { unique: true });
      await collection.createIndex({ email: 1 }, { unique: true });
      const result = await collection.insertOne(userObject)
      console.log(`Insertion ${result.insertedId}: Complete`);
      // client.close();
    } catch (error) {
      console.error(error.message)
    }
  }

  static verifyUser = async(object)=>{
    try {
      const database = client.db("aftermdx")
      const collection  = database.collection("users")
      const result = await collection.findOne(object)
      return result
    } catch (error) {
      console.error(error.message);
    }
  }

  static getTrendingCourses = async () =>{
    try{
      const database = client.db("aftermdx")
      const collection = database.collection("courses");

      const result = await collection.find({}).limit(10).toArray()

      return result;

    }
    catch(error){
      console.error(error.message)
    }
  }

  static getCourses = async () =>{
  try {
    const database = client.db("aftermdx")
    const collection = database.collection("courses");

    const result = await collection.find({}).toArray()
    client.close();
    return result;

  } catch (error) {
    console.error(error.message);
  }

  }

  static getCoursePages = async (id)=>{
    try {
      // client.connect();
      const database = client.db("aftermdx")
      const collection = database.collection("courses");
  
      const result = await collection.find({}).toArray();
  
      const pageSize = 12
      const pages = await [];
  
      for (let i = 0; i < result.length; i+= pageSize) {
        const page = result.slice(i, i+pageSize);
        pages.push(page)
      }
      // client.close()
      return pages;
    } catch (error) {
      console.error(error.message);
      
    }
  }

  static getCourse = async (id) =>{
   try {
    // client.connect();
    const database = client.db("aftermdx")
    const collection = database.collection("courses");

    const result = await collection.findOne({ _id: new ObjectId(id) }, {projection: {_id: 0}})

    // client.close();
    // console.log(result);
    return result;

   } catch (error) {
    console.error(error.message);
   }
  }

  static search = async (name)=>{
    
    try {
      // client.connect();
      const database = client.db("aftermdx");
      const collection = database.collection("courses")

      const result =await collection.find({["name"]: {$regex: name, $options: 'i'}},).toArray()
     
      // client.close()
      return result

    }catch (error) {
      console.error(error.message); 
    }



  }

  static addOder = async (oderObject)=>{
    try {
      // client.connect();
      const database = client.db("aftermdx")
      oderObject.time = new Date();
      
      const collection = database.collection("orders")
      const result = await collection.insertOne(oderObject)
      console.log(`Insertion ${result.insertedId}: Complete`);
    } catch (error) {
      console.error(error.message)
    }
  }

}

module.exports.DAO=DAO