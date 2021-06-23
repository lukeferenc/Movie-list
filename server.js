const http = require("http")
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => {
    let addr = request.url;
    let q = url.parse(addr, true);
    let filePath = ""
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Added to log.');
		}
	});
    console.log("q")
    if (q.pathname.includes('documentation')) {
		filePath = (__dirname + '/documentation.html');
	} else {
		filePath = 'index.html';
	}
    fs.readFile(filePath, (err, data) => {
		if(err) {
			throw err;
		}

		response.writeHead(200, { 'content-Type': 'text/html' });
		response.write(data);
		response.end();
	});
  }).listen(8080);
  

/*fs.readFile('./documentation.html', "utf-8", (err, data) => {
  if (err) { throw err; }
  console.log('data: ', data);
});
*/
