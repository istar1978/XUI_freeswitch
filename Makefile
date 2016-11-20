all:
	npm run build

watch:
	npm run build:watch

livereload:
	npm run livereload

grunt:
	cd jsapp && grunt

setup:
	cd jsapp && \
	npm install && \
	bower install

release:
	echo todo ...

