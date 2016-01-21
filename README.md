# numbat-collector-mock
a mock numbat collector server for your tests

```js

var numbat = require('numbat-emitter')

var collectorMock = require('numbat-collector-mock')

// connect and make the mocking server
var emitter = new numbat({uri:'tcp://localhost:3333',app:'test'})
var collector = numbatMock()


// send a metric
emitter.metric({
  name:"foo"
})

// get the results
collector.finished(function(err,metrics){
  console.log(metrics[0].name === 'test.foo')
})


```


this handles quite a few race conditions for you so you can reliably test that your application code is sending the metrics you intend.


## api

### module.exports = collectorMock([port)
  - port
    - optional. defaults to 3333
  - returns Collector

### Collector 
  - collector is a stream. it emits data events for each metric it recieves.

### Collector.finished(callback)
 - callback - function(err,metrics).
   - this is trigered when metrics should have been recieved.
   - err
      - an error may be triggered if numbat-emitter fails to connect to the mock server at all.
   - metrics
      - and array containing each metric sent from numbat-emitter
 - returns nothing.
 
use this function after your code has passed metrics to numbat-emitter. it will carefully handle the callback so it get's triggered at the right time.
It will dispose of the server and close any numbat-emitter connections so that you can get a clean start for the next test.
