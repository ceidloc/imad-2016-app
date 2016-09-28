var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'))

var article={
    title:"new article",
    head:"Test Article",
    body:"The quick brown fox jumped over the lazy dog"
}

app.get('/article', function (req, res) {
  res.send(template(article));
});

function template(data)
{
    var title=data.title;
    var head=data.head;
    var body=data.body;
    var html_data=`<html>
    <title>${title}</title>
    <head>${head}</head>
    <body>${body}</body>
    </html>`
    return html_data
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
