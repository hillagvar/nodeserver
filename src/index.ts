import mysql, { RowDataPacket } from "mysql2";
import { Student } from "./models/student";
import http from "http";
import fs from "fs";
import path from "path";

//kintamasis, kuris rodo, ar mes prisijunge prie duomenu bazes

let connected = false;

//sukuriamas prisijungimas prie duomenu bazes
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "labasrytas",
    database: "students",
    port: 3305

});

//prisijungiama prie duomenu bazes
// con.connect();
// con.connect( (f-ja, kuri bus vykdoma po prisijungimo))
con.connect((error: any) => {
    if (error) throw error;

    //po prisijungimo be klaidos, nustatome, jog esame prisijunge prie db
    connected = true;
    console.log("prisijungta");

});


//sukuriame http serveri ir paduodame funkcija, kuri bus vykdoma, kai ateis uzklausa
const server = http.createServer((req,res) => {
    
    const url = req.url;
    const method = req.method;

    //statiniu failu isvedimas
    let filePath = `public${url}`;

    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const ext = path.extname(filePath);

        switch (ext) {
            case ".css":
                res.setHeader("Content-Type", "text/css; charset=utf-8");
                break;
            case ".js":
                res.setHeader("Content-Type", "application/javascript; charset=utf-8");
                break;
            case ".jpg":
            case ".png":
            case ".jpeg":
                res.setHeader("Content-Type", "image/jpg; charset=utf-8");
                break;
        }

        let file = fs.readFileSync(filePath);
        res.write(file);
        return res.end();
    }

    //JSON formatu
    // if (url=="/students" && method=="GET") {
    //     if (connected) {
    //         con.query<Student[]>("SELECT * FROM students", (error,result)=> {
    //             if (error) throw error;
    //             res.setHeader("Content-Type", "text/JSON; charset=utf-8");
    //             res.write(JSON.stringify(result));
    //             res.end();
    //         });
    //     }
    // }

    //html formatu
    if (url=="/students" && method=="GET") {
        if (connected) {
            con.query<Student[]>("SELECT * FROM students", (error,result)=> {
                if (error) throw error;
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                let rows = "";
                result.forEach((s) => {
                    rows += "<tr>";
                    rows += `<td>${s.name}</td><td>${s.surname}</td><td>${s.phone}</td><td><a href="/student/${s.id}" class="btn btn-sm btn-info">Plačiau</a></td>`;
                    rows += "</tr>";
                });
                let template = fs.readFileSync("templates/students.html").toString();
                template = template.replace("{{ student_table }}", rows);
                res.write(template);
                res.end();
            });
        }
    }

    //vieno studento atvaizdavimas, kai url = localhost:2997/student/5

    if (url?.split("/")[1] == "student") {

        //pasiimame is url'o id
        let id = parseInt(url?.split("/")[2]);
        
            con.query<Student[]>(`SELECT * FROM students WHERE id=${id}`, (error,result)=> {
                if (error) throw error;
                
                let student = result[0];
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                
                let template = fs.readFileSync("templates/student.html").toString();
                template = template.replace("{{ name }}", student.name);
                template = template.replace("{{ surname }}", student.surname);
                template = template.replace("{{ gender }}", student.gender != null? student.gender : "-");
                template = template.replace("{{ phone }}", student.phone != null? student.phone : "-");
                template = template.replace("{{ birthday }}", student.birthday != null? student.birthday.toLocaleDateString() : "-");
                template = template.replace("{{ email }}", student.email != null? student.email : "-");
                
                res.write(template);
                res.end();
            });

    }



});

//paleidziame serveri
server.listen(2996, "localhost");
