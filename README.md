# numbat-collector-mock
a mock numbat collector server for your tests


```js

var numbat = require('numbat-emitter')

var numbatMock = require('numbat-collector-mock')

var emitter = new numbat({uri:'tcp://localhost:3333',app:'test'})


var server = numbatMock()



emitter.metric({
  name:"foo"
})

server.on()




```
