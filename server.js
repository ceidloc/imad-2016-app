var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool =require('pg').Pool;
var bodyParse=require('body-parser');
var session=require('express-session');
var crypto = require('crypto');

var app = express();

app.use(morgan('combined'));
app.use(bodyParse.json());
app.use(session (
  {
    secret:'random-string',
    cookie:{maxAge:1000*60*60*24}//last's one day
  })
);

//###############################
//path.join(__dirname,'/ui/py_scripts','twitter_streaming_data_collection.py')

  //  var spawn = require('child_process').spawn,
    //py    = spawn('python', [path.join(__dirname,'ui','py_scripts','twitter_streaming_data_collection.py')]),
//##############################


config=
{
  user:'ceidloc',
  database:'ceidloc',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD
};

pool =new Pool(config);


//log_in block and log_in block_js

var nav_bar=`
  <div class=side_nav_bar>
  <a href='/'>Home</a>
  <a href='/ui/cafe_home_page'>SleepyHead Cafe</a>
  <a href='/ui/order_page'>Order</a>
  </div>
        `;

var cafe_layout=`
  <!doctype html>
  <html>
  <title>SleepyHead Cafe</title>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body class=cafe_body> <!-- background="/ui/images/bg_image"> -->
        <div class="header">SleepyHead Cafe
        </div>
        <hr>
`+nav_bar;


var log_in_block=`
<input type='text' id ='log_in_username_button' class ="input_box" placeholder="Enter Username"></input><br>
<input type='password' id ='log_in_password_button' class ="input_box" placeholder="Enter Password"></input><br>
<input type='submit' id ='log_in_submit_button' class = "submit_btn" value='Log in!'></input><br><br><hr>
<input type='submit' id ='sign_up_submit_button' class = "submit_btn" value='Sign up!'  onClick="postOnClick();"></input>
<br><br><br>
`;

var log_out_block=`<input type='submit' id ='log_out_submit_button' class = "submit_btn" value='Log Out' onClick="postOnClick();">
</input><br>`;

app.get('/ui/log_out',function(req,res)
{
  //if user is logged in delete session token
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    console.log("inside log_out end point");
    delete req.session.auth.user_id;
    res.send("logged out!");
    console.log("inside log_out end point after delete");
  }
});


app.get('/ui/log_out_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  console.log("previous_page:",req.query);
  res.send(log_out_template_js(previous_page));
});

function log_out_template_js(previous_page)
{
  if (previous_page==="default")
    previous_page="";
  js_data=`
function postOnClick()
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
      if (request.readyState == 4 && request.status == 200) 
      {    
          console.log("inside readyState");
          //request.setRequestHeader('Content-Type','application/json');
          window.location.href = "http://ceidloc.imad.hasura-app.io/ui/${previous_page}";
      }
    }
    console.log("outside readyState");
    request.open('GET','http://ceidloc.imad.hasura-app.io/ui/log_out',true);
    request.send(null);
}


  `;
  return js_data;
}


//app.post('/ui/log_in_block',function(req,res)
//{
  //var previous_page=req.body.previous_page;
  //res.send(log_in_block_template(previous_page));
//});


app.get('/ui/log_in_page',function(req,res)
{
  var previous_page="default";
  res.send(log_in_page_template(previous_page));
});

app.get('/ui/log_in_page/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  res.send(log_in_page_template(previous_page));
});


function log_in_page_template(previous_page)
{
  html_data=cafe_layout;
  html_data+=`
    <div class="menu_head">
    Log in!
    <hr>
    </div>
  `;
  html_data+=log_in_block;
  html_data+=`  
  </body>
  <script type="text/javascript" src="/ui/log_in_page_js/previous_page?previous_page=${previous_page}">
  </script>
  </html>
  `;
  return html_data;
}

app.get('/ui/log_in_page_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  console.log("previous_page:",req.query);
  res.send(log_in_page_template_js(previous_page));
});

function log_in_page_template_js(previous_page)
{
  if (previous_page==="default")
    previous_page="";
  js_data=`
  submit_btn=document.getElementById('log_in_submit_button');
  submit_btn.onclick=function()
  {
    var request=new XMLHttpRequest();
    request.onreadystatechange= function()
    {
      if (request.readyState===XMLHttpRequest.DONE)
      {
        if (request.status === 200)
        {
          var res=request.responseText;
          if (res==="successfully logged in")
          {
          window.location.href='http://ceidloc.imad.hasura-app.io/ui/${previous_page}';
          }
          else
          {
            submit_btn.value = 'invalid username';
          }
        }
        else if (request.status === 404) 
        {
        submit_btn.value = 'invalid username/password';
        }
        else if (request.status === 500) 
        {
        submit_btn.value = 'Something went wrong on the server';
        } 
        else {
        submit_btn.value = 'Something went wrong on the server';
        }

      }

    };

    //making request
    username=document.getElementById('log_in_username_button').value;
    password=document.getElementById('log_in_password_button').value;

    username=username.trim();
    password=password.trim();

    if (username!=="" && password!=="") 
    { request.open('POST','http://ceidloc.imad.hasura-app.io/ui/log_in',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/log_in',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify({username:username,password:password}));
    }
  };

function postOnClick()
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
      if (request.readyState == 4 && request.status == 200) 
      {    
          console.log("inside readyState");
          //request.setRequestHeader('Content-Type','application/json');
          window.location.href = "http://ceidloc.imad.hasura-app.io/ui/sign_up_page/previous_page?previous_page=${previous_page}";
      }
    }
    console.log("outside readyState");
    request.open('GET','http://ceidloc.imad.hasura-app.io/ui/sign_up_page/previous_page?previous_page=${previous_page}',true);
    //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/sign_up_page/previous_page?previous_page=${previous_page}',true);
    //request.setRequestHeader('Content-Type','application/json');
    //request.send(JSON.stringify({"previous_page":"${previous_page}"})); 
    request.send(null);
}


  `;
  return js_data;
}

app.post('/ui/log_in',function(req,res)
{
  var username=req.body.username;
  var password=req.body.password;
  //convert password to hash then store
  //user_table schema: user_id username password

  username=username.trim();
  password=password.trim();
  
  if (username!=="" && password!=="") 
  {
    pool.query('SELECT username FROM user_table WHERE username=$1',[username],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (result.rows.length===0)
      {
        res.send('invalid username'); 
      }
      else
      {
        //user name is valid
        pool.query('SELECT password FROM user_table WHERE username=$1',[username],function(err,result  )
          {
            if (err)
            {
              res.status(500).send(err.toString());
            }
            if (result.rows!==0)//password is valid
            { 
              var hashedPassword = result.rows[0].password;//stored in database
              var salt = hashedPassword.split('$')[2];//extracting salt as hashedPassword is of the form ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$')
              var entered_password_hashed = hash(password, salt);

              if (entered_password_hashed===hashedPassword)
              {
                //creating session for this new user
                create_session_token(req,res,username);
              }
              else//wrong password entered
                res.status(404).send('invalid username/password');
            }
          });
      }
    });
  }
});


app.get('/ui/sign_up_page',function(req,res)
{
  var previous_page="default";
  res.send(sign_up_page_template(previous_page));
});

app.get('/ui/sign_up_page/:previous_page',function(req,res)
{
  var previous_page=req.query.previous_page
  if (!previous_page)
    previous_page="default";
  res.send(sign_up_page_template(previous_page));
});


function sign_up_page_template(previous_page)
{ 
  var html_data=cafe_layout;
  html_data+=`
    <div class="menu_head">
    Sign Up!
    <hr>
    </div>
    <input type='text' id ='sign_up_username_button' class ="input_box" placeholder="Enter Username"></input><br>
    <input type='password' id ='sign_up_password_button' class ="input_box"  placeholder="Enter Password"></input><br>
    <input type='submit' id ='sign_up_submit_button' class = "submit_btn" value='Submit'></input>
  </body>
  <script type="text/javascript" src="/ui/sign_up_page_js/previous_page?previous_page=${previous_page} ">
  </script>
  </html>
  `;
  return html_data;
}

app.get('/ui/sign_up_page_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  res.send(sign_up_page_template_js(previous_page));
});

function sign_up_page_template_js(previous_page)
{
  if (previous_page==="default")
    previous_page="";
  js_data=`
  submit_btn=document.getElementById('sign_up_submit_button');
  submit_btn.onclick=function()
  {
    var request=new XMLHttpRequest();
    request.onreadystatechange= function()
    {
      if (request.readyState===XMLHttpRequest.DONE)
      {
        if (request.status === 200)
        {
          var res=request.responseText;
          if (res==="successfully logged in")
          {
          window.location.href='http://ceidloc.imad.hasura-app.io/ui/${previous_page}';
          }
        }
        else if (request.status === 404) 
        {
        submit_btn.value = 'username not available';
        }
        else if (request.status === 500) 
        {
        submit_btn.value = 'Something went wrong on the server';
        } 
        else 
        {
        submit_btn.value = 'Something went wrong on the server';
        }
      }

    };

    //making request
    username=document.getElementById('sign_up_username_button').value;
    password=document.getElementById('sign_up_password_button').value;

    username=username.trim();
    password=password.trim();

    if (username!=="" && password!=="") 
    { request.open('POST','http://ceidloc.imad.hasura-app.io/ui/sign_up',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/sign_up',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify({username:username,password:password}));
    }
  };
  `;
  return js_data;
}

function hash (input, salt) {
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.post('/ui/sign_up',function(req,res)
{
  var username=req.body.username;
  var password=req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');
 
  username=username.trim();
  password=password.trim();
  var hashedString=hash(password,salt);
  
  if (username!=="" && password!=="") 
  {
     //user_table schema: user_id username password
    pool.query('SELECT username FROM user_table WHERE username=$1',[username],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (result.rows.length!==0)
      {
        res.status(404).send('User name already used'); 
      }
      else
      {
        //user name is valid
        pool.query('INSERT INTO user_table(username,password) values($1,$2)',[username,hashedString],function(err,result  )
          {
            if (err)
            {
              res.status(500).send(err.toString());
            }
            else
            {
              //creating session for this new user
              create_session_token(req,res,username);
            }
          });
      }
    });
  }
});

function create_session_token(req,res,username)
{
  pool.query('SELECT user_id FROM user_table WHERE username=$1',[username],function(err,result)
    {
      if (err)
        {
          res.status(500).send(err.toString());
        }
      req.session.auth={user_id:result.rows[0]};
      res.send('successfully logged in');

    });
}

app.get('/ui/get_bill_details_for_item_id/:cart_id/:item_id', function (req, res)// replace /1/: by /:cart_id
{
  var log_in_details="not logged in";
  if (req.session && req.session.auth && req.session.auth.user_id )
    log_in_details="logged in";

  var item_id=req.params.item_id;
  item_id=parseInt(item_id,10);//convertin id containg string type  value to int type decimal value
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  //convertin id containg string type  value to int type decimal value
  
  pool.query("SELECT quantity FROM cart WHERE cart_id=$1 AND item_id=$2 ",[cart_id,item_id],function(err,result)
  {
    if (err)
    {
      res.status(500).send(err.toString());
    }
    else if (result.rows.length===0)//first insertion of this item in this cart 
    { 
      console.log("inside cs js insert cart result:",result);
     cart_bill_format(res,cart_id,JSON.stringify(["insert item",item_id]),log_in_details);
    }
    else
    {
      console.log("inside cs js update cart result:",result);
      console.log("inside cs js update cart quantity:",result.rows[0].quantity);
      cart_bill_format(res,cart_id,JSON.stringify(["update item",item_id,result.rows[0].quantity]),log_in_details);
    }
  });
});

app.get('/ui/order_page/', function (req, res) {// add /:cart_id 
  if (req.session && req.session.auth && req.session.auth.user_id )
   {
     cart_id=req.session.auth.user_id.user_id;//change to auth.cart_id;
     //loading a cart,note can be both new cart or pre-existing
     //if new cart is to be made the user_id is used as cart_id,foreign key constraint
     cart_bill_format(res,cart_id,"load cart");
   }
   else
   {
    //redirecting to login page,using the log_in_page_tempate
    //after login redirects to order_page,aka the current end point 
    previous_page="order_page";
    res.send(log_in_page_template(previous_page));
   }
  
});


app.get('/ui/order_page_js/:cart_id', function (req, res) {
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  res.send(order_template_js(cart_id));
  
});

var cart_counter=0;
function cart_bill_format(res,cart_id,data)
{
//type's of query's to handle : data value
//from interleaf 1.insert->create new: new cart;2.select->give list of carts:give cart list,3. on click on cart_id from list,link to order_page with clicked cart_id
//from server_template's on load select->load cart with given cart_id:load cart
//from client_side_template on click add, 1.insert->the item in cart given cart_id item_id : " ['insert item',item_id] "
//                                     or 2.update->update cart given cart_id,item_id : update cart
//                                    and 3.recycle server_template's select query for client side templating with modified data:c-side load cart

  if (data.substr(2,11)==="update item")
  {
    console.log("inside c_b_f insert cart data:",data);
    data=JSON.parse(data);
    //data=['',item_id,quantity]
    pool.query("UPDATE cart SET quantity=$3 WHERE cart_id=$1 AND item_id=$2",[cart_id,data[1],data[2]+1],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      {
        console.log("inside c_b_f insert cart result:",result);
        cart_bill_format(res,cart_id,"cs-load cart");
      }

    });

  }
  else if (data.substr(2,11)==="insert item")
  {
    //add item,corresponding to given item_id,to the cart,corresponding to given cart_id, and set quantity to 1
    console.log("inside c_b_f insert cart data:",data);
    data=JSON.parse(data);
    //data=['',item_id]
    pool.query("INSERT INTO cart(cart_id,item_id,quantity) values ($1,$2,$3) ",[cart_id,data[1],1],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      { 
        console.log("inside c_b_f insert cart result:",result);
        cart_bill_format(res,cart_id,"cs-load cart");
      }

    });

  }
  else 
  {
    //if (data==="load cart")
    //selecting all the items from menu,which exits in cart,corresponding to given cart_id,along with its quantity from cart
    pool.query("SELECT m.item_id,m.price,c.quantity FROM cart AS c LEFT JOIN menu_items AS m ON c.item_id=m.item_id WHERE c.cart_id=$1 ORDER BY m.item_id",
      [cart_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (data==="cs-load cart")
      {//data for client side,ajax data call 
          console.log("inside c_b_f cs-load cart result:",result);
          res.send(JSON.stringify(result.rows));
      }
      else if (data==="load cart")
      { 
        //selecting all the menu_items present in the menu,with its corresponding head from article_table,where article_id=0,aka the cafe shop owner
         pool.query("SELECT a.head,m.price,m.item_id FROM article_table AS a LEFT JOIN menu_items AS m ON a.article_id=m.item_id",
          function(err,menu_items)
          {
            if (err)
            {
              res.status(500).send(err.toString());
            }
            else if (result.rows.length!==0)
            { 
              console.log("inside load cart result:",result);
              console.log("inside load cart menu_items:",menu_items);
             res.send(order_template( JSON.stringify(menu_items.rows) , JSON.stringify(result.rows) ,cart_id ) );
            }
            else
            {
              console.log("inside load cart else result:",result);
              console.log("inside load cart else menu_items:",menu_items);
             res.send(order_template( JSON.stringify(menu_items.rows),JSON.stringify("empty cart") ,cart_id ) );
            }

          });

        }
    });
  }

};


//post requst to get insert comment
app.post('/ui/menu_item/:item_id', function (req, res)
{ 
  //can only add comments if logged in!
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    log_in_details=req.session.auth.user_id.user_id;

    //url type: ui/3/comment?comment=... here id = 3
    var item_id=req.params.item_id;
    var item_id=parseInt(item_id,10);//convertin id containg string type  value to int type decimal value
    var comment=req.body.comment;
    if (comment!=="")
      {
        //list[id_no].push(comment);
        comment_format(res,JSON.stringify(['insert comment',comment]),item_id,log_in_details);

      }
    //returning only the row containing the comments from current page as JSON string represntation of that row,stored in a 2-D array
    //res.send(JSON.stringify(list[id_no])); 
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/menu_item/:id', function (req, res) {
  var id=req.params.id;
  var item_id=parseInt(id,10);//convertin id containg string type  value to int type decimal value

  var log_in_details="not logged in";
  if (req.session && req.session.auth && req.session.auth.user_id )
   log_in_details="logged in";

 //selecting the menu_item from the menu_items table corresponding to the given id
  pool.query('SELECT a.head,a.body,m.item_id,m.price FROM article_table AS a JOIN menu_items AS m ON a.article_id=m.item_id WHERE m.item_id=$1',[item_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (result.rows.length===0)
      {
        res.status(404).send("item not present in menu."); 
      }
      else
      {
        console.log("inside menu/item/",item_id,"result:",result)
        ///selcting comments and rendering from the server side
        comment_format(res,JSON.stringify( result.rows[0] ),item_id,log_in_details);  

      }
    });

});


function comment_format(res,data,item_id,log_in_details)
{ 
  
  if (data.substr(2,14)==="insert comment")
    //data=['insert comments',comment]
  { 
    console.log("inside comment_format IF,data:",data);
    console.log("\n inside comment_format IF,data.parsed[1]:",JSON.parse(data)[1]);
    pool.query('INSERT into comments(text,article_id,user_id) values($1,$2,$3)',[JSON.parse(data)[1],item_id,log_in_details],function(err,result)//data[1]=comment
      {
        if (err)
        { 
          res.status(500).send(err.toString());
        }
          //can only insert comments if logged in hence sending logged in to the recursive call;
          comment_format(res,"new comment",item_id,"logged in");
      } );
  }
  else
  {
    pool.query('SELECT c.text,c.time,u.username from comments as c,user_table as u WHERE c.article_id=$1 and c.user_id=u.user_id ORDER BY comment_id'
      ,[item_id],function(err,comments)
        {
          if (err)
          { 
           res.status(500).send(err.toString());
          }
          //data to dereference js end point request
          if (data==="new comment")
          { 
            console.log("in select comments",comments);
            //sending only the last result,aka the just now inserted comment
            res.send(  comments.rows[comments.rows.length-1] ) ;
          }
          else
          { 
            //two parametrs ,one is a json object and the other is an array of comments,are sent to the template
            //return(JSON.stringify( comments.rows ) );
            //###########################################################################################################################################################################################################
            if (comments && comments.rows.length!==0)
            {
              console.log("in select comments data != new comments,comment:",comments);
              res.send(menu_item_template(JSON.parse(data),JSON.stringify ( comments.rows ) ,log_in_details) );
            }
            else
            {
               res.send(menu_item_template(JSON.parse(data),'Be the first to comment!',log_in_details) );
            }
          }
        } );
    }
};



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

//returns js for menu_item page
app.get('/ui/menu_comment/:id', function (req, res) {
  item_id=req.params.id;
  //using menu_item_template to resopnd with js that will sit in client and do client-side-templating to get comments on the page referenced by this id
  res.send(comment_template(item_id));
});



app.get('/ui/images/:image_no', function (req, res) {
  var image_no=req.params.image_no
  res.sendFile(path.join(__dirname, 'ui', 'images',image_no+'.png'));
});


app.get('/ui/cafe_home_page',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  var log_in_details="not logged in";
  if (req.session && req.session.auth && req.session.auth.user_id )
    log_in_details="logged in";

  res.send(cafe_home_page_template(log_in_details));
});

app.get('/ui/cafe_home_page.js',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.send(cafe_home_page_template_js());
});

function cafe_home_page_template(log_in_details)
{
  html_data=cafe_layout;
  html_data+=`
  <div class="menu_head">
        MENU
        <hr>
        </div>
        <div class="menu">`;
        if(log_in_details==="logged in")
        {
          html_data+="<div class=side_nav_link>"+log_out_block+"</div>";
        }

        else
        {
          html_data+=`<a href='/ui/log_in_page/previous_page?previous_page=cafe_home_page' id ='log_in_page_link' class = side_nav_link>Log in!<a>`
        }

        html_data+=`
        Place Your Order! <a href="/ui/order_page">Click Here</a><br><br><br>
        <img src='/ui/images/0' id="mi_0" class="menu_icon"> <br> <a href="/ui/menu_item/0">Espresso</a><br><br>
        <img src='/ui/images/1' id="mi_1" class="menu_icon"> <br> <a href="/ui/menu_item/1">Espresso Macchiato</a><br><br>
        <img src='/ui/images/2' id="mi_2" class="menu_icon"> <br> <a href="/ui/menu_item/2">Espresso con Panna </a><br><br>
        <img src='/ui/images/3' id="mi_3" class="menu_icon"> <br> <a href="/ui/menu_item/3">Caffe Latte </a><br><br>
        <img src='/ui/images/4' id="mi_4" class="menu_icon"> <br> <a href="/ui/menu_item/4">Flat White </a><br><br>
        <img src='/ui/images/5' id="mi_5" class="menu_icon"> <br> <a href="/ui/menu_item/5">Caffe Breve </a><br><br>
        <img src='/ui/images/6' id="mi_6" class="menu_icon"> <br> <a href="/ui/menu_item/6">Cappuccino </a><br><br>
        <img src='/ui/images/7' id="mi_7" class="menu_icon"> <br> <a href="/ui/menu_item/7">Caffe Mocha </a><br><br>
        <img src='/ui/images/8' id="mi_8" class="menu_icon"> <br> <a href="/ui/menu_item/8">Americano </a><br><br>
        <img src='/ui/images/9' id="mi_9" class="menu_icon"> <br> <a href="/ui/menu_item/9">Latte Macchiato </a><br><br>
        <img src='/ui/images/10' id="mi_10" class="menu_icon"> <br> <a href="/ui/menu_item/10">Red Eye </a><br><br>
        <img src='/ui/images/11' id="mi_11" class="menu_icon"> <br> <a href="/ui/menu_item/11">Cafe au Late </a><br><br>
        </div>
        <script type="text/javascript" src="/ui/cafe_home_page.js">
        </script>
        `;

        if(log_in_details==="logged in")
          html_data+=` <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=cafe_home_page">
            </script>`;

        html_data+=`
    </body>
</html>
  `;
  return html_data;
}


function cafe_home_page_template_js() // returns js for index page 
{
  var js_data=``;
  //writing events for each image,referenced by its id as mi_1,mi_2 ...
  for(var i=0;i<=11; i++)
  {
    js_data+=`
      menu_item_${i}=document.getElementById('mi_${i}');
      
      var count_${i}=0;
      var key_${i}=1;
      var super_key_${i}=1;

      function movearound_${i}()
      { 
        if(key_${i}==1)
        { count_${i}=count_${i} + 25;
          menu_item_${i}.style.marginLeft =count_${i} + 'px';
          if (count_${i}==200)
            key_${i}=0;
        }
        else
        { if(count_${i} > 0)
          {
            count_${i}=count_${i} - 25;
            menu_item_${i}.style.marginLeft =count_${i} + 'px';
          
          if (count_${i}==25)
           super_key_${i}=1;  // entier back and forth animation is over 
          
          }
        }
      };

      menu_item_${i}.onmouseover=function()
      { 
      if (super_key_${i}==1)
        { 
          super_key_${i}=0;//animation starts
          var interval=setInterval(movearound_${i},100);
        }
      };
      


      //*******************************************************************************************************************************************************************
      //experiment with setInterval
      super_key_${i}=1;

      menu_item_${i}.onmouseleave=function()
      { 
       //super_key_${i}=1;
         
      }; 
    `;
  };
  return js_data;
};







function comment_template(id)//returns a js code unique for each page
{   
  var js_data=`
    //get the submit element on this page by referencing it with given item_id

    submit_btn=document.getElementById('sub_id_${id}');


    //use send_req_and_get_res when page is loaded and when submit_btn is clicked

    submit_btn.onclick=function ()
      {
        send_req_and_get_res();
      }   
      
      //*******************************************************************************************************************************************************************
      //think!
    // send_req_and_get_res();//when page is loaded

     //function that sends request,with data as null when page is loaded,catches resopse and render's on current page

    function send_req_and_get_res()
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        //*******************************************************************************************************************************************************************
        //Loading
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take comments from the request and parse them into array 
            var comment=JSON.parse(request.responseText);
            var time = new Date(comment.time);
            var old_list=document.getElementById('ol_id_${id}');
            old_list.innerHTML="<li>"+comment.text+"<br>By:"+comment.username+"<br>submitted at:<br>"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"</li>"+old_list.innerHTML;
          }
        }

      };

      //making request
      input=document.getElementById('in_id_${id}');
      data=input.value;
      //sending request to page with id=current_id
      request.open('POST','http://ceidloc.imad.hasura-app.io/ui/menu_item/${id}',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/menu_item/${id}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {comment:data} ) );
    };

    `

  return js_data;
    
}



function menu_item_template(data,comments,log_in_details)//returns html doc
{   
    var item_id=data.item_id;
    var title=data.title;
    var body=data.body;
    var head=data.head;

    var html_data=cafe_layout;
    html_data+=`
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
          <!-creating seperate id's for each page by using the item_id from the js obj->
          <ol id = 'ol_id_${item_id}' class="comment_list">
        
        `;

        if(comments==='Be the first to comment!')
        {   
          html_data+=comments;
        }
        else
        {
          console.log("inside menu_item_template,comments",comments);
          comment=JSON.parse(comments);
          console.log("inside menu_item_template,comment",comment);
          //creating a string to render in the inner html of ol on this article page
          for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
            {
              var time = new Date(comment[i].time);
              console.log("inside menu_item_template,time var:",time);
              html_data+="<li>"+comment[i].text+"<br>By:"+comment[i].username+"<br>submitted at:<br>"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"</li>";
            };
        }
        
        html_data+="</ol><br><hr>";

        if (log_in_details==="not logged in")
        {
          html_data+="<br><div class=comment_head>not logged in! </div>";
          html_data+=log_in_block;
          html_data+=`
          <script type="text/javascript" src="/ui/log_in_page_js/previous_page?previous_page=menu_item/${item_id} ">
          </script>
        `;
        }
        else
        {
          html_data+= `
          <input type='text' id ='in_id_${item_id}' class ="input_box" placeholder="Submit a new comment!"></input>
          <br>
          <input type='submit' id ='sub_id_${item_id}' class = "submit_btn" value='Submit'></input><br>
          `;
          html_data+=log_out_block+`
          <script type="text/javascript" src="/ui/menu_comment/${item_id}">
          </script>
          <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=menu_item/${item_id} ">
          </script>
        `; 
        }

        html_data+=`
      </body>
    </html>`;

    return html_data;
}


function order_template(menu_items,cart,cart_id)
{ 
  menu_items=JSON.parse(menu_items);
  cart=JSON.parse(cart);
  var html_data=cafe_layout;
  html_data+=`
        <div class="menu_head">
        Place your order
        </div>
        <hr>
        <ol id = 'menu_page_item_list'>
        `;
  
    for (var i=0;i<=11;i++)
    {
      //extracting the item_id and head of each item present in the menu_list
      var item_id=menu_items[i].item_id;
      var head=menu_items[i].head;
      var price=menu_items[i].price;
      html_data+=`<li>
      <div id='head_for_item_id_${item_id}'>${head}</div>
      <div id='quantity_item_id_${item_id}'></div>
      <div id='price_item_id_${item_id}'>${price}</div>
      <input type='submit' id='place_this_item_id_${item_id}' class = "place_order_submit_btn" value='Add in cart'> </input>
      </li>
      `;
    };
  

    html_data+=`
    </ol>
    <ul id='cart'>`

     if (cart==="empty cart")
        { 
          html_data+='Empty Cart';

        }
     else
        {
          //creating a string to render in the inner html of ol on this article page
          for (var i=0;i<=cart.length-1;i++)    //storing in reverse to show the most recent comment at the top
            { //inserting head,stored in menu_iems, of item in cart,referenced by using its item_id 
              html_data+="<li>"+menu_items[cart[i].item_id].head +" Qty:"+cart[i].quantity +" price:"
              + (cart[i].quantity * parseInt(cart[i].price.substr(1,4),10) ).toString() +"</li>";
              //converting price string($322)'s substring into int 
            };

        }

    html_data+="</ul>"
    html_data+="<div class=side_nav_link>"+log_out_block+`</div>
    <script type="text/javascript" src="/ui/order_page_js/${cart_id}">
    </script>
    <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=order_page">
    </script>
    </body>
    </html>
    `;

  return html_data;
}

function order_template_js(cart_id)
{ 
  var js_data=`var cart=document.getElementById('cart'); `;

  for (var i=0;i<=11;i++)//i=-1
  {
    if (i==-1)
    {
      js_data+=`send_req_and_get_res0(-1);`;
    }
    else
    {
      js_data+=`
        var submit_for_item_id_${i}=document.getElementById('place_this_item_id_${i}');
        submit_for_item_id_${i}.onclick=function()
          {
            send_req_and_get_res${i}(${i});
         };    
      function send_req_and_get_res${i}(id_no)
      {
        var request=new XMLHttpRequest();
        request.onreadystatechange= function()
        {
          if (request.readyState===XMLHttpRequest.DONE)
          {
            if (request.status === 200)
            {
              //take comments from the request and parse them into array 
             var new_cart=JSON.parse(request.responseText);

              var new_order="";
            //creating a string to render in the inner html of ol on this article page
            for (var i=0;i<=new_cart.length-1;i++)   
              {//extracting head ,for this item in cart, from the html doc for this end point,referenced by item_id of item inserted/updated in current cart.
                var head=document.getElementById('head_for_item_id_'+new_cart[i].item_id).innerHTML;
                new_order+="<li>"+head +" Qty:"+new_cart[i].quantity +" prices:"
                + (new_cart[i].quantity * parseInt(new_cart[i].price.substr(1,4),10) ).toString() +"</li>";
              };

              //new_order=request.responseText;
              if(new_order!=="")
              {
              cart.innerHTML=new_order;
              }
            }
          }

        };

        //making request
        if (id_no === -1)
        request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/-1',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/-1',true);
        else 
        request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/${i}',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/${i}',true);
        request.send(null);
      };`;
    }//else end
  }
  


  return js_data;
}

  

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});