var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));



var menu_item=
{
      '1':
    {
      title:'Menu',
      head:'Espresso',
      body:'kappa',
      item_id:'1'
    },

      '2':
    {
      title:'Menu',
      head:'Espresso Macchiato',
      body:'kappa', 
      item_id:'2'
    },

      '3':
    {
      title:'Menu',
      head:'Espresso con Panna',
      body:'kappa', 
      item_id:'3'
    },

      '4':
    {
      title:'Menu',
      head:'Caffe Latte',
      body:'kappa', 
      item_id:'4'
    },

      '5':
    {
      title:'Menu',
      head:'Flat White',
      body:'kappa', 
      item_id:'5'
    },

      '6':
    {
      title:'Menu',
      head:'Caffe Breve',
      body:'kappa', 
      item_id:'6'
    },

      '7':
    {
      title:'Menu',
      head:'Cappuccino',
      body:'kappa', 
      item_id:'7'
    },

      '8':
    {
      title:'Menu',
      head:'Caffe Mocha',
      body:'kappa', 
      item_id:'8'

    },

      '9':
    {
      title:'Menu',
      head:'Americano',
      body:'kappa', 
      item_id:'9'
    },

      '10':
    {
      title:'Menu',
      head:'Latte Macchiato',
      body:'kappa', 
      item_id:'10'
    },

      '11':
    {
      title:'Menu',
      head:'Red Eye',
      body:'kappa', 
      item_id:'11'
    },

    '12':
    {
      title:'Menu',
      head:'Cafe au Late',
      body:'kappa',
      item_id:'12'
    } 


};


var list=[];
app.get('/ui/:id/comments', function (req, res) {//url type: ui/3/comments?comment=... here id = 3
  var id_no=req.params.id;
  var comment=req.query.comment;
  list.push(comment);
  res.send(JSON.stringify(list));
});



app.get('/menu_item/:no', function (req, res) {
  var no=req.params.no;
  res.send(template(menu_item[no]));
});

function template(data)
{   
    var item_id=data.item_id;
    var title=data.title;
    var body=data.body;
    var head=data.head;

    var html_data=`<html>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <title>${title}</title>
      <body>
        <div class="header">
            SleepyHead Cafe
        </div>
        <hr>
        <div class='menu_head'>
          ${head}
        </div>
        <div class='center'>
        ${body}
        </div>
        <input type='text' id ='in_id_${item_id}' placeholder="type here!"></input>
        <input type='submit' id ='sub_id_${item_id}' value='submit'></input>
        <ul id = 'ul_id_${item_id}'>

        </ul>
        <script type="text/javascript" src="/ui/menu.js">
        </script>
      </body>
    </html>`;
    return html_data;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/menu.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'menu.js'));
});

app.get('/ui/images/:image_no', function (req, res) {
  var image_no=req.params.image_no
  res.sendFile(path.join(__dirname, 'ui', 'images',image_no));
});


app.get('/ui/index.js',function(req, res){
  res.sendFile(path.join(__dirname,'ui','index.js'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
