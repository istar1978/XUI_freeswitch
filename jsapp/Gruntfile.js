module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    react: {
      single_file_output: {
        files: {
          '../www/assets/js/jsx/blocks.js': 'src/jsx/blocks.jsx',
          '../www/assets/js/jsx/index.js': 'src/jsx/index.jsx'
        }
      },
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'src/jsx',
            src: ['**/*.jsx', '!blocks.jsx', '!index.jsx'],
            dest: 'src/js/jsx',
            ext: '.js'
          }
        ]
      }
    },

    bower_concat: {
      all: {
        dest: '../www/assets/js/_bower.js',
        cssDest: '../www/assets/js/_bower.css',
        exclude: [
          // 'jquery',
          'modernizr'
        ],
        dependencies: {
          'jquery-json': 'jquery'
        },
        mainFiles: {
          'jquery-json': 'dist/jquery.json.min.js'
        },
        bowerOptions: {
          relative: false
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: '../www/assets/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          '../www/assets/js/bower.min.js': ['<%= bower_concat.all.dest %>'],
          '../www/assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    qunit: {
        all: {
          options: {
            urls: [
              'http://localhost:8081/test/dashboard.html',
              'http://localhost:8081/test/dashboard.html#show/application',
            ]
          }
        }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat', 'bower_concat', 'sass']
      // tasks: ['jshint', 'qunit']
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-qunit');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');
  // grunt.loadNpmTasks('grunt-contrib-sass');
  // grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('unglify', ['jshint', 'qunit', 'concat', 'bower_concat', 'uglify']);
  // grunt.registerTask('default', ['jshint', 'react', 'concat', 'bower_concat']);
  grunt.registerTask('default', ['bower_concat']);

};
