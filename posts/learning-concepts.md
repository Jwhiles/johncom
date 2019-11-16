+++
title=How I like to learn things
date=1573827116433
tags=["functional programming", "learning"]
+++

# How I like to learn things

I came into the software industry through a [bootcamp](https://www.foundersandcoders.com/).
I'm very happy about this, and would recommend it. But it has
left me with certain gaps in my knowledge of computer science. I've been trying
to plug these gaps over time, using the [wealth of online resources](https://teachyourselfcs.com/)
that are availables. This along with my employers willingness to buy me as many
programming books as I can read is helping me to gradually convince more and
more people that I might be competent one day.

I believe there is a problem with many of resources recommend to
people interested in computer science. That by focusing on
imperative programming they obscure the concepts that they purportedly meant to
teach.

My experience of works focused on algorithm or data structure design has often
been one of getting lost in null checks, and endlessly mutating variables.

I propose that if you want to learn these topics you may be better served by
reading pseudocode - and trying to create your own implementations of the
algorithm or data structure in a language that focuses on clarity over speed.

## Example

Let us take trees as an example. Conceptually the binary tree is very simple.
It is recursive structure consisting of a node containing a value, which has
up to two child nodes, which share the same structure.

In _popular functional language_ this can be defined like so

```elm
type BinaryTree a
    = Node
        { value : a
        , leftChild : BinaryTree a
        , rightChild : BinaryTree a
        }
    | LeafNode
```

If we understand the syntax of this language, then we can see that this type
definition is close to a definition of the tree itself.
There is little superfluous information.

Compare this to a JavaScript equivalent that I [stole from
here](https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011).

```javascript
class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
}
```

Even if we understand JavaScript perfectly, I don't believe this definition
tells us anything about binary trees.. To make sense of it, and to use it we
have to seperately learn what a binary tree actually is.

In our typed functional language understanding the code that implements a data
structure often means that we also understand the meaning of the data structure.

## Conclusion

The conclusion that I am reaching towards here is not that functional
programming is easy to learn. Rather I believe that to learn any concept, you
should choose an environment that allows you work with that concept isolated from
other concerns as much as possible. For recursive data structures a
strictly typed language that does not allow null values is a good choice.

If you want to learn about pointer dereferencing and memory allocation, you probably
want to choose a different language. (Rust)

ciao.
