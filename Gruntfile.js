/*global module:false*/

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    // distributables location
    dist: 'target',
    // Application package:
    pkg: grunt.file.readJSON(grunt.template.process('package.json')),
    manifest: grunt.file.readYAML('manifest.yml'),
    // Cloud Foundry target
    cf_env: (grunt.file.readJSON('cf-targets.json'))[(grunt.option('cf-target') || 'us-bluemix-demo')],
    // hostname
    //hostname: '<%= cf_env.prefix ? cf_env.prefix + "-" : "" %><%= manifest.applications[0].host %><%= cf_env.suffix ? "-" + cf_env.suffix : "" %>',
    //domain: '<%= cf_env.domain || manifest.applications[0].domain %>',
    // Source header
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
      '* Licensed <%= pkg.license %> */\n',
    // Task configuration.
    env : {
      options : {
      //Shared Options Hash
      },
      unit_test : {
        LOCATIONS_UNIT_TESTING : 'true',
        TEST_ROUTE : '',
        TEST_PORT : '3000'
      },
      dev : {
        LOCATIONS_UNIT_TESTING : 'false',
        TEST_REMOTE : 'true',
        TEST_ROUTE : '',
        TEST_PORT : '80'
      }
    },
    
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        files: [{
            expand: true,     // Enable dynamic expansion.
            cwd: '.',         // Src matches are relative to this path.
            src:['**/*.js', '!node_modules/**/*.*'],
            dest: 'build/'    // Destination path prefix.
        },],
      }
    },
    
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        //src: '<%= concat.dist.dest %>',
        //dest: 'dist/<%= pkg.name %>.min.js'
        files: [{
            expand: true,     // Enable dynamic expansion.
            cwd: 'build/',    // Src matches are relative to this path.
            src: ['**/*.js'], // Actual pattern(s) to match.
            dest: '<%= dist %>/',   // Destination path prefix.
            ext: '.js',       // Dest filepaths will have this extension.
            extDot: 'first'   // Extensions in filenames begin after the first dot
        },],
      }
    },
    
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        trailing: true,
        node: true,
        asi: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['test/**/*.js', '<%= dist %>/test/**/*.js']
      }
    },
    
    qunit: {
      files: ['test/**/*.html']
    },
    
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    
    copy: {
      main: {
        files: [
          // copy build files
          {
            expand: true,
            cwd: '.',
            src: ['cf-services.json', 'cf-targets.json', 'package.json','manifest.yml',
        	      '.cfignore', 'views/**/*.*', 'public/**/*.*', 'i18n/**/*.*', 'config/**/*.*',
        	      '!**/*.js'],
            dest: '<%= dist %>/'
          }
          //{
          //  expand: true,
          //  cwd: 'build',
          //  src: ['**/*.js'],
          //  dest: '<%= dist %>/'
         // }
        ]
      },
      debug: {
        files: [
          // copy build/ files - pre uglify
          {expand: true, cwd: 'build/', src: ['**'], dest: '<%= dist %>/'}
        ]
      }
    },
    
    nodeunit: {
      all: ['test/**/*.js'],
      options: {
        reporter: 'junit',
        reporterOptions: {
          output: '<%= dist %>/failsafe-reports'
        }
      }
    },
    
    clean: ['build/', '<%= dist %>'],
    
    shell: {
      login: {
        command:  function() {
          var target = grunt.config('cf_env.target');
          var org = grunt.config('cf_env.organisation');
          var space = grunt.config('cf_env.space');
          var cmd = [
                'cf login -a ' + target + ' -u ' + process.env.CF_USER + ' -p ' + process.env.CF_PASSWD +
                  ' -o ' + org + ' -s ' + space
                ];
          grunt.log.writeln('Login to Bluemix with\n' +
              '\t target: ' + target + '\n' +
              '\t organisation: ' + org + '\n' +
              '\t space: ' + space + '\n' +
              '\t user: ' + process.env.CF_USER + '\n');
          return cmd.join('&&');
        }
      },
      push: {
        command: function() {
          // Application hostname
          var hostname = grunt.config.get('hostname');
          var dist_dir = grunt.config('dist');
          var app_name = grunt.config('pkg.name');
          var domain = grunt.config.get('domain');
          var cmd = ['cd ' + dist_dir,
                'cf push ' + app_name + ' -n ' + hostname + ' -d ' + domain];
          grunt.log.writeln('Push to Bluemix with\n' +
              '\t app: ' + app_name + '\n' +
              '\t hostname: ' + hostname + '\n' +
              '\t with command: ' + cmd);
          return cmd.join('&&');
        }
      },
      create_services: {
        command: function() {
          var services = grunt.file.readJSON('cf-services.json');
          //var dist_dir = grunt.config('dist');
          //var cmd = ['cd ' + dist_dir + '/'];
          var cmd = [];
          Object.keys(services).forEach(function(key) {
            var service = services[key];
            cmd.push('cf create-service ' + service.type + ' ' + service.plan + ' ' + key);
            grunt.log.writeln('Creating service\n' +
              '\t name: ' + key + '\n' +
              '\t type: ' + services[key].type + '\n' +
              '\t plan: ' + services[key].plan + '\n' +
              '\t commands: ' + cmd);
          });
          return cmd.join('&&');
        }
      }
    }
  });

  //Set hotname, domain and env.dev.TEST_ROUTE in grunt config
  var hostname;
  var route;
  var domain;
  var manifest = grunt.config.get('manifest');
  var pkg = grunt.config.get('pkg');
  var cf_env = grunt.config.get('cf_env');
  grunt.log.writeln('Getting route for ' + hostname);
  manifest.applications.forEach(function(app){
    if(app.name === pkg.name){
      grunt.log.writeln('Found app ' + app.name + ' in manifest.');
      hostname = (cf_env.prefix ? cf_env.prefix + "-" : "") + app.host + (cf_env.suffix ? "-" + cf_env.suffix : "");
      domain = (cf_env.domain ? cf_env.domain : app.domain);
      route = hostname + '.' + domain;
      grunt.log.writeln('Setting route to ' + route);
    }
  });
  grunt.log.writeln('Route is ' + route);
  grunt.config('hostname', hostname);
  grunt.config('domain', domain);
  grunt.config('env.dev.TEST_ROUTE', route);

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-shell');
  
  grunt.registerTask('deploy',
      'Deploy the application to a CF target.\n' +
      'Set up targets in cf-targets.json and services in cf-services.json.\n' +
      'Pass in a target key using the --cf-target=<target key> option. Defaults to "us-bluemix-demo".\n' +
      'Set CF userID and password in environment variables CF_USER and CF_PASSWD.',
      ['env:dev', 'shell:login', 'shell:create_services', 'shell:push', 'nodeunit']);
  grunt.registerTask('create_services',
      'Alias for shell:create_services\n' +
      'Assumes client is already logged in to target and org and space are set.\n' +
      'All we do is create services from information in cf-services.json.\n',
      ['shell:create_services']);
  grunt.registerTask('push',
      'Alias for shell:psuh\n' +
      'Assumes client is already logged in to target and org and space are set.\n' +
      'All we do is push the app. Default name and domain are from manifest.yml, '+
      'but can be overidden from cf-target.json.\n' +
      'Set up host name and domain in cf-targets.json.\n' +
      'Pass in a target key using the --cf-target=<target key> option. Defaults to "us-bluemix-demo\n' +
      'Application names in package.json and manifest.yml must match.',
      ['shell:push']);
  grunt.registerTask('full', ['clean','jshint', 'env:unit_test', 'nodeunit', 'qunit', 'concat', 'uglify', 'copy:main']);
  grunt.registerTask('default', ['clean', 'jshint', 'env:unit_test', 'nodeunit', 'concat', 'uglify', 'copy:main']);
  grunt.registerTask('debug', ['clean', 'jshint', 'nodeunit', 'concat', 'copy:debug']);
  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('notest', ['clean', 'jshint', 'concat', 'uglify', 'copy:main']);
};
