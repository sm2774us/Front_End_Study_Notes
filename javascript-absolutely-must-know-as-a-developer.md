# JavaScript-Absolutely Must Know As A Developer

## Table of Contents
- [1) Understand the JS functions well](#1-understand-the-js-functions-well)
- [2) Understand `bind`, `apply`, and `call`](#2-understand-bind-apply-and-call)
- [3) Understand JavaScript scope well (Closures as well)](#3-understand-javascript-scope-well-closures-as-well)
- [4) Understand this keyword well (global, function and object scopes)](#4-understand-this-keyword-well-global-function-and-object-scopes)
- [5) Understand objects well (Object.freeze, Object.seal)](#5-understand-objects-well-objectfreeze-objectseal)
- [6) Understand Prototypical Inheritance well](#6-understand-prototypical-inheritance-well)
- [7) Understand the callbacks and promises well](#7-understand-the-callbacks-and-promises-well/)
- [8) Understand the regular expressions well](#8-understand-the-regular-expressions-well)
- [9) Understand Map, Reduce and Filter well](#9-understand-map-reduce-and-filter-well)
- [10) Understand Error handling patterns](#10-understand-error-handling-patterns)
- [Other things to know (Hoisting, Event Bubbling)](#other-things-to-know-hoisting-event-bubbling)
- [References](#references)

## 1) Understand the JS functions well
Functions are the cream of JavaScript. They are the first class citizens. Without knowing JS functions in depth, your knowledge is severely caveated. A JS function is more than a normal function. Unlike in other languages, a function can be assigned to a variable, passed around as an argument to another function and can also be returned from another. Hence, it is the first class citizen in the JS.

I am not going to explain what is a function here, but do you know that few things can surprise you? Like this!

```JavaScript
console.log(square(5));
/* ... */
function square(n) { return n * n; }
```

This code snippet executes 25. True! See the second code snippet

```JavaScript
console.log(square(5));
 
var square = function(n) { 
  return n * n; 
}
```

In the first sight, you might be tempted to say it too prints 25. False! Instead, it shouts for the first line.

```
TypeError: square is not a function
```

In JavaScript, if you define a function as a variable, the variable name will be hoisted but you cannot access until JS execution encounters its definition. Aren’t you surprised?

Leave it. You might have seen this syntax frequently somewhere in some code.

```JavaScript
var simpleLibrary = function() {
   var simpleLibrary = {
        a,
        b,
        add: function(a, b) {
            return a + b;
        },
        subtract: function(a, b) {
            return a - b;   
        }
   }
  return simpleLibrary;
}();
```

Why people do this weird thing? It is a function variable that has variables and functions encapsulated which do not pollute the global scope. Libraries ranging from jQuery to Lodash use this technique to provide you $ etc.

The point I put here is “learn functions well”. There are many subtle traps in how we use them. Go through Mozilla’s well-written write-up on functions.


> **Functions**
>
> [_Functions_ - Functions are one of the fundamental building blocks in JavaScript.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

**[⬆ back to top](#table-of-contents)**

## 2) Understand `bind`, `apply`, and `call`
These functions you might see in all famous libraries. These allow something called currying using which we can compose the functionality into different functions. A good JavaScript developer can tell you about these three at any time.

Basically, these are the prototype methods of functions to alter behavior to achieve something. According to Chad, a JS developer, the usage is like this

Basically, these are the prototype methods of functions to alter behavior to achieve something. According to Chad, a JS developer, the usage is like this

* Use `.bind()` when you want that function to be called later with a certain context, useful in events. 
* Use `.call()` or `.apply()` when you want to invoke the function immediately, with modification of the context.

**A saving call!**
Let us see what the above statement means! Suppose your maths teacher asked you to create a library and submit it. You wrote an abstract library which finds area and circumference of the circle.
```JavaScript
var mathLib = {
    pi: 3.14,
    area: function(r) {
        return this.pi * r * r;
    },
    circumference: function(r) {
        return 2 * this.pi * r;
    }
};
```
You submitted library to the professor. Now it is time to submit code which calls that math library.
```JavaScript
mathLib.area(2);
12.56
```
While submitting second code samples, you found in guidelines that professor asked you to use constant **pi** with 5 decimals precision. 
Oh gosh! You just used 3.14, not 3.14159. Now you have no chance to send the library as the deadline was over. JS **`call`** function saves you. Just call your code in this way
```JavaScript
mathLib.area.call({pi: 3.14159}, 2);
```
and it takes your new pi value on the fly. The output is
```
12.56636
```
Which makes your professor happy! If you observe the **`call`** function takes two arguments:
* Context
* Function arguments

A context is an object that replaces **`this`** keyword inside the area function. Later arguments are passed as function arguments. For Ex:
```JavaScript
var cylinder = {
    pi: 3.14,
    volume: function(r, h) {
        return this.pi * r * r * h;
    }
};
```

Call invocation is like this
```JavaScript
cylinder.volume.call({pi: 3.14159}, 2, 6);
75.39815999999999
```

Did you see those function arguments are passed as subsequent arguments after context object?
___Apply___ is exactly same except Function arguments are passed as a list.
```JavaScript
cylinder.volume.apply({pi: 3.14159}, [2, 6]);
75.39815999999999
```
If you know **`call`**, you know **`apply`** and vice versa. Now, what is **`bind`**?

___Bind___ attaches a brand new this to a given function. In bind’s case, the function is not executed instantly 
like ___Call___ or ___Apply___.
```JavaScript
var newVolume = cylinder.volume.bind({pi: 3.14159}); // This is not instant call
// After some long time, somewhere in the wild 
newVolume(2,6); // Now pi is 3.14159
```

What is the use of ___Bind___? It allows us to inject a context into a function which returns a new function with updated context. It means this variable will be user supplied variable. This is very useful while working with JavaScript events.

> ___You should know these three functions to compose functionality in JavaScript___
>

**[⬆ back to top](#table-of-contents)**

## 3) Understand JavaScript scope well (Closures as well)
JavaScript scope is a pandora's box. Hundreds of tough interview questions can be framed from this single concept. There are three kinds of scopes:
* Global scope
* Local Scope/Function scope
* Block scope(Introduced in ES6)

Global scope is what we usually do
```JavaScript
x = 10;
function Foo() {
  console.log(x); // Prints 10
}
Foo()
```

Function scope comes into picture when you define a variable locally.
```JavaScript
pi = 3.14;
function circumference(radius) {    
     pi = 3.14159;
     console.log(2 * pi * radius); // Prints "12.56636" not "12.56"
}
circumference(2);
```

ES16 standard introduced a new block scope which limits a variable’s scope to a given parenthesis block.
```JavaScript
var a = 10;

function Foo() {
  if (true) {
    let a = 4;
  }

  alert(a); // alerts '10' because the 'let' keyword
}
Foo();
```

Functions & conditions are considered as blocks. Above example should alert 4 because conditional statements are executed. But ES6 destroys scope of block variables and scope went into global.

Now comes the magical scope. It can be achieved using closures. JavaScript closure is a function that returns another function.

If someone asks you this question. Write a design that takes a string and returns a character at a time. If the new string is given, it should replace the old one. It is simply called a generator.

```JavaScript
function generator(input) {
      var index = 0;
      return {
           next: function() {
                   if (index < input.length) {
                        index += 1;
                        return input[index - 1];
                   }
                   return "";
           } 
      }
}
```

Execution goes in this way!
```JavaScript
var mygenerator = generator("boomerang");
mygenerator.next(); // returns "b"
mygenerator.next() // returns "o"
mygenerator = generator("toon");
mygenerator.next(); // returns "t"
```

Here, the scope is playing an important role. A closure is a function that returns another function and wraps data. The above string generator qualifies for a closure. The ___index___ value is preserved between multiple function calls. The internal function defined can access the variables defined in the parent function. This is a different scope. If you defined one more function in the second level function, that can access all parent’s variables.

> ___JavaScript Scope can throw a lot of problems at you! understand it thoroughly___
>

**[⬆ back to top](#table-of-contents)**

## 4) Understand `this` keyword well (global, function and object scopes)
In JavaScript, we always compose code with functions and objects. If you take the browser, in the global context it refers to the window object. I mean this will evaluate to true if you open browser console right now and enter this.
```JavaScript
this === window;
```
When the context and scope of program changes, ___this___ at that particular point changes accordingly. Now see ___this___ in a local context is:
```JavaScript
function Foo(){
  console.log(this.a);
}
var food = {a: "Magical this"};
Foo.call(food); // food is this
```
Now you will be tempted to predict this output.
```JavaScript
function Foo(){
    console.log(this); // prints {}?
}
```
Nope, it won’t. Because this is a global object here. Remember, whatever parent scope is, it will be inherited by the child. So it prints the window object. The three methods we discussed are actually used to set ___this___ object.
Now comes the last type of this. ___this___ in object scope. Here
```JavaScript
var person = {
    name: "Stranger",
    age: 24,
    get identity() {
        return {who: this.name, howOld: this.age};
    }
}
```
I just used getter syntax which is a function that can be called as a variable.
```JavaScript
person.identity; // returns {who: "Stranger", howOld: 24}
```
Here, this is actually referring to the object itself. ___this___ as we previously mentioned behaves differently in different places. Know them well.

**[⬆ back to top](#table-of-contents)**

## 5) Understand objects well (Object.freeze, Object.seal)
Many of us know objects like this.
```JavaScript
var marks = {physics: 98, maths:95, chemistry: 91};
```

It is a map that stores Key, Value pairs. JavaScripts objects have a special property of storing anything as a value. It means we can store a list, another object, a function etc as a value. What not?
You can create an object in these ways:
```JavaScript
var marks = {};
var marks = new Object();
```

You can easily convert a given object into a JSON string and also reverse it back using JSON object’s ___stringify___ and ___parse___ methods respectively.
```JavaScript
// returns "{"physics":98,"maths":95,"chemistry":91}"
JSON.stringify(marks);
// Get object from string
JSON.parse('{"physics":98,"maths":95,"chemistry":91}');
```

So what are a few things about objects you should know?

Iterating over the object is easy, using ___Object.keys___
```JavaScript
var highScore = 0; 
for (i of Object.keys(marks)) {
   if (marks[i] > highScore)
      highScore = marks[i];
}
```

___Object.values___ returns the list of values of an object.

Other important functions on an object are:
* ___Object.prototype(object)___
* ___Object.freeze(function)___
* ___Object.seal(function)___

___Object.prototype___ provides more important functions that have many applications. Some of them are:

___Object.prototype.hasOwnProperty___ is useful to find out whether a given property/key exists in an object.

```JavaScript
marks.hasOwnProperty("physics"); // returns true
marks.hasOwnProperty("greek"); // returns false
```

___Object.prototype.instanceof___ evaluates whether a given object is the type of a particular prototype(we will see them in the next section, they are functions).

```JavaScript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
var newCar = new Car('Honda', 'City', 2007);
console.log(newCar instanceof Car); // returns true
```

Now comes the other two functions. ___Object.freeze___ allows us to freeze an object so that existing properties cannot be modified.

```JavaScript
var marks = {physics: 98, maths:95, chemistry: 91};
finalizedMarks = Object.freeze(marks);
finalizedMarks["physics"] = 86; // throws error in strict mode
console.log(marks); // {physics: 98, maths: 95, chemistry: 91}
```

Here we are trying to modify the value of the ___physics___ property after freezing the object. But, JavaScript will not allow doing that. We can find whether a given object is frozen or not like this.

```JavaScript
Object.isFrozen(finalizedMarks); // returns true
```

___Object.seal___ is slightly different from the ___freeze___. It allows configurable properties but won’t allow new property addition or deletion or properties.

```JavaScript
var marks = {physics: 98, maths:95, chemistry: 91};
Object.seal(marks);
delete marks.chemistry; // returns false as operation failed
marks.physics = 95; // Works!
marks.greek = 86; // Will not add a new property
```

We can also check whether a given object is sealed using this

```JavaScript
Object.isSealed(marks); // returns true
```

There are many other important functions/methods available on the global ___Object___ function. Find them here.

> **Object**
>
> [_Object_ - The Object constructor creates an object wrapper.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

**[⬆ back to top](#table-of-contents)**

## 6) Understand Prototypical Inheritance well
In traditional JavaScript, there is the concept of inheritance in a camouflage. It is by using a technique of prototyping. All the new class syntax you see in ES5, ES6 is just a syntactical sugar coating for the underlying prototypical OOP. Creating a class is done using a function in JavaScript.

```JavaScript
var animalGroups = {
  MAMMAL: 1,
  REPTILE: 2,
  AMPHIBIAN: 3,
  INVERTEBRATE: 4
};
function Animal(name, type) {
  this.name = name;
  this.type = type;
}
var dog = new Animal("dog", animalGroups.MAMMAL);
var crocodile = new Animal("crocodile", animalGroups.REPTILE);
```

Here we are creating objects for the class (using ___new___ keyword). We can add methods for a given class(function) like this. Attach a class method like this.

```JavaScript
Animal.prototype.shout = function() {
    console.log(this.name + 'is ' + this.sound + 'ing...');
}
```

Here you may get a doubt. There is no sound property in the class. Yes! there is hardly a sound property defined. That is intended to be passed by the child classes who inherit above class.

In JavaScript, inheritance is achieved like this.

```JavaScript
function Dog(name, type) {
   Animal.call(this, name, type);
   this.sound = "bow";
}
```

I defined one more specific function called ___Dog___. Here, in order to inherit the Animal class, we need to perform ___call___ function(we discussed it earlier) with passing ___this___ and other arguments. We can instantiate a German Shepard like this.

```JavaScript
var pet = Dog("germanShepard", animalGroups.MAMMAL);
console.log(pet); // returns Dog {name: "germanShepard", type: 1, sound: "bow"}
```

We are not assigning name and type in the child function, we are calling super function ___Animal___ and setting the respective properties. The ___pet___ is having the properties(name, type) of the parent. But what about the methods. Are they inherited too? Let us see!

```JavaScript
pet.shout(); // Throws error
```

What? why did that happen? It happens because we didn’t tell JavaScript to inherit the parent class methods. How to fix that?

```JavaScript
// Link prototype chains
Dog.prototype = Object.create(Animal.prototype);
var pet = new Dog("germanShepard", animalGroups.MAMMAL);

// Now shout method is available
pet.shout(); // germanShepard is bowing...
```

Now shout ___method___ is available. We can check what is the class of given object in JavaScript using the ___object.constructor___ function. Let us check what is the class of our ___pet___.

```JavaScript
pet.constructor; // returns Animal
```

It is vague. The ___Animal___ is a parent class. But what type exactly is the ___pet___? It is a ___Dog___ type. This occurs because of the constructor of ___Dog___ class.

```JavaScript
Dog.prototype.constructor; // returns Animal
```

It is ___Animal___. We should set it to ___Dog___ class itself so that all instances(objects) of the class should give correct class name where it belongs to.

```JavaScript
Dog.prototype.constructor = Dog;
```

These four things you should remember about prototypical inheritance.
* Class properties are bound using ___this___
* Class methods are bound using ___prototype___ object
* To inherit properties, use ___call___ function passing ___this___ object
* To inherit methods, use ___Object.create___ to link prototypes of parent and child
* Always set child class constructor to itself for getting the right identity of its objects

**Note:** These are things happens under the hood even with new class syntax. Knowing this is valuable for your JS knowledge.

> In JS, ___call___ function and ___prototype___ object provides inheritance
>

**[⬆ back to top](#table-of-contents)**

## 7) Understand the callbacks and promises well
Callbacks are the functions those executed after an I/O operation is done. A time taking I/O operation can block the code not allowing further execution in Python/Ruby. But in JavaScript, due to the allowed asynchronous execution, we can provide callbacks to the async functions. The example is an AJAX(XMLHttpRequest) call from the browser to a server, events generated by the mouse. keyboard etc. Example is

```JavaScript
function reqListener () {
  console.log(this.responseText);
}

var req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", "http://www.example.org/example.txt");
req.send();
```

Here ___reqListener___ is the callback which will be executed when a ___GET___ request to is successfully responded back.

Promises are neat wrappers for callbacks which allows us to asynchronous code elegantly. I discussed a lot about promises here. This is also an important piece that should be known in JS.

> **Writing neat asynchronous Node JS code with Promises**
>
> [Write beautiful code with JavaScript Promises](https://medium.com/dev-bits/writing-neat-asynchronous-node-js-code-with-promises-32ed3a4fd098)
>
> ![promises-article-icon](./assets/promises-article-icon.PNG)
>

**[⬆ back to top](#table-of-contents)**

## 8) Understand the regular expressions well
Regular expressions have many applications. Processing text, enforcing rules on user input, etc. A JavaScript developer should know how to perform basic Regex and solve problems. Regex is a universal concept. We here see how we can do that from JS.

We can create a new regular expression using this

```JavaScript
var re = /ar/;
var re = new RegExp('ar'); // This too works
```

The above regular expression is an expression that matches with the given set of strings. Once a regex is defined, we can try to fit and see the matching string. we can match strings using ___exec___ function.

```JavaScript
re.exec("car"); // returns ["ar", index: 1, input: "car"]
re.exec("cab"); // returns null
```

There are few special character classes which allow us to write complex regular expressions.

There are many types of elements in RegEx. Some of them are:

* Characters Ex: \w — Alphanumeric, \d — Decimal, \D — Non decimal
* Character classes Ex: [x-y] in range x to y, [^x] not x
* Quantifiers Ex: +, ?, * (greedy and lazy matchers)
* Boundaries Ex: ^(beginning of input), $(end of input)

Using the above things, let us illustrate a few examples.

```JavaScript
/* Character class */

var re1 = /[AEIOU]/;
re1.exec("Oval"); // returns ["O", index: 0, input: "Oval"]
re1.exec("2456"); // null

var re2 = /[1-9]/;
re2.exec('mp4'); // returns ["4", index: 2, input: "mp4"]

/* Characters */

var re4 = /\d\D\w/;
re4.exec('1232W2sdf'); // returns ["2W2", index: 3, input: "1232W2sdf"]
re4.exec('W3q'); // returns null

/* Boundaries */

var re5 = /^\d\D\w/;
re5.exec('2W34'); // returns ["2W3", index: 0, input: "2W34"]
re5.exec('W34567'); // returns null

var re6 = /^[0-9]{5}-[0-9]{5}-[0-9]{5}$/;
re6.exec('23451-45242-99078'); // returns ["23451-45242-99078", index: 0, input: "23451-45242-99078"]
re6.exec('23451-abcd-efgh-ijkl'); // returns null

/* Quantifiers */

var re7 = /\d+\D+$/;
re7.exec('2abcd'); // returns ["2abcd", index: 0, input: "2abcd"]
re7.exec('23'); // returns null
re7.exec('2abcd3'); // returns null

var re8 = /<([\w]+).*>(.*?)<\/\1>/;
re8.exec('<p>Hello JS developer</p>'); //returns  ["<p>Hello JS developer</p>", "p", "Hello JS developer", index: 0, input: "<p>Hello JS developer</p>"]
```

For more details on regex, skim through this cheatsheet page.

> **Regex Cheat Sheet**
>
> [Regular Expressions Syntax Reference. Includes tables showing syntax, examples and matches.](http://www.rexegg.com/regex-quickstart.html)
>
> ![regex-oreilly-book-icon](./assets/regex-oreilly-book-icon.PNG)
>

Along with ___exec___, there are other functions namely ___match___, ___search___ and, ___replace___ are available for finding a string in another using regular expressions. But these functions should be used on the string itself.

```JavaScript
"2345-678r9".match(/[a-z A-Z]/); // returns ["r", index: 8, input: "2345-678r9"]
"2345-678r9".replace(/[a-z A-Z]/, ""); // returns 2345-6789
```
Regex is an important topic that should be understood by developers for solving complex problems easily.

**[⬆ back to top](#table-of-contents)**

## 9) Understand Map, Reduce and Filter well
Functional programming is a discussion topic these days. Many programming languages are including functional concepts like lambdas into their newer versions (Ex: Java >7). In JavaScript support for functional programming constructs exists for a long time. There are three main functions we need to learn deeply. Mathematical functions take some input and return output. A pure function always returns the same output for the given input. The functions we discuss now also satisfy the purity.

#### map
The ___map___ function is available on a JavaScript array. Using this function, we can get a new array by applying a transformation function on each and every element in the array. The general syntax for JS array **map** operation is:

```JavaScript
arr.map((elem){
    process(elem)
    return processedValue
}) // returns new array with each element processed
```

Suppose, there are few unwanted characters entered into serial keys we are working with recently. We need to remove them. Instead of removing the character by iterating and finding, we can use ___map___ to perform the same operation and get result array.

```JavaScript
var data = ["2345-34r", "2e345-211", "543-67i4", "346-598"];
var re = /[a-z A-Z]/;

var cleanedData = data.map((elem) => {return elem.replace(re, "")});

console.log(cleanedData); // ["2345-34", "2345-211", "543-674", "346-598"]
```

**Note:** We used the arrow syntax for function definition in JavaScript ES6

The ___map___ takes a function as an argument. That function has an argument. That argument is picked from the array. We need to return the processed element and that will be applicable to all elements in the array.

#### reduce
Reduce function reduces a given list to one final result. We can also do the same thing by iterating the array and saving the intermediate result in a variable. But here this is a cleaner way to reduce an array to a value. The general syntax for JS ___reduce___ operation is:

```JavaScript
arr.reduce((accumulator,
           currentValue,
           currentIndex) => {
           process(accumulator, currentValue)
           return intermediateValue/finalValue
}, initialAccumulatorValue) // returns reduced value
```

The ___accumulator___ stores the intermediate and final value. The ___currentIndex___, ___currentValue___ are index and, the value of the element from the array respectively. ___initialAccumulatorValue___ passes that value to accumulator argument.

One practical application for ___reduce___ can be flattening an array of arrays. Flattening is converting internal arrays to one single array. For Ex:

```JavaScript
var arr = [[1, 2], [3, 4], [5, 6]];
var flattenedArray = [1, 2, 3, 4, 5, 6];
```

We can achieve this by normal iteration. But using ___reduce___, it is a straight code. Magic!

```JavaScript
var flattenedArray = arr.reduce((accumulator, currentValue) => {
    return accumulator.concat(currentValue);
}, []); // returns [1, 2, 3, 4, 5, 6]
```

#### filter

This is the third type of functional programming concept. It is close to ___map___ as it also processes each element in the array and finally returns another array(not returning a value like in ___reduce___). The length of the filtered array can be less than or equal to the original array. Because the filtering condition we pass may exclude few/zero inputs in the output array. The general syntax for JS ___filter___ operation is:

```JavaScript
arr.filter((elem) => {
   return true/false
})
```

Here ___elem___ is the data element of the array and true/false should be returned from the function to indicate inclusion/exclusion of filtered element. The common example is to filter the array of words which starts and ends with given conditions. Suppose, we should filter an array of words which starts with ___t___ and ends with ___r___.

```JavaScript
var words = ["tiger", "toast", "boat", "tumor", "track", "bridge"]
var newData = words.filter((elem) => {
   return elem.startsWith('t') && elem.endsWith('r') ? true:false;
}); // returns ["tiger", "tumor"]
```

These three functions should be at your fingertips whenever someone asks you about the functional programming aspects of JavaScript. As you see, the original array is not changed in all three cases which are proving the purity of these functions.

**[⬆ back to top](#table-of-contents)**

## 10) Understand Error handling patterns

This is the least cared piece of JavaScript by many developers. I see a very handful of developers talking about error handling. A good development approach always carefully wrap JS code around try/catch blocks.

Nicholas C. Zakas, a UI engineer at Yahoo, said back in 2008 “Always assume your code will fail. Events may not be handled properly! Log them to the server. Throw your own errors.”

In JavaScript whenever we code casually, things may fail. For Ex:

```JavaScript
$("button").click(function(){
    $.ajax({url: "user.json", success: function(result){
        updateUI(result["posts"]);
    }});
});
```

Here, we are falling into the trap saying results always will be a JSON object. Sometimes the server can crash and null will be returned instead of the result. In that case, null[“posts”] will throw an error. The proper handling could be this!

```JavaScript
$("button").click(function(){
    $.ajax({url: "user.json", success: function(result){
    
      try {     
        updateUI(result["posts"]);
       }
      catch(e) {
        // Custom functions
        logError();
        flashInfoMessage();      
      }
    }});
});
```

The ___logError___ function is intended to report the error back to the server. The second function ___flashInfoMessage___ is the function that displays a user-friendly message like “Service unavailable currently” etc.

Nicholas says manually throw errors whenever you feel something unexpected is going to happen. Differentiate between fatal and non-fatal errors. The above error is related to the backend server going down which is fatal. There, you should inform the customer that the service is down due to some reason. In some cases, it may not be fatal but better to notify sever about this. In order to create such code, first, throw an error, catch it with error event at ___window___ object level, then make an API call to log that message to the server.

```JavaScript
reportErrorToServer = function (error) {
  $.ajax({type: "POST", 
          url: "http://api.xyz.com/report",
          data: error,
          success: function (result) {}
  });
}

// Window error event
window.addEventListener('error', function (e) {
  reportErrorToServer({message: e.message})
})}

function mainLogic() {
  // Somewhere you feel like fishy
  throw new Error("user feeds are having fewer fields than expected...");
}
```

This code basically does three things:

1. Listen to Errors on window level
2. Whenever an error occurs, make an API call
3. On the server, log it!

You can also use the new ___Boolean___ function(ES5, ES6) to check whether a variable is valid and not ___null___ (or) ___undefined___ before proceeding.

```JavaScript
if (Boolean(someVariable)) {
// use variable now
} else {
    throw new Error("Custom message")
}
```

Always think how to handle the errors, not in the browser but yourself. Things can fail!

**[⬆ back to top](#table-of-contents)**

## Other things to know (Hoisting, Event Bubbling)
All the above concepts are primary for a JavaScript developer. There are few internal details to know those can be really helpful. Those are how JavaScript engine works in the browser. What are Hoisting and Event Bubbling?

#### Hoisting
Hoisting is a process of pushing the declared variables to the top of the program while running it. For Ex:

```JavaScript
doSomething(foo); // used before
var foo; // declared later
```

When you do above thing in a scripting language like Python, it throws an error. You need to first define and use it. Even though JS is a scripting language, it has a mechanism of hoisting. In this mechanism, a JavaScript VM does two things while running a program:

* First scan the program, collect all the variable and function declarations and assign memory spaces for it.
* Run the program now by filling variable values assigned any, if not, fill ___undefined___

In the above code snippet, ___console.log___ prints “undefined”. It is because in the first pass variable ___foo___ is collected. VM looks for any value defined for variable ___foo___. This hoisting can result in many JavaScript code situations where code can throw errors in some places and uses undefined silently in another. You should be knowing hoisting to clear the ambiguity! See a few examples!

> **Hoisting**
>
> [Hoisting is a term you will not find used in any normative specification prose prior to ECMAScript® 2015 Language…](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

#### Event Bubbling
Now comes the event bubbling! According to Arun P, a senior software engineer:

> “Event bubbling and capturing are two ways of event propagation in the HTML DOM API when an event occurs in an element inside another element, and both elements have registered a handler for that event. The event propagation mode determines in which order the elements receive the event.”
>

With bubbling, the event is first captured and handled by the innermost element and then propagated to outer elements. With capturing, the process is in reverse. We usually attach an event to a handler using the ___addEventListener___ function.

```JavaScript
addEventListener("click", handler, useCapture=false)
```

The third argument ___useCapture___ is the key. The default value is false. So, it will be a bubbling model where the event is handled by the innermost element first and it propagates outwards till it reaches the parent element. If that argument is true, it is capturing model.

For Ex: **Bubbling Model**

```JavaScript
<div onClick="divHandler()">
    <ul onClick="ulHandler">
        <li id="foo"></li>
    </ul>
</div>

<script>
function handler() {
 // do something here
}

function divHandler(){}

function ulHandler(){}

document.getElementById("foo").addEventListener("click", handler)
</script>
```

When we click the list element, the order of execution of handlers is like this in bubbling (default) model.

```
handler() => ulHandler() => divHandler()
```

![event-bubbling](./assets/event-bubbling.png)

In the diagram, handlers are firing sequentially outwards. Similarly, a capturing model tries to fire events inwards from parent to the element clicked. Now change this single line in the above code.

```JavaScript
document.getElementById("foo").addEventListener("click", handler, true)
```

The order of execution of handlers then will be:

```
divHandler => ulHandler() => handler()
```

![capturing-model](./assets/capturing-model.png)

You should understand the event bubbling(whether direction occurs towards parent or towards the child) properly to implement the user interfaces (UI) to avoid any unwanted behaviours.

These are the basic concepts in JavaScript. As I initially mentioned, in addition to them, your work experience and knowledge, preparation helps you crack a JavaScript interview. Always keep learning. Keep an eye on the latest developments(ES6). Dig deeper into various aspects of JavaScript like V6 engine, tests, etc. Here are a few video resources that will teach you many things. Finally, no interview is successful without mastering Data structures & Algorithms. [Oleksii Trekhleb](https://github.com/trekhleb) curated a wonderful git repo that consists of all interview preparation algorithms with JS code. Go through them.

> _trekhleb/javascript-algorithms_
>
> [Algorithms and data structures implemented in JavaScript with explanations and links to further reading...](https://github.com/trekhleb/javascript-algorithms)
>
> ![Oleksii-Trekhleb](./assets/Oleksii-Trekhleb.PNG)
>

[![JavaScript: Understanding the Weird Parts - The First 3.5 Hours](https://img.youtube.com/vi/Bv_5Zv5c-Ts/0.jpg)](https://youtu.be/Bv_5Zv5c-Ts)

[![Compiling for the Web with WebAssembly (Google I/O '17)](https://img.youtube.com/vi/6v4E6oksar0/0.jpg)](https://youtu.be/6v4E6oksar0)

[![JavaScript Patterns for 2017 - Scott Allen](https://img.youtube.com/vi/hO7mzO83N1Q/0.jpg)](https://youtu.be/hO7mzO83N1Q)

**[⬆ back to top](#table-of-contents)**

## References:

> ___Inheritance in JavaScript___
>
> [This article has covered the remainder of the core OOJS theory and syntax that we think you should know now. At this...](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

> ___Object.prototype.constructor___
>
> [Returns a reference to the Object constructor function that created the instance object. Note that the value of this...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

> ___Using XMLHttpRequest___
>
> [To send an HTTP request, create an XMLHttpRequest object, open a URL, and send the request. After the transaction...](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>


> ___Regular Expressions___
>
> [Regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions...](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
>
> ![mozilla-icon](./assets/mozilla.PNG)
>

> ___What is event bubbling and capturing?___
>
> [What is the difference between event bubbling and capturing? Of the two, which is faster and better model to use?](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing)
>
> ![stackoverflow](./assets/stackoverflow.PNG)
>

> ___ganqqwerty/123-Essential-JavaScript-Interview-Question___
>
> [123-Essential-JavaScript-Interview-Question - JavaScript Interview Questions](https://github.com/ganqqwerty/123-Essential-JavaScript-Interview-Question)
>
> ![123-Essential-JavaScript-Interview-Question](./assets/123-Essential-JavaScript-Interview-Question.PNG)
>

**[⬆ back to top](#table-of-contents)**
