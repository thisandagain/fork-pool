/**
 * A generic child process "fork" pool for node.
 *
 * @package fork-pool
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var _               = require('underscore'),
    childProcess    = require('child_process'),
    generic         = require('generic-pool');

/**
 * Constructor
 */
function Pool (path, args, options, settings) {
    _.defaults(settings, {
        name:       'fork-pool',
        size:       require('os').cpus().length,
        log:        false,
        timeout:    30000
    });

    //

    this.pool       = generic.Pool({
        name: settings.name,
        create: function (callback) {
            var childNode = childProcess.fork(path, args, options);
            callback(null, childNode);
        },
        destroy: function (client) {
            client.kill();
        },
        max: settings.size,
        min: settings.size - 1,
        idleTimeoutMillis: settings.timeout,
        log: settings.log
    });
};

Pool.prototype.enqueue = function (data, callback) {
    var instance = this.pool;
    instance.acquire(function (err, client) {
        if (err) {
            callback(err);
        } else {
            client.send(data);
            client.once('message', function (message) {
                var a = {
                    pid:    client.pid,
                    stdout: message
                };

                instance.release(client);
                callback(null, a);
            });
        }
    });
};

Pool.prototype.drain = function (callback) {
    var instance = this.pool;
    instance.drain(function() {
        instance.destroyAllNow();
        callback(null);
    });
};

module.exports = Pool;