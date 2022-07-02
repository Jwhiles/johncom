(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{53:function(e,t,a){"use strict";a.r(t);var n=a(0),o=function(e){var t,a,n,o,s,r,i,l,c=(n=void 0,o="Local development with DynamoDB and JavaScript",s="DynamoDB",r="javascript",i="docker",l="tech",(t={}).type=a="post",t.internal=n,t.contentType="markdown",t.slug="javascript-and-dynamodb",t.content=n,t.createdAt=new Date(16041888e5),t.updatedAt=new Date(1656787202893),t.layout=a,t.title=o,t.date="2020-11-01",t.tags=[s,r,i,l],t.markdownHeadings=[{text:o,slug:"local-development-with-dynamodb-and-javascript",level:1},{text:"Creating the DynamoDB container",slug:"creating-the-dynamodb-container",level:2},{text:"Running the container",slug:"running-the-container",level:3},{text:"The JavaScript stuff",slug:"the-javascript-stuff",level:2},{text:"Making our first table",slug:"making-our-first-table",level:3},{text:"Data in the base",slug:"data-in-the-base",level:3},{text:"Conclusion",slug:"conclusion",level:2}],t.excerpt="<p>I was interested in learning how use DynamoDB, but didn't want to set\nit up on AWS personally because I'm lazy, and scared of accidentally getting\nbilled for 10,000 euros.</p>\n",t.permalink="/posts/javascript-and-dynamodb.html",t.assets={},t.attributes=t,t.tagsInfo=[{name:s,permalink:"/tags/dynamodb"},{name:r,permalink:"/tags/javascript"},{name:i,permalink:"/tags/docker"},{name:l,permalink:"/tags/tech"}],t),d=e.options.beforeCreate||[];e.options.beforeCreate=[function(){this.$page=c}].concat(d);["layout","transition"].forEach((function(t){var a=e.options.PageComponent;a&&(e.options[t]=a[t]),void 0===e.options[t]&&(e.options[t]=c[t])})),c.slug&&(e.options.name="page-wrapper-"+c.slug.replace(/[^0-9a-z\-]/gi,"-"))},s=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("layout-manager",[a("h1",{attrs:{id:"local-development-with-dynamodb-and-javascript"}},[e._v("Local development with DynamoDB and JavaScript")]),e._v(" "),a("p",[e._v("I was interested in learning how use DynamoDB, but didn't want to set\nit up on AWS personally because I'm lazy, and scared of accidentally getting\nbilled for 10,000 euros.")]),e._v(" "),a("p",[e._v("Instead I decided to run it locally in a docker-container.")]),e._v(" "),a("p",[e._v("This article is going to walk through the process that I followed, in case you\nwant to do something similar.")]),e._v(" "),a("h2",{attrs:{id:"creating-the-dynamodb-container"}},[e._v("Creating the DynamoDB container")]),e._v(" "),a("p",[e._v("The first step is to create a "),a("code",{pre:!0},[e._v("docker-compose.yaml")]),e._v(".\nDocker Compose let's us define containers that we want to run to support our\nproject. It's a pretty neat way to set up a development environment.")]),e._v(" "),a("p",[e._v("Here's the file I created")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":"yaml"}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-yaml"}},[a("code",{pre:!0,attrs:{class:"language-yaml"}},[e._v("version: '3' # The version of docker-compose syntax we're using. Just pick 3 I guess\n\nservices: # We define the containers we want to create under this header\n  dynamodb:\n    image: amazon/dynamodb-local # The image we're using. Thanks Amazon.\n    container_name: dynamodb-local\n    ports:\n      - \"8042:8000\" # binds the localhost port on the left, to the container port on the right")])])]),a("h3",{attrs:{id:"running-the-container"}},[e._v("Running the container")]),e._v(" "),a("p",[e._v("You'll need docker installed for this step.")]),e._v(" "),a("p",[e._v("Run this command\n"),a("code",{pre:!0},[e._v("docker-compose -f docker-compose.yaml up -d")])]),e._v(" "),a("p",[a("code",{pre:!0},[e._v("-f")]),e._v(" allows us specify the file to use, in our case this is the\ndocker-compose.yaml we just created")]),e._v(" "),a("p",[a("code",{pre:!0},[e._v("up")]),e._v(" tells docker-compose to “build, (re)create, start, and attache to containers for a service.”\n"),a("code",{pre:!0},[e._v("-d")]),e._v(" specifies that we want to run the container in 'detached' mode.")]),e._v(" "),a("p",[e._v("Now our container should be running. Running "),a("code",{pre:!0},[e._v("docker ps")]),e._v(" in the command line\nshould show that the container is alive and kicking.")]),e._v(" "),a("h2",{attrs:{id:"the-javascript-stuff"}},[e._v("The JavaScript stuff")]),e._v(" "),a("h3",{attrs:{id:"making-our-first-table"}},[e._v("Making our first table")]),e._v(" "),a("p",[e._v("To use DynamoDB in JavaScript, we're going to rely on the aws-sdk. So let's\ninstall it!")]),e._v(" "),a("p",[a("code",{pre:!0},[e._v("yarn add aws-sdk")])]),e._v(" "),a("p",[e._v("And then let's use it to make a table!")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":"javascript"}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-javascript"}},[a("code",{pre:!0,attrs:{class:"language-javascript"}},[e._v("const AWS = require('aws-sdk');\n\nasync function main() {\n  // Even though we're using the SDK locally the SDK will throw an error \n  // if these items are missing. We don't need to use real keys for local\n  // development however.\n  AWS.config.update({\n    region: 'local',\n    accessKeyId: 'random-not-real-id',\n    secretAccessKey: 'random-not-real-key',\n  })\n\n  // Now we create our Client!\n  const dynamoClient = new AWS.DynamoDB({ endpoint: 'http://localhost:8042' })\n\n  // And we can start making tables\n\n  try {\n    await dynamoClient.createTable({\n      // The name  of our table\n      TableName: 'user-info',\n\n      // The attributes that our needed to create our primary key.\n      // We can still store other data as part of each item, but we don't need\n      // to define it as part of the table\n      AttributeDefinitions: [\n        {\n          AttributeName: 'name',\n          AttributeType: 'S',\n        }\n      ],\n\n      // How the primary keys for our table are generated.\n      // In our case we are simply going to hash the attribute 'name'\n      KeySchema: [\n        {\n          AttributeName: 'name',\n          KeyType: 'HASH',\n        },\n      ],\n\n      // Some Config stuff. Ask your ops team about this I guess.\n      ProvisionedThroughput: {\n        ReadCapacityUnits: 5,\n        WriteCapacityUnits: 5,\n      },\n    }).promise()\n\n    console.log('create table user-info')\n\n  } catch (e) {\n    console.error(error)\n    process.exit(1)\n  }\n}")])])]),a("p",[e._v("Although we only specified the attributes that are required to make each items\nprimary key, we can store other data in each item.")]),e._v(" "),a("h3",{attrs:{id:"data-in-the-base"}},[e._v("Data in the base")]),e._v(" "),a("p",[e._v("A thing that puzzled me when looking at the DynamoDB sdk was the difference between a  "),a("code",{pre:!0},[e._v("DynamoClient")]),e._v(" and a "),a("code",{pre:!0},[e._v("DocumentClient")]),e._v(". We used the "),a("code",{pre:!0},[e._v("DynamoClient")]),e._v(" to create our table above, but using that to add data actually becomes quite tricky. We have to painstakingly describe the different keys we'll be adding.")]),e._v(" "),a("p",[e._v("The document client seems to have been added to the SDK to make life easier for JavasScript developers. It gives us some methods that let us interact with our DB using normal JavaScript objects that match the shape of the data we want to store. More details can be seen in "),a("saber-link",{attrs:{to:"https://aws.amazon.com/blogs/developer/announcing-the-amazon-dynamodb-document-client-in-the-aws-sdk-for-javascript/"}},[e._v("this announcement post")]),e._v(".")],1),e._v(" "),a("p",[e._v("Long story short, we're going to use the "),a("code",{pre:!0},[e._v("DocumentClient")]),e._v(" to store data in our\ntable.")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":""}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-text"}},[a("code",{pre:!0,attrs:{class:"language-text"}},[e._v("const docClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8042' })")])])]),a("p",[e._v("Now to make our lives easier let's define a function that adds users to our\ntable.")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":"javascript"}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-javascript"}},[a("code",{pre:!0,attrs:{class:"language-javascript"}},[e._v("const addUser = async (name, email) => {\n  return docClient.put({\n    Item: {\n      name,\n      email\n    },\n    TableName: 'user-info'\n  }).promise()\n}")])])]),a("p",[e._v("and one to list all of our users")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":"javascript"}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-javascript"}},[a("code",{pre:!0,attrs:{class:"language-javascript"}},[e._v("const listUsers = async () => {\n  return docClient.scan({\n    TableName: 'user-info'\n  }).promise()\n}")])])]),a("p",[e._v("We can then use these functions to add some users to our table, and then print\nthem out again.")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":"javascript"}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-javascript"}},[a("code",{pre:!0,attrs:{class:"language-javascript"}},[e._v("const addUsers = async () => {\n  await addUser('bobby', 'bobby@bob.com')\n  await addUser('tomboy', 'tom@boy.com')\n  await addUser('blobby', 'mr@blobby.com')\n  console.log(await listUsers())\n}\n\naddUsers()")])])]),a("p",[e._v("If we run this code we'll see the following output in our terminal")]),e._v(" "),a("div",{pre:!0,attrs:{class:"saber-highlight","data-lang":""}},[a("pre",{pre:!0,attrs:{class:"saber-highlight-code language-text"}},[a("code",{pre:!0,attrs:{class:"language-text"}},[e._v("{\n  Items: [\n    { name: 'bobby', email: 'bobby@bob.com' },\n    { name: 'blobby', email: 'mr@blobby.com' },\n    { name: 'tomboy', email: 'tom@boy.com' }\n  ],\n  Count: 3,\n  ScannedCount: 3\n}")])])]),a("h2",{attrs:{id:"conclusion"}},[e._v("Conclusion")]),e._v(" "),a("p",[e._v("You'se now seen how to set up a local DynamoDB - and how to do some basic\ninteraction with it in JavaScript. A runnable version of the code in this\narticle can be "),a("saber-link",{attrs:{to:"https://github.com/Jwhiles/dynamo-something"}},[e._v("found here")]),e._v(".")],1)])}),[],!1,null,null,null);"function"==typeof o&&o(s);t.default=s.exports}}]);