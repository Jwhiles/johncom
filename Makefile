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
