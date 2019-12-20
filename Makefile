install:
	yarn

build-elm:
	node ./scripts/createBlogIndex.js
	rm -rf dist
	npx parcel build index.html
	./scripts/distributePosts.sh

watch:
	node ./scripts/createBlogIndex.js
	npx parcel index.html

build-static:
	mkdir -p dist/blog
	npx elm make src/Main.elm --output elm.js
	node ./scripts/buildStaticBlogs.js

netlify-build:
	make build-elm
	make build-static


