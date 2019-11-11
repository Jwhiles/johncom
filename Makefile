install:
	npm install

build-elm:
	rm -rf dist
	npx parcel build index.html
	mkdir dist/posts
	cp posts/* dist/posts/

watch:
	npx parcel index.html
