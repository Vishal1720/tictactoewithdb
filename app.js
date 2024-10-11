const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");

app.use(express.static(path.join(__dirname, "public"),{index:false,}));//prevented default loading of index page
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/scores", (req, res) => {
  const { score, name } = req.body;
  db.query(
    `INSERT INTO highscore (Name, Score) VALUES ('${name}',${score});`,
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});

app.post("/subform",(req,res)=>{
  const {uname,email,phonenumber,gender,pwd} = req.body;
  db.query(
    "INSERT INTO regform (username, email, phone, gender, password) VALUES (?, ?, ?, ?, ?)",
    [uname, email, phonenumber, gender, pwd],
  (error,results) => {
    if(error){
    console.error("Error executing query in /subform",error);
    return res.status(505).send("Internal Server Error");
  }
  res.json(results);
}
  );
  });

  

  app.post("/logform",(req,res)=>{
    const {uname,pwd} = req.body;
    db.query(
      "select * from regform where username = ? and password = ?",
      [uname, pwd],
    (error,results) => {
      if(error){
      console.error("Error executing query",error);
      return res.status(505).send("Internal Server Error");
    }
    if(results.length == 0){
      return res.status(404).send("User not found");
    }
    res.json(results);
  }
    );
    });
  
app.get("/users", (req, res) => {
  db.query(
    "SELECT * FROM highscore order by score desc LIMIT 5",
    (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).send("Internal Server Error");
      }
      res.json(results);
    }
  );
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/login.html"); 
});

app.get('/subform', (req, res) => {
  res.sendFile(__dirname + "/public/registration.html"); 
});

app.get('/logform', (req, res) => {
  res.sendFile(__dirname + "/public/login.html"); 
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});