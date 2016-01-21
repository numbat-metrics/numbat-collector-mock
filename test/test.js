var test = require('tape')
var numbat = require('numbat-emitter')
var mocker = require('../')

test("can",function(t){

  var collector = mocker()

  var emitter = new numbat({uri:'tcp://localhost:3333',app:'test'})

  emitter.metric({name:'hi'})
  emitter.metric({name:'foo',value:1000,attribute:1})

  collector.finished(function(err,metrics){
    t.ok(!err,'should not have error finishing ')

    t.equals(metrics.length,2,'should have 2 metrics')

    t.equals(metrics[0].name,'test.hi','should say hi first')

    t.equals(metrics[1].name,'test.foo','should say foo next')
    t.equals(metrics[1].value,1000,'should have value')
    t.equals(metrics[1].attribute,1,'should have attribute')

    t.end()
    emitter.destroy()
  })


})


