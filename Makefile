install:
	npm install

build-elm:
	node ./scripts/createBlogIndex.js
	rm -rf dist
	npx parcel build index.html
	mkdir dist/posts
	cp posts/* dist/posts/

watch:
	node ./scripts/createBlogIndex.js
	npx parcel index.html
