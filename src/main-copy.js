// @flow
import http from 'http';
import fs from 'fs';
import {join} from 'path';
import pipe from './pipe';

let server = http.createServer();

let newJSON = {
  product: {
    name: 'LUX',
    type: 'soap',
  },
};

server.on('request', (request, response) => {
  console.log(request.url);
  if (request.url === '/') {
    response.setHeader('Content-Type', 'text/html');
    // response.write('<h1>Hello World</h1>');
    response.write(`
      <form method="POST" action="/submit">
        <input type="file" name="uploadFile" id="uploadFile">
        <button type="submit">Submit</button>
      </form>
    `);

    response.end();
  } else if (request.url === '/json') {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(newJSON));
    response.end();
  } else if (request.url === '/photos.jpg') {
    let path = join(__dirname, './BC4-Day5b.mp4');
    let readStream = fs.createReadStream(path);
    pipe(readStream, response);
    // fs.readFile('/Users/Me/Downloads/Image2.png', (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   // response.setHeader('Content-Type', 'image/png');
    //   response.end(data);
    // });
  }
});
server.listen(8080);
