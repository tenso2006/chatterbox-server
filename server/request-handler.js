var urlParser = require('url');
var fs = require('fs');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var message = [];

var requestHandler = function(request, response) {
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  var method = request.method; 
  var link = request.url;
  var statusCode;
  var headers = defaultCorsHeaders;


  if (link === '/classes/messages') {

    if (method === 'GET') {
      statusCode = 200;
      request.on('error', function (err) {
        statusCode = 404;
        console.error('There was an error in parsing data: ', err); 
      });
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: message}));


    } else if (method === 'POST') {
      var data = '';
      statusCode = 201;
      
      request.on('data', function (chunk) {
        data += chunk;
      });
      
      request.on('end', function () {
        console.log(JSON.parse(data));
        message.push(JSON.parse(data));
      });

      request.on('error', function (err) {
        statusCode = 404;
        console.error('There was an error in parsing data: ', err); 
      });
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: 'Hello World'}));


    } else if (method === 'OPTIONS') {
      statusCode = 204;
      
      request.on('error', function (err) {
        statusCode = 404;
        console.error('There was an error in parsing data: ', err); 
      });

      response.writeHead(statusCode, headers);
      response.end(null);
    }


  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
}; 

module.exports.requestHandler = requestHandler;