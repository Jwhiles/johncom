install:
	npm install

watch:
	npm run dev

build:
	rm -rf dist
	npm run build
	mv public dist

ci:
	npm ci
	make build

