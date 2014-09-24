/**
 * A generic child process "fork" pool for node.
 *
 * @package fork-pool
 * @author Andrew Sliwinski <andrewsliwinski@acm.org>
 */

/**
 * Dependencies
 */
var _               = require('lodash');
var childProcess    = require('child_process');
var generic         = require('generic-pool');

/**
 * Constructor
 */
function Pool (path, args, options, settings) {
    _.defaults(settings, {
        name:       'fork-pool',
        size:       require('os').cpus().length,
        log:        false,
        timeout:    30000,
        debug:		false,
        debugPort:	process.debugPort	// Default debugging port for the main process. Skip from here.
    });

    //

    this.pool       = generic.Pool({
        settings: settings,
        name: settings.name,
        create: function (callback) {
            var debugArgIdx = process.execArgv.indexOf('--debug');
            if (debugArgIdx !== -1) {
                // Remove debugging from process before forking
                process.execArgv.splice(debugArgIdx, 1);
            }
            if (this.settings.debug) {
                // Optionally set an unused port number if you want to debug the children.
                // This only works if idle processes stay alive (long timeout), or you will run out of ports eventually.
                process.execArgv.push('--debug=' + (++this.settings.debugPort));
            }
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
