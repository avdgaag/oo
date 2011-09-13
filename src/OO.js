// **A few simple helper methods to help you do object-oriented javascript**
//
// *Author*: Arjan van der Gaag  
// *URL*: [http://avdgaag.github.com/oo](http://avdgaag.github.com/oo)  
// *License*: MIT license  
// *Version*: 0.1.0
//
// ---
//
// ## Installation
//
// Simple include the script on your page:
//
//     <script src="oo.js"></script>
// 
// ...or `require` it in your node.js project:
//
//     var OO = require('oo.js');
// 
// This library is not yet published as an NPM package, but you
// can download it manually and install it yourself if you want
// to using `npm install`. Once I can think of a better name,
// I might release it as a package.
//
// ## Usage example
//
//     var Parent = (function() {
//         function Parent(foo) {
//             this.foo = foo;
//             this.getFoo = OO.bind(this, this.getFoo);
//         }
//         Parent.prototype.getFoo = function() {
//             return this.foo;
//         };
//         return Parent;
//     })();
//
//     var Module = {
//         getBar: function() {
//             return this.bar;
//         }
//     };
//
//     var Child = (function() {
//         OO.inherits(Child, Parent);
//         OO.extends(Child.prototype, Module);
//         function Child(foo, bar) {
//             Child.__super__.constructor.call(this, foo);
//             this.bar = bar;
//         }
//         Child.prototype.getFoo = function() {
//             return Child.__super__.getFoo.call(this) + '!';
//         };
//     })();
//
// Use properties like normal, even those that are set using the
// parent's constructor function:
//
//     var c = new Child('a', 'b');
//     c.foo; // => 'a'
//     c.bar; // => 'b'
//
// Note how the child object decorates the parent object:
//
//     c.getFoo(); // => 'a!'
//
// Also note that a method can be bound to an object:
//
//     c.getFoo.call({ foo: 'c' }); // => 'a!'
//
// Finally, we have mixed in a module, so its properties become available:
//
//     c.getBar(); // => 'b'
//

// ---
(function() {
    var OO = {

        // ### Generics

        // Publish the current version of the library, should you ever
        // need it at runtime.
        version: '0.1.0',

        // ### OO helper methods

        // Extend one object with the properties of another.
        // 
        // This essentially mixes in all properties of `guest` into `host`,
        // which is not only great for merging hashes but also allowing
        // objects to include modules.
        extend: function(host, guest) {
            for(var key in guest) {
                if(guest.hasOwnProperty(key)) {
                    host[key] = guest[key];
                }
            }
        },

        // Simulate inheritence of one object (`child`) from another (`parent`).
        //
        // This creates a _ghost-class_ that shares its prototype with the parent,
        // and an instanceof which acts as prototype for the child. This allows
        // the child to share the prototype properties of the parent, without
        // being able to modify them directly (we don't want them to be _the
        // same_ properties).
        //
        // Furthermore, this extends the child constructor itself with any
        // properties of the parent constructor, and it sets a `__super__`
        // property that allows access to the parent functions, enabling
        // the child to decorate its parent's functions.
        inherits: function(child, parent) {
            this.extend(child, parent);
            function Ghost() { this.constructor = child; }
            Ghost.prototype = parent.prototype;
            child.prototype = new Ghost;
            child.__super__ = parent.prototype;
        },

        // Bind a function to a particular context.
        //
        // Being able to dynamically set the execution context of a 
        // function using `call` or `apply` is really handy, but
        // when your functions are assumed to be method objects,
        // they really need to maintain access to their object's
        // state. Using `bind` you can force a context on a
        // function.
        //
        // Example:
        //
        //     var obj = {
        //       foo: 'bar',
        //       speak: function() { return this.foo; }
        //     };
        //     obj.speak(); // => 'bar'
        //     obj.speak.call({ foo: 'qux' }) // => 'qux'
        //     obj.speak = bind(obj, obj.speak);
        //     obj.speak.call({ foo: 'qux' }) // => 'bar'
        //
        bind: function(context, fn) {
            return function() {
                return fn.apply(context, arguments);
            };
        }

    };

    // ### Exporting to gobal object
    //
    // Make the OO object available on the window object -- the global
    // object when running inside a browser -- or as an export, so you
    // can use it as a CommonJS module.
    if(typeof module === 'undefined' || !module.exports) {
        window.OO = OO;
    } else {
        module.exports = OO;
    }
})();
