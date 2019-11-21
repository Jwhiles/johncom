+++
title=Tries company
date=1574362712465
tags=["functional programming", "data structures", "trees"]
+++
# Implementing a Trie in Haskell

Once upon a time (five months ago) I was doing a phone screening for a _tech job_. To my horror, I was asked to
name a Tree that wasn't a binary search Tree. Being a complete philistine, I had no answer. I was rejected on
the spot. From that day on I have made it my mission to learn about every variation of a Tree that can be
implemented with a small amount of effort in Haskell.

Today we take on _The Trie_

This article is mostly meant as a demonstration of what a Trie is. This is a totally
naive implementation, which is based on skimming the [wikipedia article about Tries](https://en.wikipedia.org/wiki/Trie).
As such you should probably shouldn't use this code anywhere.

Although this is written in haskell, I've tried to avoid anything too weird.
Hopefully this code should be comprehensible for someone who has written Elm.

We'll start by watching me implementing a Trie incorrectly, realising my
mistake, and then correcting it.

## What is a Trie?
A Trie (AKA a Prefix Tree) is a Tree where each node is labelled by some
value. When we traverse the tree these labels can be concatenanted together to find the 
value represented by a leaf node.

For example I might store my friends names in a Trie like this:

```
      B
      |
   ______
  |   |  |
  O   I  A __
  |   |  |   |
  B   L  Z   R
      |      |
      L      B

-- This Trie contains the names Bob, Bill, Baz, and Barb.      ALl my friends.
```

Tries are useful for things like creating an autocompleting
searchbox on your Web 2.0 App. They can really deliver a lot of business value and help you meet your KPIs.

## How to implement a Trie?
### A Tree
A typical binary tree in Haskell can be implemented as follows

```haskell
data Tree a = Node a (Tree a) (Tree a) | Leaf
```

### A Trie
But in the case of a Trie, we aren't certain how many children a given Node will
have. We also want to be able to access a Node's children based on the value
they contain.

That sounds an awful lot like a Map (AKA a Dictionary)...

So let's represent the children using a Map

```haskell
import qualified Data.Map.Strict as M
-- We import a Data.Map, to act as our Dictionary

data Trie = Node (M.Map Char Trie) 
  deriving (Eq, Show)
```

A really simple Trie with just two words, 'hi' and 'hey' using this structure would
look something like this.
```haskell
Node { h = Node { i = Node { }, e = Node { y = Node { } } } }
```

Writing out nodes by hand is no fun. So let's write a function to insert a word.
```haskell
-- First we make a helpful 'empty Trie' constant
empty :: Trie
empty = Node M.empty


-- Then we define the type of our insert function
insert :: String -> Trie -> Trie

-- If the String is empty, we return the Trie as it was
insert "" t = t  

-- Otherwise we split the first character out of the string
-- and check if that character already exists as a child of the Node we're
-- looking at
insert (c:rest) (Node children) =
  case M.lookup c children of

    -- If the character wasn't already there, then we add an empty Trie
    -- under that character to our Map, and then add the rest of the string to 
    -- that new subTrie!
    Nothing ->
      Node $ M.insert c (insert rest empty) children

    -- If the character is already in the Trie then we can recursively call 
    -- insert on that SubTrie with the rest of our string
    Just matchingChildNode ->
      Node (M.insert c (insert rest matchingChildNode) children)
```

Now we can construct the same Trie we saw previously, _but this time with code_
```haskell
ourTrie = insert "hi" $ insert "hey" empty
```

If we run this in our Repl we get
```
Node (fromList
  [ ('h', Node (fromList
    [ ('e',Node (fromList
      [ ('y',Node (fromList [] )) ]))
  , ('i',Node (fromList [])) ])) ])
```
Cool!


## My Biggest mistake
An observant reader might noticed that this Trie implementation is WRONG and BAD

What happens to our Trie if, for KPI related reasons, we need to insert the words "hello" and "hell"?

We can add them both, but there is no possible way us to tell looking at the resulting Trie that the word hell was ever there. It's gone. Vanished. Verschwunden.

We have no way of to distinguish between words that were intentionally added
to the Trie, and random prefixes that have no meaning by themselves.

## Fixing my biggest mistake
This is all fine of course. We can change our Trie defintion such that each node
can either hold onto a specific value, or be empty. An empty node meaning that
the it is simply a step on the path to a node that _does_ represent some
specific word.

```haskell
data Trie 
  = Node String (M.Map Char Trie) 
  | Empty (M.Map Char Trie)
      deriving (Eq, Show)

empty :: Trie
empty = Empty M.empty
```


Let' also make some helper functions for working with our new structure
```haskell
getChildren :: Trie -> M.Map Char Trie
getChildren (Node _ c) = c
getChildren (Empty c) = c

setChildren :: Trie -> M.Map Char Trie -> Trie
setChildren (Node s _) newChildren = Node s newChildren
setChildren (Empty _) newChildren = Empty newChildren
```

Now we need to update our insert function to save the word that we are inserting at 
the end of the Trie branch it is added to

```haskell
insert :: String -> Trie -> Trie
insert word trie = recurse word trie
  where
    recurse :: String -> Trie -> Trie
```
we use an internal helper function, that I've called `recurse` so we can keep hold of the word we are adding - even while recursing.

```haskell
    recurse "" t = Node word (getChildren t)
```
If our string is empty, it means we've finished adding all the characters that make up our word
to the trie - so we can save the full word at this Node and then stop. Phew

```haskell
    recurse (c:rest) t = 
      let children = (getChildren t)
      in case M.lookup c children of
        Just matchingChildNode ->
          setChildren t (M.insert c (recurse rest matchingChildNode) children)
        Nothing ->
          setChildren t $ M.insert c (recurse rest empty) children
```
If there are still characters to add to the Trie, we can recursively add them in much the same way we did before.
We just need to adjust this function a bit to avoid destroying other words that we've already saved in our Trie.

Nice!

## What's in it?
The really useful feature of a Trie, it seems, is to be able to tell us all the
suffixes for a given Node. In our example above, I might start with the letter 'h'
and be told that the possible endings of the word are 'i' and 'ey'. Very useful.

It turns out that writing this function for our Trie is _really_ easy.

first we write a function that can help us get a value out of a given node of a Trie.
```haskell
getValue :: (Applicative m, Monoid (m String)) => Trie -> m String
getValue (Empty _) = mempty
getValue (Node nodeValue _) = pure nodeValue
```

The cool thing about this function is that it will return a different type
depending on the context we use it in. For example if we used it in a context where we expected a Maybe. We'll get a Maybe String. 

In this case we actually want to build a list of values, and this function will helpfully also return values in that format. To get all the words in our Trie we can write a function that recursively get's the values at each node in our Trie, and returns them all in one big list
```haskell
getWords :: Trie -> [ String ]
getWords t = getValue t <> 
               foldMap getWords (getChildren t)
```
Tidy

If we test this like so
```haskell
main = do
  print $
    getWords $ insert "hey" $ insert "hello" $ insert "egg" empty
```
We'll see 

```haskell
["egg", "hello", "hey"]
```

Nice!

## Conclusion

wow. What a journey.
I hope this was in some way useful. It certainly was for me! Next time a phone interviewer asks me to name 
'_any one data structure that isn't a binary search Trie_' I'll have an answer for them!

Below you'll find the complete code, which you can play around with. It's been edited slightly to be more generic. Allowing us to store any lists of values, rather than just Strings (aka lists of characters).

Suggested exercise for the reader
* Write an autocomplete function that takes the start of a word and a trie, and tells us the possible complete words we could make!
* Write a function to delete words from the Trie!
* Think of an application for a Trie that isn't building autocomplete functionality
* Try implementing this in C (jk)


```haskell
{-# Language ScopedTypeVariables #-}

module GenTree where

import qualified Data.Map.Strict as M

data Trie a = Node [a] (M.Map a (Trie a)) | Empty (M.Map a (Trie a))
  deriving (Eq, Show)

empty :: Trie a
empty = Empty M.empty

getValue :: (Applicative m, Monoid (m [a])) => Trie a -> m [a]
getValue (Empty _) = mempty
getValue (Node nodeValue _) = pure nodeValue

getChildren :: Trie a -> M.Map a (Trie a)
getChildren (Node _ c) = c
getChildren (Empty c) = c

setChildren :: Trie a -> M.Map a (Trie a) -> Trie a
setChildren (Node s _) newChildren = Node s newChildren
setChildren (Empty _) newChildren = Empty newChildren


insert :: forall a. (Ord a) => [a] -> Trie a -> Trie a
insert word trie = recurse word trie
  where
    recurse :: [a] -> Trie a -> Trie a
    recurse [] t = Node word (getChildren t)

    recurse (c:rest) t = 
      let children = (getChildren t)
      in case M.lookup c children of
        Just matchingChildNode ->
          setChildren t (M.insert c (recurse rest matchingChildNode) children)
        Nothing ->
          setChildren t $ M.insert c (recurse rest (empty)) children

getWords :: Trie a -> [ [ a ] ]
getWords t = getValue t <> 
               foldMap getWords (getChildren t)
      
main = do
  print $
    getWords $ insert "hey" $ insert "hello" $ insert "egg" empty
  print $
    getWords $ insert [1, 2, 3] $ insert [1, 4, 5] $ insert [1, 50, 2] empty
```
