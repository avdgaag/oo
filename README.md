# OO.js

**A few simple helper methods to help you do object-oriented javascript**

*Author*: Arjan van der Gaag  
*URL*: [http://avdgaag.github.com/oo](http://avdgaag.github.com/oo)  
*License*: MIT license  
*Version*: 0.1.0

---

## Installation

Simple include the script on your page:

```html
<script src="oo.js"></script>
```

...or `require` it in your node.js project:

```js
var OO = require('oo.js');
```

This library is not yet published as an NPM package, but you
can download it manually and install it yourself if you want
to using `npm install`. Once I can think of a better name,
I might release it as a package.

## Usage example

```js
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
    OO.extends(Child.prototype, Module);
    function Child(foo, bar) {
        Child.__super__.constructor.call(this, foo);
        this.bar = bar;
    }
    Child.prototype.getFoo = function() {
        return Child.__super__.getFoo.call(this) + '!';
    };
})();
```

Use properties like normal, even those that are set using the
parent's constructor function:

```js
var c = new Child('a', 'b');
c.foo; // => 'a'
c.bar; // => 'b'
```

Note how the child object decorates the parent object:

```js
c.getFoo(); // => 'a!'
```

Also note that a method can be bound to an object:

```js
c.getFoo.call({ foo: 'c' }); // => 'a!'
```

Finally, we have mixed in a module, so its properties become available:

```js
c.getBar(); // => 'b'
```

## Change log

See CHANGELOG for release history.

## License

See LICENSE for details. Released under the MIT License.
