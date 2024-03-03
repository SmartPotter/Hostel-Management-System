const mysql = require('mysql2');
const express=require("express");
const app=express();
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
//to run mysql service
//net start MySQL80
//run this in cmd (run as administrator)
//to start mysql in terminal
//& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'your_DB',
    password:"your_password",
    multipleStatements: true,
  });
app.get("/student/add",(req,res)=>{
    res.render("AddStudent.ejs");
})
app.get("/staff/add",(req,res)=>{
    res.render("AddStaff.ejs");
})
app.get("/nsut/admin",(req,res)=>{
    res.render("adminLogin.ejs");
});
app.get("/nsut/staff",(req,res)=>{
    res.render("staffLogin.ejs");
});
app.get("/nsut/student",(req,res)=>{
    res.render("studentLogin.ejs");
});
app.get("/nsut/admin/stfEdit/:id",(req,res)=>{
    let {id}=req.params;
  let q=`select * from staff where staffid='${id}'`;
  try{
    connection.query(
      q,
      function(err,result){
          if(err) throw err;
          let stf=result[0];
          console.log(result[0]);
          res.render("EditStaff.ejs",{stf});
      });
}
catch(err){
    console.log(err);
    res.send("some error in db");
}
})
app.get("/nsut/admin/stdEdit/:id",(req,res)=>{
    let {id}=req.params;
  let q=`select * from student where studentid='${id}'`;
  try{
    connection.query(
      q,
      function(err,result){
          if(err) throw err;
          let std=result[0];
          console.log(result[0]);
          res.render("EditStudent.ejs",{std});
      });
}
catch(err){
    console.log(err);
    res.send("some error in db");
}
})

app.post("/nsut/admin/add/student",(req,res)=>{
    let {rollno,fname,lname,gender,email,address,phone}=req.body;
    let std=[rollno,fname,lname,gender,email,address,rollno,phone];
    let q=`insert into student (studentid,firstname,lastname,gender,email,address) values (?,?,?,?,?,?);
    insert into r1 (studentid,contactno) values (?,?);`;
    try{
        connection.query(
            q,std,
            (err,result)=>{
                if(err) throw err;
                console.log(result);
                res.send("student added successfully");
            }
        )
    }catch(err){
        res.send(err);
        console.log(err);
    }
})
app.post("/nsut/admin/add/staff",(req,res)=>{
    let {staffid,name,position} =req.body;
    let stf=[staffid,name,position];
    let q=`insert into staff (staffid,name,position) values (?,?,?)`;
    try{
        connection.query(
            q,stf,
            (err,result)=>{
                if(err) throw err;
                console.log(result);
                res.send("staff added successfully");
            }
        )
    }catch(err){
        res.send(err);
        console.log(err);
    }
})
app.post("/std/contact/:id",(req,res)=>{
    let {id}=req.params;
    let {contact}=req.body;
    contact=parseInt(contact, 10);
    console.log(typeof(contact));
    console.log(contact);
    let cont=[id,contact];
    let q=`INSERT INTO r1 (studentid,contactno) VALUES (?,?);`;
    try{
        connection.query(
            q,cont,
            (err,result)=>{
                console.log(result);
                res.send("contact added successfully");
            }
        )
    }catch(err){
        console.log(err);
        res.send(err);
    }
})
app.post("/stf/contact/:id",(req,res)=>{
    let {id}=req.params;
    let {email,phone}=req.body;
    let cont=[id,email,id,phone];
    let q=`INSERT INTO r2 (staffid,email) VALUES (?,?);
    INSERT INTO r3 (staffid,contact_number) VALUES (?,?)`;
    try{
        connection.query(
            q,cont,
            (err,result)=>{
                console.log(result);
                res.send("contact added successfully");
            }
        )
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

app.patch("/staff/edit/:id",(req,res)=>{
    let {id}=req.params;
    let {staffid,name,position}=req.body;
    let stf=[staffid,name,position,id];
    let q=`UPDATE staff SET staffid=?,name=?,position=? WHERE staffid=?`;
    try{
        connection.query(
            q,stf,
            (err,result)=>{
                console.log(result);
                res.send("details updates successfully");
            }
        )
    }catch(err){
        res.send(err);
        console.log(err);
    }
})
app.patch("/student/edit/:id",(req,res)=>{
    let {id}=req.params;
    let {firstname,lastname,gender,email,address}=req.body;
    let std=[firstname,lastname,gender,email,address,id];
    let q=`UPDATE student SET firstname=?,lastname=?,gender=?,email=?,address=? WHERE studentid=?`;
    try{
        connection.query(
            q,std,
            (err,result)=>{
                console.log(result);
                res.send("details updates successfully");
            }
        )
    }catch(err){
        res.send(err);
        console.log(err);
    }
})

app.delete("/nsut/admin/stdDel/:id",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM r1 WHERE studentid='${id}';
    DELETE FROM room_allocation WHERE studentid='${id}';
    DELETE FROM fees WHERE studentid='${id}';
    DELETE FROM complaints WHERE studentid='${id}';
    DELETE FROM visitor WHERE studentid='${id}';
    DELETE FROM student WHERE studentid='${id}';
    `;
    try{
        connection.query(
            q,(err,results)=>{
                if(err) throw err;
                console.log(results[0],results[1]);
                res.send("student deleted");
            }
        )
    }catch(err){
        console.log(err);
        res.send(err);
    }
})
app.delete("/nsut/admin/stfDel/:id",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM R3 WHERE staffid='${id}';
    DELETE FROM R2 WHERE staffid='${id}';
    UPDATE HOSTEL SET wardenid = NULL WHERE wardenid = '${id}';
    DELETE FROM STAFF WHERE staffid='${id}';`;
    try{
        connection.query(
            q,(err,result)=>{
                if(err) throw err;
                console.log(result);
                res.send("staff deleted");
            }
        )
    }catch(err){
        console.log(err);
        res.send(err);
    }
})

app.post("/std/complaint/:id",(req,res)=>{
    let {id}=req.params;
    let {desc}=req.body;
    let q=`insert into complaints values (?,?,?,?,?);`;
    console.log(q);
    let dt=new Date();
    let complaint=["C6",id,desc,dt,"open"];
    try{connection.query(
        q,complaint,
        (err,result)=>{
            console.log(result);
            res.send("complaint added");
        }
    )}catch(err){
        console.log(err);
        res.send(err);
    }
})
app.post("/nsut/student/show",(req,res)=>{
    
    let {username,password}=req.body;
    const q = `
    SELECT * FROM student
    JOIN r1 ON student.studentid = r1.studentid
    WHERE student.studentid = ?;
    SELECT * FROM complaints WHERE studentid= ?;
    SELECT * FROM fees WHERE studentid= ?;
    SELECT * FROM room_allocation WHERE studentid= ?;
    SELECT * FROM visitor WHERE studentid= ?;
`;
console.log("SQL Query:", q);

        try{
        connection.query(q,[password,password,password,password,password],(err,results)=>{
            if(err) throw err;
            
            const data = {
                stdR1: results[0],
                complaints: results[1],
                fees:results[2],
                roomAllo:results[3],
                vis:results[4],
            };
            console.log(data.stdR1);
            console.log(results);
            // Render the studentPage.ejs with the data object
            res.render("studentPage.ejs", { data });
        });
        }
        catch(err){
            console.log(err);
            res.send("some error in your details , plz try again!");
        }
    console.log("student details showing");
});
app.post("/nsut/staff/show",(req,res)=>{
    let {username,password}=req.body;
    console.log(username);
    console.log(password);
    let q=`select * from staff where staffid=${password}`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let worker=result[0];
      let staff={staffid:worker.staffid,name:worker.name,pos:worker.position};
      return res.render("staffPage.ejs",{staff});
    });
  }
  catch(err){
      console.log(err);
      res.send("some error in your details , plz try again!");
    }
    console.log("Staff details showing");
});
app.post("/nsut/admin/show",(req,res)=>{
    let {username,password}=req.body;
    if(username=="HostelManage" && password=="abcd"){
        const q = `
        SELECT * FROM student;
        SELECT * FROM staff;
        SELECT * FROM complaints;
        SELECT * FROM hostel;
        SELECT * FROM rooms;
        SELECT * FROM room_allocation;
        SELECT * FROM r1;
        SELECT * FROM r2;
        SELECT * FROM r3;
        SELECT * FROM fees;
        SELECT * FROM visitor;
    `;        
        try{
        connection.query(q,(err,results)=>{
            if(err) throw err;
            console.log(results[0]);
            const data = {
                student: results[0],
                staff: results[1],
                complaints: results[2],
                hostel: results[3],
                rooms: results[4],
                roomAllocation: results[5],
                r1: results[6],
                r2: results[7],
                r3: results[8],
                fees: results[9],
                visitor: results[10],
            };
            // Render the adminPage.ejs with the data object
            res.render("adminPage.ejs", { data });
        });
        }
        catch(err){
            console.log(err);
            res.send("some error in your details , plz try again!");
        }
        console.log("Admin details showing");
    }else{
        res.send("You are not the authorized user, Enter correct details!");
    }
})
app.get("/nsut/admin/show/staff",(req,res)=>{
    res.render("StaffData.ejs");
})
app.get("/",(req,res)=>{
    console.log("root working");
    res.render("home.ejs");
})
app.listen("8080",(req,res)=>{
    console.log("server is listening to port 8080");
});
