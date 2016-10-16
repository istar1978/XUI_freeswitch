all: grunt

grunt:
	cd jsapp && grunt

setup:
	cd jsapp && \
	npm install && \
	bower install
