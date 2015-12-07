var os = require('os')
var ifaces = os.networkInterfaces();
var ip = '', result = [];
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      //console.log(details)
      if (details.family === 'IPv4' && !details.internal) {
        //ip = details.address;
        result.push(details)
        //return;
      }
    });
  }

  if(result.length > 0) ip = result.reverse()[0].address;

  console.log(ip);
