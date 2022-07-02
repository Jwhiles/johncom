(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{71:function(e,t,a){"use strict";a.r(t);var i=a(0),s=function(e){var t,a,i,s,n,o,r,l,h=(t="The Beatles",a="Weightlifting",i="Christmas Music",o=void 0,r="Rust",l="Data Structures",(s={}).type=n="post",s.internal=o,s.contentType="markdown",s.slug="week-notes-one",s.content=o,s.createdAt=new Date(16386624e5),s.updatedAt=new Date(1656787202897),s.layout=n,s.title="Some stuff I did this week",s.date="2021-12-05",s.tags=[t,r,l,a,i],s.markdownHeadings=[{text:"What I've been up to recently",slug:"what-ive-been-up-to-recently",level:1},{text:"Data Alignment",slug:"data-alignment",level:2},{text:t,slug:"the-beatles",level:2},{text:a,slug:"weightlifting",level:2},{text:"Hash Maps",slug:"hash-maps",level:2},{text:i,slug:"christmas-music",level:2}],s.excerpt="<p>Hey! Long time no see. Anyway, here's some stuff from the past week or so.</p>\n",s.permalink="/posts/week-notes-one.html",s.assets={},s.attributes=s,s.tagsInfo=[{name:t,permalink:"/tags/the-beatles"},{name:r,permalink:"/tags/rust"},{name:l,permalink:"/tags/data-structures"},{name:a,permalink:"/tags/weightlifting"},{name:i,permalink:"/tags/christmas-music"}],s),d=e.options.beforeCreate||[];e.options.beforeCreate=[function(){this.$page=h}].concat(d);["layout","transition"].forEach((function(t){var a=e.options.PageComponent;a&&(e.options[t]=a[t]),void 0===e.options[t]&&(e.options[t]=h[t])})),h.slug&&(e.options.name="page-wrapper-"+h.slug.replace(/[^0-9a-z\-]/gi,"-"))},n=Object(i.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("layout-manager",[a("h1",{attrs:{id:"what-ive-been-up-to-recently"}},[e._v("What I've been up to recently")]),e._v(" "),a("p",[e._v("Hey! Long time no see. Anyway, here's some stuff from the past week or so.")]),e._v(" "),a("ul",[a("li",[a("saber-link",{attrs:{to:"#data-alignment"}},[e._v("Data Alignnment")])],1),e._v(" "),a("li",[a("saber-link",{attrs:{to:"#the-beatles"}},[e._v("The Beatles")])],1),e._v(" "),a("li",[a("saber-link",{attrs:{to:"#weightlifting"}},[e._v("Weightlifting")])],1),e._v(" "),a("li",[a("saber-link",{attrs:{to:"#hash-maps"}},[e._v("Hash Maps")])],1),e._v(" "),a("li",[a("saber-link",{attrs:{to:"#christmas-music"}},[e._v("Christmas Music")])],1)]),e._v(" "),a("h2",{attrs:{id:"data-alignment"}},[e._v("Data Alignment")]),e._v(" "),a("p",[e._v("I watched "),a("saber-link",{attrs:{to:"https://media.handmade-seattle.com/practical-data-oriented-design/"}},[e._v("this talk")]),e._v(" from the creator of the Zig language. It was pretty nicely done, and introduced some new concepts to me.")],1),e._v(" "),a("p",[e._v("What I learnt:")]),e._v(" "),a("ul",[a("li",[e._v("The concept of Data Alignment in memory.\n"),a("ul",[a("li",[e._v("It is somehow advantageuous if the data you save in computer memory is aligned in 'nice' or 'round numbers'. We say that Data is 'naturally aligned' when its location in memory is a multiple of it's size. So if I have a 16 Byte struct, that I'm saving into 64 Bytes of memory - it will ideally be saved starting at the 0th, 16th, 32nd or 48th index in the memory.")]),e._v(" "),a("li",[e._v("If we have some data structure that is, say, 15 Bytes in size, then we pad it out with extra bytes so it will fit neatly into memory. In the case of a 15 Byte structure we add one extra Byte. probably not a big concern. But if we have a a 17 Byte data structure - this becomes more of a problem. Potentially we waste a lot of memory to padding.")])])]),e._v(" "),a("li",[e._v("Questions I had:\n"),a("ul",[a("li",[e._v("Is the performance gained by padding data structures always necessary? It sounds like it's possible to 'pack' data more tightly - accepting a performance degredation to save on memory. What situations would you choose to do this?")]),e._v(" "),a("li",[e._v("Is this something I should be thinking about if I'm writing, say, TypeScript? Or are high level languages so far divorced from bare metal that these sorts of optimizations can't be done.")])])])]),e._v(" "),a("p",[e._v("The talk also covers various tricks for reducing the size of your data, because by reducing the size of the data, you can often avoid unecessary padding - and be more likely to fit the data you need into a cache - which can make your programs much faster. The actual techniques didn't really particularly applicable to anything I'm doing right now (JavaScript) - so I didn't pay too much attention here. How ever the tricks include")]),e._v(" "),a("ul",[a("li",[e._v("Removing 1 byte flags, by instead storing things in arrays")]),e._v(" "),a("li",[e._v("Not using pointers, instead essentially making your own pointers.. (wuh)")]),e._v(" "),a("li",[e._v("Various other data manipulations, using tags, etc etc. Watch the talk if you're interested.")])]),e._v(" "),a("p",[e._v("The topics covered in this talk feel like things that I would know about if I had done a CS degree. I think it would be useful to find a big list of CS topics that I might not know about, and try to understand at least the basics of all of them. If you have such a list please send it my way!")]),e._v(" "),a("h2",{attrs:{id:"the-beatles"}},[e._v("The Beatles")]),e._v(" "),a("p",[e._v("We watched the first part of Peter Jackson's new trilogy "),a("saber-link",{attrs:{to:"https://de.wikipedia.org/wiki/The_Beatles:_Get_Back"}},[e._v("The Beatles: Get Back")]),e._v(". The first part covers the initial rehearsals/recording sessions of the album Let it Be - which is the only Beatle's album I've ever owned a physical copy of - and one I for some reason really like.")],1),e._v(" "),a("p",[e._v("The film is really fun, and inspiring. I love seeing inside the process that artists take, and it seems like for the Beatles a big part of the process is doing funny accents and singing joke songs. Despite the fact that it shows the lead up to the bands break up, they seem to be having a lot of fun. The footage is incredible, and it's just generally really nice that this thing exists. I really recommend this film.")]),e._v(" "),a("p",[e._v("I've also been listening to lots of Beatles songs. They are good.")]),e._v(" "),a("h2",{attrs:{id:"weightlifting"}},[e._v("Weightlifting")]),e._v(" "),a("p",[e._v("I've recently gotten into weightlifting. While I've enjoyed being skinny my whole life, and it has allowed me to "),a("saber-link",{attrs:{to:"https://models.com/models/john-whiles"}},[e._v("be in fashion")]),e._v(" and cycle up hills quickly, I now feel like it would be fun to be a hunk.")],1),e._v(" "),a("p",[e._v("I've previously read Starting Strength by Mark Rippetoe, which is a widely recommended, and much maligned book. It has pretty good explanations of how various lifts work mechanically, but falls down a bit in terms of programming. His suggested routines are considered to be a bit stupid by a lot of people, and his diet suggestions inclide drinking a Galon (however much that is) of milk every day. Anyway, I started doing that program but have just transitioned into "),a("saber-link",{attrs:{to:"https://www.reddit.com/r/Fitness/comments/6pjiwd/heres_a_quick_summary_of_the_gzclp_linear/"}},[e._v("GZCLP")]),e._v(" which I prefer because it has more deadlifts.")],1),e._v(" "),a("p",[e._v("I've also started making a web app to track my workouts. It doesn't really work yet.")]),e._v(" "),a("h2",{attrs:{id:"hash-maps"}},[e._v("Hash Maps")]),e._v(" "),a("p",[e._v("I've been learning rust recently, and also getting more interested in the nitty gritty of how data structures are implemented in 'low level' languages. I found a quite nice blogpost "),a("saber-link",{attrs:{to:"https://www.andreinc.net/2021/11/08/a-tale-of-java-hash-tables"}},[e._v("here")]),e._v(" about implementing an open addressing hash map in Java. I thought it would be a fun exercise to implement something similar in Rust. I did, and it works, and it was fun. I'll probably write this up in more depth later.")],1),e._v(" "),a("h2",{attrs:{id:"christmas-music"}},[e._v("Christmas Music")]),e._v(" "),a("p",[e._v("Every year I try and release an album of Christmas Music. Every year I start fairly early and it still feels like a rush. Anyway it's started. There is one song done. You can hear the previous one here")]),e._v(" "),a("iframe",{staticStyle:{border:"0",width:"100%",height:"120px"},attrs:{src:"https://bandcamp.com/EmbeddedPlayer/album=632360270/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/",seamless:""}},[a("saber-link",{attrs:{to:"https://johnwhiles.bandcamp.com/album/future-christmas-2020"}},[e._v("Future Christmas 2020 by John Whiles")])],1)])}),[],!1,null,null,null);"function"==typeof s&&s(n);t.default=n.exports}}]);