var OO = require('../src/OO.js');

var assert = {
    isTrue: function(value) {
        if(!value) {
            throw 'Expected ' + value + ' to be truthy';
        }
    },

    instanceOf: function(child, parent) {
        if(!(child instanceof parent)) {
            throw 'Expected ' + child + ' to be an instance of ' + parent;
        }
    },

    notEquals: function(expected, actual) {
        if(expected === actual) {
            throw 'Expected ' + actual + ' not to equal ' + expected;
        }
    },

    equals: function(expected, actual) {
        if(expected !== actual) {
            throw 'Expected ' + actual + ' to equal ' + expected;
        }
    },

    isString: function(value) {
        if(typeof value !== 'string') {
            throw 'Expected a string, but was ' + typeof value;
        }
    }
};
var test = (function() {
    var passed = [], failed = [], pending = [];
    function test(description, fn) {
        if(fn == null) {
            pending.push(description);
        } else {
            try {
                fn();
                passed.push(description);
            } catch(error) {
                failed.push([description, error]);
            }
        }
    }
    test.report = function() {
        console.log("" + (passed.length + failed.length + pending.length) + " tests: " + passed.length + " passed, " + failed.length + " failed, " + pending.length + " pending.");
        for(i = 0, j = failed.length; i < j; i++) {
            console.log('Failure: ' + failed[i][0]);
            console.log('  ' + failed[i][1]);
        }
        if(pending.length > 0) {
            console.log('Pending:');
            for(i = 0, j = pending.length; i < j; i++) {
                console.log('  ' + pending[i]);
            }
        }
    }
    return test;
})();

test('version is a string', function() {
    assert.isString(OO.version)
});

test('extend copies own attributes', function() {
    var a = { foo: 'bar' }, b = { baz: 'qux' };
    OO.extend(a,b);
    assert.equals('qux', a.baz);
});

test('extend overrides attributes', function() {
    var a = { foo: 'bar' }, b = { foo: 'qux' };
    OO.extend(a,b);
    assert.equals('qux', a.foo);
});

test('extend does not copy prototype attributes', function() {
    var a = {}, b = [1,2,3];
    b.foo = 'bar';
    OO.extend(a, b);
    assert.equals(3, b.length);
    assert.notEquals(3, a.length);
});

test('bind gives same result', function() {
    var a = function() { return 'foo'; };
    a = OO.bind({}, a);
    assert.equals('foo', a());
});

test('bind sets context', function() {
    var a = function() { return this.foo };
    assert.equals('foo', OO.bind({ foo: 'foo' }, a)());
    assert.equals('bar', OO.bind({ foo: 'bar' }, a)());
});

test('bind passes along all arguments', function() {
    var a = function(foo) { return foo; };
    a = OO.bind({}, a);
    assert.equals('bar', a('bar'));
});

test('inherits extends child', function() {
    var a = function() {}, b = function() {};
    b.foo = 'bar';
    OO.inherits(a,b);
    assert.equals('bar', a.foo);
});

test('inherits set super property', function() {
    var a = function() {}, b = function() {};
    OO.inherits(a,b);
    assert.equals(a.__super__, b.prototype);
});

test('inherits shares prototype functions', function() {
    var A = function() { this.bar = 'baz'; },
        B = function() { this.bar = 'qux'; };
    B.prototype.foo = function() { return this.bar; };
    OO.inherits(A,B);
    var a = new A, b = new B;
    assert.equals('qux', b.foo());
    assert.equals('baz', a.foo());
});

test('inherits does not let child override parent', function() {
    var A = function() {}, B = function() {};
    B.prototype.foo = 'bar';
    OO.inherits(A,B);
    A.prototype.foo = 'baz';
    b = new B;
    assert.equals('bar', b.foo);
});

test('inherits keeps instanceof', function() {
    var A = function() {}, B = function() {};
    OO.inherits(A,B);
    var a = new A;
    assert.instanceOf(a, A);
});

test('inherits keeps constructor', function() {
    var A = function() {}, B = function() {};
    OO.inherits(A,B);
    var a = new A;
    assert.equals(a.constructor, A);
});

test.report();
