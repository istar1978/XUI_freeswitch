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
    npm install -g babel-cli
    npm install -g uglifyjs

    cd jsapp
    npm install
    bower install

or if you are in China, use taobao mirror

    npm config set registry https://registry.npm.taobao.org

or use cnpm see <https://npm.taobao.org/> for more info

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

init db:

    cd db/schema && cat sqlite.sql init*.sql | sqlite3 /usr/local/freeswitch/db/xui.db

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

* <http://getbootstrap.com/2.3.2/index.html>
* <http://www.bootcss.com/>
* <http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/>
* <http://react-bootstrap.github.io/getting-started.html>
* <https://github.com/lukehoban/es6features>

## config

see: conf/verto-directory-conf.xml

enable livearry-sync on conference profile:

    <param name="conference-flags" value="livearray-sync"/>

ref: conf/verto.conf.xml, then https://your-ip:8082

# Update

If you pull/update code from github chances are we added new npm packages, so make sure `cd jsapp && npm install` if you see wired erros.

More:

* <https://facebook.github.io/react/>
* <http://react-bootstrap.github.io/>
* <https://www.npmjs.com/package/i18n-react>
* <https://github.com/ReactTraining/react-router>
* <http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem>
* <https://github.com/bradwestfall/CSS-Tricks-React-Series>
* <https://github.com/kaivi/riek>
* <http://tutorials.pluralsight.com/ruby-ruby-on-rails/building-a-crud-interface-with-react-and-ruby-on-rails>

## The multiple ways of creating components

I'm not sure wether we should use `React.createClass` way or the `extends React.Component` way. Pete Hunt (former Facebook React team developer) once wrote:

> "You may see some talk about ES6 classes being the preferred way to create React components. This is untrue. Most people (including Facebook) are using React.createClass()."

I'm not saying there's anything wrong with the ES6 way, I'm just saying you don't have to feel bad or behind if you do it the older React.createClass way.

Have fun!
