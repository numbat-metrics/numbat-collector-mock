var net = require('net')
var bsplit = require('binary-split')
var through2 = require('through2')

module.exports = function(port){
  var s
  var server = net.createServer(function(con){
    con.pipe(bsplit()).pipe(s,{end:false})
    con.unref()
  })

  server.listen(port||3333)
  server.unref()

  s = through2.obj(function(l,enc,cb){
    var o = json(l)
    if(!o) return
    s.metrics.push(o)
    cb(false,o)   
  },function(cb){
    server.close()
    cb()
    s.emit('flushed',s.metrics)
  })

  s.metrics = []

  s.finished = function(cb){
    var t
    var self = this
    self.once('flushed',onFlushed)

    function onFlushed(metrics){
      console.log('got flushed!')
      clearTimeout(t)
      cb(false,metrics)
    }

    // make sure to drain
    if(!self.metrics.length) {
      var ended = false;
      self.on('data',function(){
        if(ended) return
        ended = true
        setImmediate(function(){
          self.end()
        })
      })
    } else {
      self.end()
    }

    t = setTimeout(function(){
      s.end()
    },1000)
  }

  return s
}

function json(l){
  try{ 
    return JSON.parse(l)
  } catch(e){
  
  }
}
