# Fork-Pool

[![Build Status](https://secure.travis-ci.org/thisandagain/fork-pool.png?branch=master)](http://travis-ci.org/thisandagain/fork-pool)

## Installation

```bash
npm install fork-pool
```

## Basic Use

```javascript
// Parent process
var Pool    = new pool(__dirname + '/child.js', null, null, {});
Pool.enqueue('hello', function (err, obj) {
    console.dir(obj);   // FTW!
});
```

```javascript
// Child process
process.on('message', function (message) {
    process.send('world');
});
```

## Parameters

- path: Child process path (generally, you will want to prefix with "__dirname")
- args: Child process arguments
- options: Child process options
- settings: Pool settings
    - name (Optional, Defaults to "fork-pool")
    - size (Optional, Defaults to # of CPUs)
    - log (Optional, Defaults to false)
    - timeout (Optional, Defaults to 30000ms)

## Testing

```bash
npm test
```