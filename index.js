var net = require('net')
var bsplit = require('binary-split')
var eos = require('end-of-stream')

module.exports = function(port){
  var s
  var server = net.createServer(function(con){
    con.pipe(bsplit()).pipe(s,{end:false})
    con.unref()
  })

  server.listen(port||3333)

  server.unref()

  server.metrics = []

  s = through2.obj(function(l,enc,cb){
    cb(false,json(l))   
  })

  eos(s,function(){
    s.destory()
  })

  return s
}

function json(l){
  try{ 
    return JSON.parse(l)
  } catch(e){
  
  }
}
