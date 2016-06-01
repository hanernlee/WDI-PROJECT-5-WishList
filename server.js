var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var expressLayouts = require('express-ejs-layouts');
var session = require('client-sessions');

var mongoose = require('mongoose'),
    User = require('./models/user'),
    Item = require('./models/item');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/smartbuy";

var MongoDB = mongoose.connect(mongoURI, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));


var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
var port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined'));
app.use(express.static('public'));
app.use(expressLayouts);
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

// Routes for Each Page
app.get('/', function(req, res){
  res.render('index', { layout: 'index' })
})

app.post('/new', function(req, res){
  var newUser = new User({
    username : req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function (err) {
    if (err) {
      res.send("Failed Registration");
    } else {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) throw err;

        if(req.body.password !== "" || req.body.email !== "") {
          user.comparePassword(req.body.password, function(err, isMatch)
            {
              if (isMatch) {
                req.session.user = user;
                res.redirect('/home');
              } else {
                res.send("Failed Login Attempt, please try again!");
              }
          });
        } else {
          res.send("Please enter a password or email");
        }

      });
    }
  });
});

app.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;

    if(req.body.password !== "" || req.body.email !== "") {
      user.comparePassword(req.body.password, function(err, isMatch)
        {
          if (isMatch) {
            req.session.user = user;
            res.redirect('/home');
          } else {
            res.send("Failed Login Attempt, please try again!");
          }
      });
    } else {
      res.send("Please enter a password or email");
    }

  });
});

//about
app.get('/home', requireLogin, function(req, res){
  Item.find({ user_id: req.user.username}, function(err, items) {
    var itemMap = {};

    items.forEach(function(item) {
      itemMap[item._id] = item;
    });

    res.render('home', {layout:'home.ejs', items:items});
  });
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.post('/add', function(req, res) {

  var item = new Item({
    user_id: req.user.username,
    name: req.body.name,
    imageUrl: req.body.img,
    price: req.body.price,
    start: req.body.start,
    end: req.body.end,
    status: 'incomplete',
    duration: req.body.duration
  });
  console.log(item);
  console.log('hello');

  item.save(function (err) {
    if (err) {
      console.log(err);
      console.log('fail');
    } else {
      res.json({item});
    }
  });
});

app.delete('/delete/:itemId', function(req,res) {
  console.log(req.params.itemId);
  Item.findOneAndRemove({ _id: req.params.itemId }, function(err, item) {
    if (err) {
      throw err;
    } else {
      console.log('User deleted');
      res.json({item});
    }
  });
});

app.post('/update/:divId', function(req,res) {
  Item.findOneAndUpdate({ _id: req.params.divId}, {$set:{status: "completed"}}, {new: true}, function (err,item) {
    if (err) {
      throw err;
    } else {
      res.json({item});
    }
  });
});

app.post('/reverse/:currentId', function(req,res) {
  console.log(req.params.currentId);
  Item.findOneAndUpdate({ _id: req.params.currentId}, {$set:{status: "incomplete"}}, {new: true}, function (err,item) {
    if (err) {
      throw err;
    } else {
      res.json({item});
    }
  });
});

module.exports = app;


var server = require('http').createServer(app);
server.listen(port, function() {
  console.log('Listening on port ' + port)
});
