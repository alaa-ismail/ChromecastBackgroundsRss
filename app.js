var express = require("express");
var RSS = require('rss');
var request = require('request-json');

var app = express();

var client = request.newClient('https://raw.githubusercontent.com/');
var feed = new RSS({
    title: 'Chromecast Theme Backgrounds',
    feed_url: 'http://chromecastbackgrounds.herokuapp.com/',
    site_url: 'http://chromecastbackgrounds.herokuapp.com/',
    author: 'Alaa Ismail',
    cdata: false
});

app.get('/', function(request, response) {

    // Retrieve chromecast backgrounds from dconnolly's github repo
    client.get('dconnolly/chromecast-backgrounds/master/backgrounds.json', function(err, res, body) {
        var rss = createRssFeed(body);
        response.type('rss');
        response.send(rss);
    });
});

var createRssFeed = function(backgrounds){
    backgrounds.forEach(function(item,index){
        var caption = 'Chromecast Image #'+ (index+1);
        var link = item.url;
        feed.item({
            title: caption,
            description: caption,
            enclosure: {url:link}
        });
    });
    return feed.xml();
};

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});