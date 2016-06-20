/**
 * Created by Stefan Hariton on 6/18/16.
 */

var saveFile = require('../common/index').save;
var unoconv = require('unoconv2');
var mmm = new require('mmmagic');
var fs = require('fs');

var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

var doc = {
  register: function(server, options, next) {
    server.route({
      method: 'POST',
      path: '/document',
      config: {
        payload: {
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data'
        },
        handler: function (request, reply) {
          var file = request.payload.file;
          var path = saveFile(file);
          unoconv.convert(path, request.payload.to, function(err, result) {
            fs.unlinkSync(path);
            magic.detect(result, function(err, mimeType) {
              return reply(result)
                .type(mimeType)
                .header('Content-Disposition', 'attachment; filename="'+ file.hapi.filename);
            })
          });
        }
      }
    });

    next();
  }
};

doc.register.attributes = {
  name: 'doc',
  version: '0.0.1'
};

module.exports = doc;