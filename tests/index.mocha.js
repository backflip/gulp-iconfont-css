var fs = require('fs')
  , gutil = require('gulp-util')
  , scss = require('../src/index')
  , assert = require('assert')
  , Stream = require('stream')
;

describe('gulp-iconfont-scss', function() {

  it('should pass null files through', function(done) {

    var stream = scss({
      filename: 'test',
      template: 'icons.scss.swig'
    })
      , n = 0
      , fakeFile = new gutil.File({
        cwd: "/home/nfroidure/",
        base: "/home/nfroidure/test",
        path: "/home/nfroidure/test/file.svg",
        contents: null
      })
      , fakeFile2 = new gutil.File({
        cwd: "/home/nfroidure/",
        base: "/home/nfroidure/test",
        path: "/home/nfroidure/test/file2.svg",
        contents: null
      })
    ;

    stream.on('data', function(newFile){
      assert(newFile);
      assert.equal(newFile.cwd, "/home/nfroidure/");
      assert.equal(newFile.base, "/home/nfroidure/test");
        assert.equal(newFile.contents, null);
      if(++n == 1) {
        assert.equal(newFile.path, "/home/nfroidure/test/file.svg");
      } else  {
        assert.equal(newFile.path, "/home/nfroidure/test/file2.svg");
      }
    });

    stream.on('end', function() {
      assert.equal(n, 2);
      done();
    });

    stream.write(fakeFile);
    stream.write(fakeFile2);
    stream.end();

  });

  describe('in buffer mode', function() {

    it('should work', function(done) {
      var stream = scss({
        filename: 'test',
        template: 'icons.scss.swig'
      })
        , n = 0
        , fakeFile = new gutil.File({
          cwd: "/home/nfroidure/",
          base: "/home/nfroidure/test",
          path: "/home/nfroidure/test/file.svg",
          contents: new Buffer('test')
        })
        , fakeFile2 = new gutil.File({
          cwd: "/home/nfroidure/",
          base: "/home/nfroidure/test",
          path: "/home/nfroidure/test/file2.svg",
          contents: new Buffer('test2')
        })
      ;

      stream.on('data', function(newFile){
        assert(newFile);
        assert.equal(newFile.cwd, "/home/nfroidure/");
        assert.equal(newFile.base, "/home/nfroidure/test");
        n++;
        if(n == 1) {
          assert.equal(newFile.contents.toString('utf-8'), 'test');
          assert.equal(newFile.path, "/home/nfroidure/test/uE001-file.svg");
        } else if(n == 2) {
          assert.equal(newFile.contents.toString('utf-8'), 'test2');
          assert.equal(newFile.path, "/home/nfroidure/test/uE002-file2.svg");
        } else  {
          assert.equal(newFile.contents.toString('utf-8'), '\n\
  .file {\n\
    content: "\\u57345";\n\
  }\n\
\n\
  .file2 {\n\
    content: "\\u57346";\n\
  }\n\
\n');
          assert.equal(newFile.path, "/home/nfroidure/test/test.scss");
        }
      });

      stream.on('end', function() {
        assert.equal(n, 3);
        done();
      });

      stream.write(fakeFile);
      stream.write(fakeFile2);
      stream.end();
    });

  });


  describe('in stream mode', function() {

    it('should work', function(done) {
      var stream = scss({
        filename: 'test',
        template: 'icons.scss.swig'
      })
        , n = 0
        , fakeFile = new gutil.File({
          cwd: "/home/nfroidure/",
          base: "/home/nfroidure/test",
          path: "/home/nfroidure/test/file.svg",
          contents: new Stream.PassThrough()
        })
        , fakeFile2 = new gutil.File({
          cwd: "/home/nfroidure/",
          base: "/home/nfroidure/test",
          path: "/home/nfroidure/test/file2.svg",
          contents: new Stream.PassThrough()
        })
      ;

      stream.on('data', function(newFile){
        assert(newFile);
        assert.equal(newFile.cwd, "/home/nfroidure/");
        assert.equal(newFile.base, "/home/nfroidure/test");
          assert(newFile.contents instanceof Stream.PassThrough);
        n++;
        if(n == 1) {
          assert.equal(newFile.path, "/home/nfroidure/test/uE001-file.svg");
        } else if(n == 2) {
          assert.equal(newFile.path, "/home/nfroidure/test/uE002-file2.svg");
        } else  {
          var contents = new Buffer(0);
          newFile.contents.on('data', function(data) {
            contents = Buffer.concat([contents, data]);
          });
          newFile.contents.once('end', function(data) {
            assert.equal(contents.toString('utf-8'), '\n\
  .file {\n\
    content: "\\u57345";\n\
  }\n\
\n\
  .file2 {\n\
    content: "\\u57346";\n\
  }\n\
\n');
          });
          assert.equal(newFile.path, "/home/nfroidure/test/test.scss");
        }
      });

      stream.on('end', function() {
        assert.equal(n, 3);
        done();
      });

      stream.write(fakeFile);
      stream.write(fakeFile2);
      stream.end();
    });

  });

});
