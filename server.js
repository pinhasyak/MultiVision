var express = require('express'),
    stylus = require('stylus'),
    bodyParser = require('body-parser'),
    log = require('./libs/log')(module),
    mongoose = require('mongoose');


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

mongoose.connect('mongodb://localhost/multivision');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
   log.info('multivision connection is opened');
});
var messageSchema = mongoose.Schema({message:String});
var Message = mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc){
   mongoMessage = messageDoc.message;
});

app.get('/partials/*',function(req,res){
//    res.render('partials/'+ req.params[0]);
    res.render('../../public/app/'+ req.params[0]);
    log.info('req.params 0 : '+req.params[0]);
});

app.get('*',function(req,res){
   res.render('index');
});

var port = 3030;
app.listen(port);
log.info('Listening on port ' + port + '...');