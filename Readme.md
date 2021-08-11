# A Multi-cursor variant of iTyped


> Dead simple Animated typing, with no dependencies.

You get a result like this:

<p align="center">
  <img src="https://gist.githubusercontent.com/yoshikiohshima/a9687ad1c5403782d077a8d0dea8e225/raw/3901a24acc45118ae96486906216d40443003db8/multi-cursor-ityped.gif" width="400"/>
</p>

from input like this:

~~~ JavaScript
ityped.init(document.querySelector("#ityped"), {
    showCursor: true,
    disableBackTyping: true,
    typeSpeed: 150,
    work: [
        [{id: 0, append: "M"}],
        [{id: 0, append: "u"}],
        [{id: 0, append: "l"}],
        [{id: 0, append: "t"}],
        [{id: 0, append: "i"}],
        [{id: 0, append: "-"}],
        [{id: 0, append: "c"}],
        [{id: 0, append: "u"}],
        [],
        [{id: 0, backspace: 1}],
        [{id: 0, backspace: 1}],
        [{id: 0, backspace: 1}],
        [                      {id: 1, goto: 5}],
        [],
        [                      {id: 1, append: " "}],
        [],
        [{id: 0, append: "p"}, {id: 1, append: "C"}],
        [],
        [                      {id: 1, append: "u"}],
        [                      {id: 1, append: "r"}],
        [                      {id: 1, append: "s"}],
        [{id: 0, append: "l"}, {id: 1, append: "o"}],
        [                      {id: 1, append: "r"}],
        [{id: 0, append: "e"}],
        [{id: 0, goto: 15}],
        [],
        [{id: 0, append: "s"}],
        [],
        [                      {id: 1, goto: 8}],
    ]
})
~~~

You specify the list of "actions" in an array of arrays, and this code interprets the items in the array to construct animation.
---


Features
------------
 * iTyped has no jQuery dependency.
 * Just install and enjoy!


Installation
------------
If you remove the "export" keyword in src/index.js and uncomment the last line, you can simply load src/index.js in a script tag. Otherwise, run `npm run build` and use the generated dist/index.js.
