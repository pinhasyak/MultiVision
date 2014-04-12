var express = require('express'),
    stylus = require('stylus'),
    bodyParser = require('body-parser'),
    log = require('libs/log')(module);


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str,path){
    return stylus(str).set('filename',path);
}

if ('development' == env) {
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'jade');

    log.info('NODE_ENV: '+env);

    app.use(bodyParser());

    app.use(stylus.middleware(
        {
            src: __dirname + '/public',
            compile:compile
        }
    ));
    app.use(express.static(__dirname+'/public'));
}
app.get('/partials/:partialPath',function(req,res){
    res.render('partials/'+ req.params.partialPath);
});
app.get('*', function(req, res) {
    res.render('index');
});

var port = 3030;
app.listen(port);
log.info('Listening on port ' + port + '...');