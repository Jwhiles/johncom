(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{38:function(t,e,a){var n=a(41);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,a(4).default)("0f221ebc",n,!0,{sourceMap:!1})},40:function(t,e,a){"use strict";a(38)},41:function(t,e,a){(t.exports=a(3)(!1)).push([t.i,'.board[data-v-501a3d32]{padding:8px;background:#e0c680;display:inline-block}.row[data-v-501a3d32]{display:flex}.row[data-v-501a3d32],.space[data-v-501a3d32]{background:linear-gradient(#000,#000) 0 50%/100% 1px no-repeat}.space[data-v-501a3d32]{transform:rotate(90deg);padding:1px}.emptySpace[data-v-501a3d32],.stone[data-v-501a3d32]{content:" ";width:20px;height:20px}.stone[data-v-501a3d32]{border-radius:50%}.black[data-v-501a3d32],.stone[data-v-501a3d32]{background:#000}.white[data-v-501a3d32]{background:#fff}',""])},44:function(t,e,a){"use strict";a.r(e);var n={props:{board:Array}},o=(a(40),a(0)),s=Object(o.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"board"},t._l(t.board,(function(e){return a("div",{staticClass:"row"},t._l(e,(function(e){return a("div",{staticClass:"space"},[0===e?a("div",{staticClass:"emptySpace"}):t._e(),t._v(" "),1===e?a("div",{staticClass:"black stone"}):t._e(),t._v(" "),2===e?a("div",{staticClass:"white stone"}):t._e()])})),0)})),0)}),[],!1,null,"501a3d32",null).exports,r=[[0,0,0,0,0,0],[0,2,1,1,0,0],[0,1,0,0,0,0],[0,1,0,1,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],i={components:{GoBoard:s},data:function(){return{board:r}}},d=function(t){var e,a,n,o,s,r=(n=void 0,o="rendering-go-problems",s="baduk",(e={}).type=a="post",e.internal=n,e.contentType="markdown",e.slug=o,e.content=n,e.createdAt=new Date(16147296e5),e.updatedAt=new Date(1656786165598),e.layout=a,e.title="Rendering Go problems on the blog",e.date="2021-03-03",e.tags=["go",s],e.markdownHeadings=[{text:"Rendering Go problems",slug:o,level:1}],e.excerpt="<p>I'm currently learning to play Go/baduk, and I thought that it would be\nnice to include sections of a Go board on this website. I didn't\nreally want to do it through taking screenshots of\n<a href=\"https://online-go.com/\">OGS</a>. Additionally, as a Vim user, I was determined that\nI shouldn't have to use a mouse or GUI to share go problems.\nInstead I've made a Vue component that lets me type a Go board into my markdown files.</p>\n",e.permalink="/posts/rendering-go-problems.html",e.assets={},e.attributes=e,e.tagsInfo=[{name:"go",permalink:"/tags/go"},{name:s,permalink:"/tags/baduk"}],e),i=t.options.beforeCreate||[];t.options.beforeCreate=[function(){this.$page=r}].concat(i);["layout","transition"].forEach((function(e){var a=t.options.PageComponent;a&&(t.options[e]=a[e]),void 0===t.options[e]&&(t.options[e]=r[e])})),r.slug&&(t.options.name="page-wrapper-"+r.slug.replace(/[^0-9a-z\-]/gi,"-"))},l=Object(o.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("layout-manager",[a("h1",{attrs:{id:"rendering-go-problems"}},[t._v("Rendering Go problems")]),t._v(" "),a("p",[t._v("I'm currently learning to play Go/baduk, and I thought that it would be\nnice to include sections of a Go board on this website. I didn't\nreally want to do it through taking screenshots of\n"),a("saber-link",{attrs:{to:"https://online-go.com/"}},[t._v("OGS")]),t._v(". Additionally, as a Vim user, I was determined that\nI shouldn't have to use a mouse or GUI to share go problems.\nInstead I've made a Vue component that lets me type a Go board into my markdown files.")],1),t._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":""}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-text"}},[a("code",{pre:!0,attrs:{class:"language-text"}},[t._v("// 0 = emtpy\n// 1 = black\n// 2 = white\nconst board = \n  [ [0,0,0,0,0,0]\n  , [0,2,1,1,0,0]\n  , [0,1,0,0,0,0]\n  , [0,1,0,1,0,0]\n  , [0,0,0,0,0,0]\n  , [0,0,0,0,0,0]\n  ]\n\n<GoBoard \n  :board=board\n  />")])])]),a("p",[t._v("renders as")]),t._v(" "),a("GoBoard",{attrs:{board:t.board}}),t._v(" "),a("p",[t._v("This was the first time I've written a Vue component, and coming from React it\nseems deeply strange. Having to use a templating DSL which has loops and if statements\nwritten as HTML attributes seems really backwards. I can't see why I\nwould choose Vue over React for any complex project, but maybe I'm missing\nsomething. If you can tell me what Vue is good for please get in touch!")]),t._v(" "),a("p",[t._v("ciao.")])],1)}),[],!1,null,null,null);"function"==typeof d&&d(l);e.default=l.exports}}]);