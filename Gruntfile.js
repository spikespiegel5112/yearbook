/*!
 * sure-yb-page 's Gruntfile
 */

/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            assetPath: 'src/assets/',
            distPath: 'dist/',
            jsPath: 'src/js/',
            cssPath: 'src/css/',
            srcPath: "src/"
        },

        banner: '/*!\n' +
        ' * =====================================================\n' +
        ' * SOUL v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
        ' * =====================================================\n' +
        ' */\n',

        clean: {
            all: ['<%= meta.distPath %>'],
            sourceMap: ['<%= meta.distPath %>css/*.map']
        },

        useminPrepare: {
            html: 'src/**/*.html',
            options: {
                dest: '<%= meta.distPath %>',
                flow : {
                    html : {
                        steps : {
                            css :[''],
                            js : ['']
                        },
                        post : {

                        }
                    }
                }
            }
        },

        concat: {
            js: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= meta.srcPath %>js/*.js'
                ],
                dest: '<%= meta.distPath %>js/all.js'
            },
            css: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= meta.srcPath %>css/autographbook.css',
                    '<%= meta.srcPath %>css/book__chaptermake.css',
                    '<%= meta.srcPath %>css/book_details.css',
                    '<%= meta.srcPath %>css/book_manage_view_album.css',
                    '<%= meta.srcPath %>css/book_preview.css',
                    '<%= meta.srcPath %>css/bookcreate.css',
                    '<%= meta.srcPath %>css/bookmanage.css',
                    '<%= meta.srcPath %>css/bookmanagement.css',
                    '<%= meta.srcPath %>css/common.css',
                    '<%= meta.srcPath %>css/index.css',
                    '<%= meta.srcPath %>css/invited_to_join.css',
                    '<%= meta.srcPath %>css/login.css',
                    '<%= meta.srcPath %>css/pagemake.css',
                    '<%= meta.srcPath %>css/personal_center.css',
                    '<%= meta.srcPath %>css/reset.css',
                    '<%= meta.srcPath %>css/reset_password.css',
                    '<%= meta.srcPath %>css/user_protocol.css',
                    '<%= meta.srcPath %>css/wallet_and_order.css',
                    '<%= meta.srcPath %>css/help_center.css',
                    '<%= meta.srcPath %>css/use_guide.css',
                    '<%= meta.srcPath %>css/use_guide3.6.css',
                    '<%= meta.srcPath %>css/bookpreview_new.css',
                    '<%= meta.srcPath %>css/book_chaptermake_new.css',
                ],
                dest: '<%= meta.distPath %>css/all.css'
            },
            js_yb: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= meta.srcPath %>js/yearbook/*.js',
                    '<%= meta.srcPath %>js/yearbook/api/*.js',
                    '<%= meta.srcPath %>js/yearbook/page/*.js'
                ],
                dest: '<%= meta.distPath %>js/all_yb.js'
            },
        },

        copy: {
            fonts: {
                expand: true,
                cwd: '<%= meta.srcPath %>',
                src: 'fonts/**/*',
                dest: '<%= meta.distPath %>/'
            },
            assets : {
                expand: true,
                cwd: '<%= meta.srcPath %>',
                src: 'assets/**/*',
                dest: '<%= meta.distPath %>/'
            },
            html : {
                expand: true,
                cwd: '<%= meta.srcPath %>',
                src: '*.html',
                dest: '<%= meta.distPath %>/'
            },
            img : {
                expand: true,
                cwd: '<%= meta.srcPath %>',
                src: 'img/**/*',
                dest: '<%= meta.distPath %>/'
            }
        },

        cssmin: {
            options: {
                banner: '', // set to empty; see bellow
                keepSpecialComments: '*', // set to '*' because we already add the banner in sass
                sourceMap: false
            },
            mui: {
                src: '<%= meta.distPath %>css/all.css',
                dest: '<%= meta.distPath %>css/all.min.css'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: true,
                mangle: true,
                preserveComments: false
            },
            sure: {
                src: '<%= concat.js.dest %>',
                dest: '<%= meta.distPath %>js/all.min.js'
            }
        },

        imagemin: {
            /* 压缩图片大小 */
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= meta.srcPath %>img/',
                        src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                        dest: '<%= meta.distPath %>img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                    }
                ]
            }
        },

        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                },
                livereload: true
            },
            scripts: {
                files: [
                    '<%= meta.cssPath %>/**/*.css',
                    '<%= meta.jsPath %>/**/*.js',
                    '<%= meta.srcPath %>*.html',
                ],
                tasks: 'dist'
            }
        },

        usemin: {
            html: ['<%= meta.distPath %>/*.html'],   // 注意此处是build/
            options: {
                assetsDirs: ['<%= meta.distPath %>/css']
            }
        },

        sed: {
            versionNumber: {
                pattern: (function() {
                    var old = grunt.option('oldver');
                    return old ? RegExp.quote(old) : old;
                })(),
                replacement: grunt.option('newver'),
                recursive: true
            }
        }
    });
    // Load the plugins
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });
    require('time-grunt')(grunt);
    // Default task(s).
    grunt.registerTask('cleanAll', ['clean']);
    grunt.registerTask('dist-css', ['cssmin', 'clean:sourceMap']);
    grunt.registerTask('dist-js', ['concat', 'uglify']);
    grunt.registerTask('dist', ['clean:all', 'useminPrepare', 'dist-js', 'dist-css', 'copy', 'usemin']);
    grunt.registerTask('build', ['dist']);
    grunt.registerTask('default', ['dist']);

    grunt.registerTask('server', ['dist','watch']);



    // Version numbering task.
    // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
    // This can be overzealous, so its changes should always be manually reviewed!
    grunt.registerTask('change-version-number', 'sed');

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
};
