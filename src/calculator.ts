import http from 'http';
import fs from 'fs';

//darbas su keliais
import path from 'path';


//susikuriame serverio objekta
const server = http.createServer((req,res) => {
    const method = req.method;
    const url = req.url;
    console.log(`Metodas: ${method}, url: ${url}`);

    let filePath = `public${url}`;

    // fs.existsSync("kelias iki failo") - patikrina,ar failas/katalogas egzistuoja, jei timeStamp, grazina true, jei ne, grazina false
    // fs.lstatSync("kelias iki failo").isFile() = patikrina, ar tai failas, ne katalogas, nuoroda etc

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

    if (url=='/calculate' && method=='POST') {

        //saugomi duomenu gabalai
        const reqBody : any[] = [];

        //f-ja, kuri iskvieciama, kai gaunamas duomenu gabalas
        req.on('data', (d) => {
            console.log(`Gaunami duomenys`);
            // console.log(`Duomenys: ${d}`);

            //kiekvienas duomenu gabalas idedamas i masyva
            reqBody.push(d);
        });

        //f-ja, kuri iskvieciama, kai baigiami siusti visi duomenys (gauti visi gabalai)
        req.on('end', () => {
            console.log(`Baigti siusti duomenys`);

            //visi gabalai sujungiami i viena sarasa ir paverciame i stringa
            const reqData = Buffer.concat(reqBody).toString();
            const va = reqData.split('&');
            const x = parseFloat(va[0].split('=')[1]);
            const y = parseFloat(va[1].split('=')[1]);

            console.log(`Visi gauti duomenys: ${reqData}`);
            console.log(va);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            let template = fs.readFileSync("templates/result.html").toString();
            let out = template.replace("{{ result }}" , `Rezultatas: ${x*y}`)

            res.write(out);

            // res.write(`Rezultatas: ${x * y}`);
            //uzbaigiame siuntima ir nutraukiame vykdyma
            res.end();
        });
        return;
        
    }

    if (url=='/') {
        let template = fs.readFileSync("templates/index.html");
        res.write(template);
        return res.end();
    }

    //jeigu nerastas toks puslapis
    res.writeHead(404, {
        "Content-Type":"text/html; charset=utf-8"
    });
   
    const template=fs.readFileSync('templates/404.html');
    res.write(template);
    return res.end();

});

server.listen(2998, 'localhost');