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

//storing comments in a 2-d array as [page][comments]
var list=[[],[],[],[],[],[],[],[],[],[],[],[]];

app.get('/ui/:id/comments', function (req, res)
{
  //url type: ui/3/comments?comment=... here id = 3
  var id=req.params.id;
  var id_no=parseInt(id,10);//convertin id containg string type  value to int type decimal value
  id_no-=1;
  var comment=req.query.comment;
  if (comment!=="")
    {list[id_no].push(comment);}
  //returning only the row containing the comments from current page as JSON string represntation of that row,stored in a 2-D array
  res.send(JSON.stringify(list[id_no]));
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/menu_item/:no', function (req, res) {
  var no=req.params.no;
  res.send(menu_item_template(menu_item[no]));//using menu_item_template to create many html pages using jsobject
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/menu_comment/:id', function (req, res) {
  id=req.params.id;
  //using menu_item_template to resopnd with js that will sit in client and do client-side-templating to get comments on the page referenced by this id
  res.send(comment_template(id));
});

app.get('/ui/images/:image_no', function (req, res) {
  var image_no=req.params.image_no
  res.sendFile(path.join(__dirname, 'ui', 'images',image_no+'.jpg'));
});


app.get('/ui/index.js',function(req, res){
  res.sendFile(path.join(__dirname,'ui','main.js'));
});




function generate_comment_list_from_array(comment)
{


    return new_list;//return's string
};


function comment_template(id)
{   
  id=1
  var js_data=`
    //get the submit element on this page by referencing it with given item_id

    submit_btn=document.getElementById('sub_id_${id}');


    //use send_req_and_get_res when page is loaded and when submit_btn is clicked

    submit_btn.onclick=function ()
      {
        send_req_and_get_res(${id});
      }   

     send_req_and_get_res(${id});  

     //function that sends request,with data as null when page is loaded,catches resopse and render's on current page

    function send_req_and_get_res()
    {
      var request=new XMLHttpRequest();
        request.onreadystatechange= function()
        {
          if (request.readyState===XMLHttpRequest.DONE)
          {
            if (request.status === 200)
            {//take comments from the request and parse them into array 
              var comment=JSON.parse(request.responseText);
              var new_list="";
              //creating a string to render in the inner html of ol on this article page
              for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
               {
                  new_list+="<li>"+comment[i]+"</li>";
                };
              var old_list=document.getElementById('ol_id_${id}');
              old_list.innerHTML=new_list;
            }
          }

        };

        //making request
        input=document.getElementById('in_id_${id}');
        data=input.value;
        //sending request to page with id=current_id
        request.open('GET','http://localhost:8080/ui/${id}/comments?comment='+data,true);
        request.send(null);
      };

    `

  return js_data;
    
}



function menu_item_template(data)
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
        <hr>
        </div>
        <div class="comment_head">
        Comments
        </div>
        <ol id = 'ol_id_1' class="comment_list">
        </ol>
        <input type='text' id ='in_id_1' class ="input_box" placeholder="Submit a new comment!"></input>
        <br>
        <input type='submit' id ='sub_id_1' class = "submit_btn" value='Submit'></input>
        <script type="text/javascript" src="/ui/menu_comment/1">
        </script>
      </body>
    </html>`;

    return html_data;
}



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
