process.on('message', function (message) {
    var s = Math.floor(Math.random()*2001);
    var e = new Date().getTime() + (s);
    while (new Date().getTime() <= e) {
        ;
    }

    if (message === 'hello') {
        process.send('world');
    }
});