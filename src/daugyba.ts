import http from 'http';

//sukuriame f-ja, kuri bus paleista tuomet, kai atkeliaus uzklausa is userio
const server = http.createServer((req, res) => {

    //vartotojo nuoroda
    const url = req.url;
    console.log(url);

    //pasiimame metoda
    const method = req.method;
    console.log(method);

    //pasiimame daugikli

    let daugiklis = 1;

    if (url !=null) {
        daugiklis = parseInt(url?.split("/")[1]);
    }
    
    //issiunciame useriui, kokie duomenys yra persiunciami
    res.setHeader('Content-Type', 'text/html');

    //siunciamas dokumentas
    res.write("<!DOCTYPE html>");
    res.write("<html>");

    res.write("<head>");
    res.write("<title>Daugybos lentele</title>");
    res.write("</head>");

    res.write("<body>");

    for (let i = 1; i <= 10; i++) {
        res.write(`<a href="/${i}">${i}</a>&nbsp;`)
    }

    res.write(`<h1>${daugiklis} Daugybos lentele</h1>`);
    res.write("<table border='1'>");

    for (let i = 1; i <= 10; i++) {
        res.write("<tr>");
    res.write(`<td>${daugiklis}</td><td>*</td><td>${i}</td><td>=</td><td>${i*daugiklis}</td>`);
    res.write("</tr>");
    }

    res.write("</table>");

    res.write("</body>");
    res.write("</html>");
    res.end();
});

server.listen(2999,'localhost');