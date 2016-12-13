all:
	cd jsapp && make

watch:
	cd jsapp && make watch

livereload:
	cd jsapp && make livereload

grunt:
	cd jsapp && grunt

setup:
	cd jsapp && \
	npm install #&& \
#	bower install

csetup:
	cd jsapp && \
	cnpm install && \
	bower install

release:
	echo todo ...

