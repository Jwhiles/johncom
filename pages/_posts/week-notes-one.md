---
title: Week Notes one
date: 2021-12-05
tags:
  - The Beatles
  - Rust
  - Data Structures
  - Weightlifting
  - Christmas Music
---
# What I've been up to recently
Hey! Long time no see. Anyway, here's some stuff from the past week or so.

- [Data Alignnment](#data-alignment)
- [The Beatles](#the-beatles)
- [Weightlifting](#weightlifting)
- [Hash Maps](#hash-maps)
- [Christmas Music](#christmas-music)


## Data Alignment
I watched [this talk](https://media.handmade-seattle.com/practical-data-oriented-design/) from the creator of the Zig language. It was pretty nicely done, and introduced some new concepts to me.

What I learnt: 
- The concept of Data Alignment in memory. 
  - It is somehow advantageuous if the data you save in computer memory is aligned in 'nice' or 'round numbers'. We say that Data is 'naturally aligned' when its location in memory is a multiple of it's size. So if I have a 16 Byte struct, that I'm saving into 64 Bytes of memory - it will ideally be saved starting at the 0th, 16th, 32nd or 48th index in the memory. 
  - If we have some data structure that is, say, 15 Bytes in size, then we pad it out with extra bytes so it will fit neatly into memory. In the case of a 15 Byte structure we add one extra Byte. probably not a big concern. But if we have a a 17 Byte data structure - this becomes more of a problem. Potentially we waste a lot of memory to padding.
- Questions I had:
  - Is the performance gained by padding data structures always necessary? It sounds like it's possible to 'pack' data more tightly - accepting a performance degredation to save on memory. What situations would you choose to do this?
  - Is this something I should be thinking about if I'm writing, say, TypeScript? Or are high level languages so far divorced from bare metal that these sorts of optimizations can't be done.
		

The talk also covers various tricks for reducing the size of your data, because by reducing the size of the data, you can often avoid unecessary padding - and be more likely to fit the data you need into a cache - which can make your programs much faster. The actual techniques didn't really particularly applicable to anything I'm doing right now (JavaScript) - so I didn't pay too much attention here. How ever the tricks include

- Removing 1 byte flags, by instead storing things in arrays
- Not using pointers, instead essentially making your own pointers.. (wuh)
- Various other data manipulations, using tags, etc etc. Watch the talk if you're interested.

The topics covered in this talk feel like things that I would know about if I had done a CS degree. I think it would be useful to find a big list of CS topics that I might not know about, and try to understand at least the basics of all of them. If you have such a list please send it my way!

## The Beatles
We watched the first part of Peter Jackson's new trilogy [The Beatles: Get Back](https://de.wikipedia.org/wiki/The_Beatles:_Get_Back). The first part covers the initial rehearsals/recording sessions of the album Let it Be - which is the only Beatle's album I've ever owned a physical copy of - and one I for some reason really like.

The film is really fun, and inspiring. I love seeing inside the process that artists take, and it seems like for the Beatles a big part of the process is doing funny accents and singing joke songs. Despite the fact that it shows the lead up to the bands break up, they seem to be having a lot of fun. The footage is incredible, and it's just generally really nice that this thing exists. I really recommend this film.

I've also been listening to lots of Beatles songs. They are good.

## Weightlifting
I've recently gotten into weightlifting. While I've enjoyed being skinny my whole life, and it has allowed me to [be in fashion](https://models.com/models/john-whiles) and cycle up hills quickly, I now feel like it would be fun to be a hunk. 

I've previously read Starting Strength by Mark Rippetoe, which is a widely recommended, and much maligned book. It has pretty good explanations of how various lifts work mechanically, but falls down a bit in terms of programming. His suggested routines are considered to be a bit stupid by a lot of people, and his diet suggestions inclide drinking a Galon (however much that is) of milk every day. Anyway, I started doing that program but have just transitioned into [GZCLP](https://www.reddit.com/r/Fitness/comments/6pjiwd/heres_a_quick_summary_of_the_gzclp_linear/) which I prefer because it has more deadlifts.

I've also started making a web app to track my workouts. It doesn't really work yet.

## Hash Maps
I've been learning rust recently, and also getting more interested in the nitty gritty of how data structures are implemented in 'low level' languages. I found a quite nice blogpost [here](https://www.andreinc.net/2021/11/08/a-tale-of-java-hash-tables) about implementing an open addressing hash map in Java. I thought it would be a fun exercise to implement something similar in Rust. I did, and it works, and it was fun. I'll probably write this up in more depth later.

## Christmas Music
Every year I try and release an album of Christmas Music. Every year I start fairly early and it still feels like a rush. Anyway it's started. There is one song done. You can hear the previous one here

<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=632360270/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/" seamless><a href="https://johnwhiles.bandcamp.com/album/future-christmas-2020">Future Christmas 2020 by John Whiles</a></iframe>

