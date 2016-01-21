var net = require('net')
var bsplit = require('binary-split')
var through2 = require('through2')
var once = require('once')

module.exports = function(port){
  var s

  var connected = false;

  var connections = []

  var server = net.createServer(function(con){
    con.pipe(bsplit()).pipe(s,{end:false})
    con.unref()
    connected = con
    con.on('close',function(){
      if(con === connected) connected = false;
      connections.splice(connections.indexOf(con),1)
    })

    connections.push(con)
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
    connections.forEach(function(c){
      c.end()
    })

    cb()
    s.emit('flushed',s.metrics)
  })

  s.metrics = []


  s.finished = function fn(cb){

    var self = this
    cb = once(cb)

    if(!connected){
      // wait forever for a connection
      // numbat-emitters should be trusted to reconnect.
      return server.once('connection',function(con){

        // 1000 ms max timeout for a metric.
        var t = setTimeout(function(){
          return cb(new Error('waited 1000ms but no data from connection =('))
        },1000)

        con.once('data',function(){
          clearTimeout(t)
          // i expect the connection to flush all of the backlogged events within one turn
          // this is reasonable because i know the data was buffered and waiting in the emitter
          setImmediate(function(){
            fn.call(self,cb)
          })
        })

      })
    }

    var t
    s.once('flushed',onFlushed)

    function onFlushed(metrics){
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
