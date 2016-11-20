# XUI Readme

# Design

ToDo...

## Coding Style:

C: 4 spaces TAB
CSS/JS/HTML: https://github.com/felixge/Node-style-guide

## run

install npm tools first

    npm install -g jshint
    npm install -g browserify
    npm install -g watch
    npm install -g wiredep-cli
    npm install -g usemin-cli
    npm install -g browserify
    npm install --save-dev babel-cli

    npm install
    bower install

## Development

prepare:

    make setup

on terminal 1:

    make livereload

on terminal 2:

    make watch

build:

    make

Enjoy!

see: <http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/>
and  <http://react-bootstrap.github.io/getting-started.html>
and <https://github.com/lukehoban/es6features>

## config

see: conf/verto-directory-conf.xml

enable livearry-sync on conference profile:

    <param name="conference-flags" value="livearray-sync"/>

ref: conf/verto.conf.xml, then https://your-ip:8082

Have fun!
