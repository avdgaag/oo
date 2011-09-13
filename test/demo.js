var OO = require('../src/oo.js');

var Parent = (function() {
    function Parent(foo) {
        this.foo = foo;
        this.getFoo = OO.bind(this, this.getFoo);
    }
    Parent.prototype.getFoo = function() {
        return this.foo;
    };
    return Parent;
})();

var Module = {
    getBar: function() {
        return this.bar;
    }
};

var Child = (function() {
    OO.inherits(Child, Parent);
    OO.extend(Child.prototype, Module);
    function Child(foo, bar) {
        Child.__super__.constructor.call(this, foo);
        this.bar = bar;
    }
    Child.prototype.getFoo = function() {
        return Child.__super__.getFoo.call(this) + '!';
    };
    return Child;
})();

var c = new Child('a', 'b');

var expected = ['a', 'b', 'a!', 'a!', 'b'];
var actual   = [c.foo, c.bar, c.getFoo(), c.getFoo.call({ foo: 'c' }), c.getBar()];
console.log(expected);
console.log(actual);
