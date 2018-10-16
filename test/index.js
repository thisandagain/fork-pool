/**
 * Unit test suite.
 *
 * @package fork-pool
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var path = require('path')

var async = require('async')

var test = require('tap').test

var Pool = require('../lib/index.js')

var pool = new Pool(path.resolve(__dirname, 'child.js'), null, null, {})

async.auto(
    {
        enqueue: function(callback) {
            pool.enqueue('hello', callback)
        },

        stress: function(callback) {
            var load = []
            var instance = function(callback) {
                pool.enqueue('hello', callback)
            }

            for (var i = 0; i < 10; i++) {
                load.push(instance)
            }

            async.parallel(load, callback)
        },

        test: [
            'enqueue',
            'stress',
            function(callback, obj) {
                test('Component definition', function(t) {
                    t.type(pool, 'object', 'Component should be an object')
                    t.type(
                        pool.enqueue,
                        'function',
                        'Method should be a function',
                    )
                    t.type(
                        pool.drain,
                        'function',
                        'Method should be a function',
                    )
                    t.end()
                })

                test('Enqueue', function(t) {
                    t.type(obj.enqueue, 'object', 'Results should be an object')
                    t.equal(
                        obj.enqueue.stdout,
                        'world',
                        'Results should be expected response',
                    )
                    t.end()
                })

                test('Stress', function(t) {
                    t.type(obj.stress, 'object', 'Results should be an object')
                    t.equal(
                        obj.stress.length,
                        10,
                        'Results should equal input length',
                    )
                    t.equal(
                        obj.stress[0].stdout,
                        'world',
                        'Results should be expected response',
                    )
                    t.end()
                })

                callback()
            },
        ],
    },
    function(err, obj) {
        test('Catch errors', function(t) {
            t.equal(err, null, 'Errors should be null')
            t.end()
        })

        pool.drain(function(err) {
            test('Catch errors', function(t) {
                t.equal(err, null, 'Errors should be null')
                t.end()
            })
        })
    },
)
