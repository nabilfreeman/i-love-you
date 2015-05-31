module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    s3: {
      options: {
        region: 'us-east-1',
        access: 'public-read',
        debug: false,
        gzip: true
      },
      default: {
        options: {
          key: process.env.key,
          secret: process.env.secret,
          bucket: "cosmic.instafork.com"
        },

        sync: [
          {
            src: 'site/**/*.*',
            dest: '/',
            rel: 'site',
            options: {
              verify: true
            }
          }
        ]
      }
    },
  });
  grunt.loadNpmTasks('grunt-s3');
};
