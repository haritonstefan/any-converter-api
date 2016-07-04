/**
 * Created by Stefan Hariton on 6/18/16.
 */

var saveFile = require('../common/index').save;
var unoconv = require('unoconv2');
var fs = require('fs');

var document = {
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
          var path = saveFile(request.payload.file);
          unoconv.convert(path, 'pdf', function(err, result) {
            fs.unlinkSync(path);
            return reply(result)
              .type('application/pdf')
              .header('Content-Disposition', 'attachment; filename="'+ path.split('/').pop());
          });
        }
      }
    });

    next();
  }
};

document.register.attributes = {
  name: 'doc',
  version: '0.0.1'
};

module.exports = document;