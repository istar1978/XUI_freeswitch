HASH=$(shell git rev-parse HEAD | cut -b 1-8)

all:
	cd jsapp && make

githash:
	cd jsapp && make githash

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
	cd jsapp && make release

clean:
	rm -f www/assets/js/jsx/*
	rm -f out/*


out:
	mkdir out

tar: out
	echo $(HASH)
	tar cvzf out/xui-1.0.0.$(HASH).tar.gz www lua
	ls out

sync:
	rsync -raz www/ $(path)
