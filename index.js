const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
//to start mysql in terminal
//& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nsut',
    password:"Divanshij@06"
  });
app.get("/nsut/admin",(req,res)=>{
    res.render("adminLogin.ejs");
});
app.get("/nsut/staff",(req,res)=>{
    res.render("staffLogin.ejs");
});
app.get("/nsut/student",(req,res)=>{
    res.render("studentLogin.ejs");
});
app.post("/nsut/student/show",(req,res)=>{
    let {username,password}=req.body;
    if(username=="HostelManage" && password=="abcd"){
        res.render("studentPage.ejs");
    }else{
        res.send("You are not the authorized user, Enter correct details!");
    }
    console.log("student details showing");
});
app.post("/nsut/staff/show",(req,res)=>{
    let {username,password}=req.body;
    if(username=="HostelManage" && password=="abcd"){
        res.render("staffPage.ejs");
    }else{
        res.send("You are not the authorized user, Enter correct details!");
    }
    console.log("Staff details showing");
});
app.post("/nsut/admin/show",(req,res)=>{
    let {username,password}=req.body;
    if(username=="HostelManage" && password=="abcd"){
        res.render("adminPage.ejs");
    }else{
        res.send("You are not the authorized user, Enter correct details!");
    }
    console.log("Admin details showing");
})
app.post("/nsut/admin/show/edit",(req,res)=>{
    res.render("adminEdit.ejs");

})
app.get("/nsut/admin/show/student",(req,res)=>{
    res.render("StudentData.ejs");
})
app.get("/nsut/admin/show/staff",(req,res)=>{
    res.render("StaffData.ejs");
})
app.get("/",(req,res)=>{
    console.log("root working");
    res.render("home.ejs");
})
app.get("/nsut/admin/show/edit/:id",(req,res)=>{
    let {id} = req.params;
    console.log(id);
    
});
app.delete("/nsut/admin/show/edit/:id",(req,res)=>{
    let {id} = req.params;
    
    res.redirect("/nsut/admin/show/student");
})
app.listen("8080",(req,res)=>{
    console.log("server is listening to port 8080");
});
