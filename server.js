var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

//Database configuration
var mongojs = require('mongojs');
var databaseUrl = "scrapper";
var collections = ["scrapedata"];
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});

// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

//Save to DB
app.post('/submit', function(req, res) {
  console.log(req.body);
  db.scrapedata.save(req.body, function(err, saved) {
    if (err) {
      console.log(err);
    } else {
      res.send(saved);
    }
  });
});

//Get from DB
app.get('/all', function(req, res) {
  db.scrapedata.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.json(found);
    }
  });
});


//Find One in DB
app.get('/find/:id', function(req, res) {

  //when searching by an id, the id needs to be passed in as (mongojs.ObjectId(IDYOUWANTTOFIND))
  console.log(req.params.id);
  db.scrapedata.findOne({
    '_id': mongojs.ObjectId(req.params.id)
  }, function(err, found) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(found);
      res.send(found);
    }
  });
});


//Update One in the DB
app.post('/update/:id', function(req, res) {
  //when searching by an id, the id needs to be passed in as (mongojs.ObjectId(IDYOUWANTTOFIND))

  db.scrapedata.update({
    '_id': mongojs.ObjectId(req.params.id)
  }, {
    $set: {
      'note': req.body.note,
      'modified': Date.now()
    }
  }, function(err, edited) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(edited);
      res.send(edited);
    }
  });
});


//Delete One from the DB
app.get('/delete/:id', function(req, res) {
  db.scrapedata.remove({
    "_id": req.params.id
  }, function(err, removed) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(removed);
      res.send(removed);
    }
  });
});


//Clear the DB
app.get('/clearall', function(req, res) {
  db.scrapedata.remove({}, function(err, response) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(response);
      res.send(response);
    }
  });
});

app.get('/scrape', function(req, res) {
  request('https://www.reddit.com/r/technews/', function(error, response, html) {
    var $ = cheerio.load(html);
    console.log($)

    $('.title').each(function(i, element) {
      var title = $(this).children('a').text();
      var link = $(this).children('a').attr('href');

      if (title && link) {
        db.scrapedata.save({
          title: title,
          link: link
        }, function(err, saved) {
          if (err) {
            console.log(err);
          } else {
            console.log(saved);
          }
        });
      }
    });
  });
  console.log("Scrape Complete");
});

app.listen(3000, function() {
  console.log('App running on port 3000!');
});