+++
title=What I learnt making this site
date=1573430400000
+++
# On making this website
I built this website because I wanted start writing a blog. Because I am a
'developer' I didn't want to use a normal blogging platform, figuring that it would
have been boring.

I also didn't want to use a CMS, and or want to use a traditional templating
language. The obvious choice was to use Gatsby or some other React based static
site generator. Instead I built this website using Elm.

## Elm
Using elm has a few obvious disadvantages. Firstly, it's a language that appears
to exist soley to make single page application (SPA). A blog has no real need to
be a SPA. Secondly, there is no real way to perform server side
rendering. So at present, anyone who disables JavaScript in their browser
won't see any of these word. :( 

On the other hand it's a language that is nice to work with, and when all
is said and done it produces fairly small bundles. By the standards of 2019 this
is not a bloated website, despite shipping an completely unneeded runtime.

## How it works

Currently this site consists of three main sections

* A homepage
* A blog index page
* Pages for individual blog posts

As I didn't want to build, or use, a real CMS I decided that all blog
posts would be saved as Markdown files in the same repository as the
sites code. This means that deploying the site is as simple as compiling the
code, then putting it, along with any assets, on a static file server. I think
this is what the kids are calling JAMstack. But without the J or the A.

I needed a way for visitors to this site to discover what I've written, rather
than hoping that they would chance upon the correct Urls. To allow myself to
stick to the 'No CMS' manifesto, I instead decided to write a very shonky script
that whenever the site is run, looks at the contents of the blogposts folders,
and writes a list of paths into an Elm module. I can then just render this
list in one of the sites view functions. It's stupid but it works.

## What did I learn

The only real benefit to making this site was that I learnt a bit about writing Elm.
I hope that by sharing this knowledge I can help advance Humanity's knowledge and put us one
step closer towards utopia/dystopia.

1. If you don't know how to do something, copy [Richard Feldman](https://github.com/rtfeldman/elm-spa-example/)
When I had any problems, I would Richard's Elm Spa codebase until I found an
answer. It never let me down.

2. Netlify makes deploying static sites really easy

3. It's a lot easier to write code than words
This site is needlessly complex, and probably serves it's purpose less
well than any off the shelf blogging platform that I could have chosen. Really I
should be spending my time learning how to write well, finding something to write 
about, and choosing better uses for my coding abilities.

4. Elm is completely fine for making websites.
Really, it is. You don't need typeclasses to stick buttons and words on a page.
