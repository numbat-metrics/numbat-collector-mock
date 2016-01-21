var net = require('net')

module.exports = function(port){

  var server = net.createServer(function(con){
    con.on('data',console.log)
  })

  server.listen(port||3333)

  server.metrics = []

  return server


}
