module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		bower_concat : {
			all : {
				dest : {
					'js' : 'client/public/jsExt/bower.js',
					'css' : 'client/public/css/bower.css'
				},
				mainFiles : {
					bootstrap : 'dist/css/bootstrap.css'
				},
			}
		},
		copy : {
			bower : {
				files : [ {
					expand:true,
					cwd:"bower_components/bootstrap/dist/",
					src : "fonts/*",
					dest : "public/"
				},{
					expand:true,
					cwd:"bower_components/angular-ui-grid/",
					src : ["ui-grid.svg","ui-grid.ttf","ui-grid.woff"],
					dest : "public"
				} ]
			}
		}
	});
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask("default", [ "bower_concat", "copy"]);
}
