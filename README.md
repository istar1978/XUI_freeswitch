# XUI Readme

This project is in active development and is not ready for production use.

## Design

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
    npm install -g watchify
    npm install --save-dev babel-cli

    cd jsapp
    npm install
    bower install

or if you are in China, see <https://npm.taobao.org/>

    cnpm install -g jshint
    cnpm install -g browserify
    cnpm install -g watch
    cnpm install -g wiredep-cli
    cnpm install -g usemin-cli
    cnpm install -g watchify
    cnpm install --save-dev babel-cli

    cd jsapp
    cnpm install
    bower install

## Development

prepare:

    make setup

or if you are in China:

    make csetup

on terminal 1:

    make livereload

on terminal 2:

    make watch

build:

    make

Enjoy!

* <http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/>
* <http://react-bootstrap.github.io/getting-started.html>
* <https://github.com/lukehoban/es6features>

## config

see: conf/verto-directory-conf.xml

enable livearry-sync on conference profile:

    <param name="conference-flags" value="livearray-sync"/>

ref: conf/verto.conf.xml, then https://your-ip:8082

More:

* <https://facebook.github.io/react/>
* <http://react-bootstrap.github.io/>
* <https://www.npmjs.com/package/i18n-react>
* <https://github.com/ReactTraining/react-router>
* <http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem>

Have fun!
