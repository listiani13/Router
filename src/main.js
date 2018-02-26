import http from 'http';
import fs from 'fs';
import {join} from 'path';
import pipe from './pipe';
import Router from './Router';

let server = http.createServer();

// fs.readFile('./assets/img/goo.png', (err, data) => {
//   if (err) {
//     throw err;
//   }
//   console.log('data gambar !!', data);
// });

let dummyData = {
  Product: [
    {id: 1, name: 'banana', price: '100'},
    {id: 3, name: 'apple', price: '20000'},
    {id: 2, name: 'blackberry', price: '10'},
  ],
};

let supportedType = {
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  txt: 'plain/text',
  html: 'text/html',
};
function serveNotFoundPage(request, response) {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html');
  response.end(`<h1>Bad Request !</h1>`);
}
function serveErrorPage(request, response, error) {
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/html');
  response.end(`<h1>Error ${error}</h1>`);
}

function serveAsset(request, response, filePath) {
  let readStream = fs.createReadStream(filePath);
  // readStream.pipe()
  // pipe(readStream, response);
  readStream.on('error', (error) => {
    console.log(error);
    serveErrorPage(request, response, error);
  });
  readStream.pipe(response);
  readStream.on('end', () => {
    response.end();
  });
}

function serveFile(request, response, filePath) {
  let fileName = filePath.split('/').pop();
  let fileExtension = fileName.split('.').pop();
  if (supportedType[fileExtension]) {
    response.statusCode = 200;
    response.setHeader('Content-Type', supportedType[fileExtension]);
    serveAsset(request, response, filePath);
  } else {
    serveNotFoundPage(request, response);
  }
}

function typeChecking(jsonRes) {
  if (!Array.isArray(jsonRes) && typeof jsonRes === 'object') {
    for (let key of Object.keys(jsonRes)) {
      if (key === 'name') {
        if (typeof jsonRes[key] !== 'string') {
          console.log('Woops! The name type does not match!');
          return;
        }
      }
      if (key === 'age') {
        if (typeof jsonRes[key] !== 'number') {
          console.log('Woops! The age type does not match!');
          return;
        }
      }
    }
  } else {
    console.log('Woops! The result type does not match!');
  }
}
let router = new Router();
router.addRoute('/', ({request, response}) => {
  let filePath = join(__dirname, './assets/main.html');
  serveFile(request, response, filePath);
});
router.addRoute('/assets/:fileName', ({request, response}, fileName) => {
  let filePath = join(__dirname, './', request.url);
  console.log('>>File Path', filePath);
  console.log('>>File Name', fileName);
  serveFile(request, response, filePath);
});
router.addRoute('/users/:userID', ({request, response}, userID) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html');
  response.end(`<h1>User ID: ${userID}</h1>`);
});
router.addRoute('/submit-json', ({request, response}) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html');
  // let body = [];
  request.on('data', (data) => {
    let jsonRes = JSON.parse(data.toString());
    // console.log('typeof jsonRes', typeof jsonRes, jsonRes);
    typeChecking(jsonRes);
    let result = JSON.stringify(jsonRes);
    response.write(result);
    response.end();
  });
});
server.on('request', (request, response) => {
  router.handleRequest(request.url, {request, response});

  // if (request.url.startsWith('/assets/')) {
  //   let filePath = join(__dirname, './', request.url);
  //   console.log('>>File Path', filePath);
  //   serveFile(request, response, filePath);
  // }
  // console.log('request received', request.url);
  // if (request.url.startsWith('/assets/')) {
  //   let filePath = join(__dirname, '../', request.url);
  //   serveFile(request, response, filePath);
  // } else if (request.url === '/page/') {
  //   let filePath = join(__dirname, './assets/main.html');
  //   serveFile(request, response, filePath);
  // } else if (request.url === '/submit-json') {
  //   response.statusCode = 200;
  //   response.setHeader('Content-Type', 'text/html');
  //   let body = [];
  //   request.on('data', (data) => {
  //     let jsonRes = JSON.parse(data.toString());
  //     let result = JSON.stringify(jsonRes);
  //     response.write(result);
  //     response.end();
  //   });
  //   // let a = JSON.stringify({name: 123});
  //   // response.write(a);
  //   // response.end();
  //   // console.log('>>>Submit-json', response);
  //   // fs.createWriteStream('path, options?')
  // } else {
  //   serveNotFoundPage(request, response);
  // }
});

server.listen(8080);
