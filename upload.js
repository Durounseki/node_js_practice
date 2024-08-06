const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');  // Add this to resolve file paths

http.createServer((req, res) => {
    if (req.url === '/fileupload') {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            console.log('files: ', files);
            if (!files.filetoupload || !files.filetoupload[0]) {
                console.error('File not found or invalid');
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Bad Request');
                return;
            }
            if (err) {
                console.error('Error parsing form:', err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }

            const oldPath = files.filetoupload[0].filepath;
            console.log('old path: ',oldPath);
            const newPath = path.join(__dirname, 'uploads', files.filetoupload[0].originalFilename); // Use __dirname and create an 'uploads' folder
            console.log('new path: ',newPath);

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                    return;
                }

                res.write('File uploaded and moved successfully!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);