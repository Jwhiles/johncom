install:
	npm install

build:
	rm -rf dist
	npm run build
	mv public dist

netlify-build:
	make build

