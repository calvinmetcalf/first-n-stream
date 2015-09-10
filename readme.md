first-n-stream
===

A passthough objectMode stream that diverts the first n entries into either another stream or a callback

```bash
npm install --save first-n-stream
```

API
===

```js
var FirstN = require('first-n-stream');

var withCallback = new FirstN(5, function (err, resp) {
  // resp will be an array of the first 5 items
});

something.pipe(withCallback).pipe(streamThatWillGetTheRest);

var withStream = new FirstN(5, streamThatWillGetTheFirst5);

something.pipe(withStream).pipe(streamThatWillGetTheRest);
```

# license

MIT
