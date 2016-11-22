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
    secret:crypto.randomBytes(128).toString('hex'),
    cookie:{maxAge:1000*60*60*24}//last's one day
  })
);

//###############################
//path.join(__dirname,'/ui/py_scripts','twitter_streaming_data_collection.py')

    var spawn = require('child_process').spawn,
    py    = spawn('python', [path.join(__dirname,'ui','py_scripts','twitter_streaming_data_collection.py')]),
    
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

var cafe_nav_bar=`
  <div class=side_cafe_nav_bar>
  <a href='/'>Home</a>
  <a href='/ui/cafe_home_page'>Milky Way Cafe</a>
  <a href='/ui/a/cafe_menu/order_page'>Order</a>
  </div>
        `;

var cafe_layout=`
  <!doctype html>
  <html>
  <title>Milky Way Cafe</title>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body class=cafe_menu> <!-- background="/ui/images/bg_image"> -->
        <div class="header">Milky Way Cafe
        </div>
        <hr>
`+cafe_nav_bar;

var nav_bar=`
  <div class=side_cafe_nav_bar>
  <a href='PLACEHOLDER'>PLACEHOLDER</a>
  <a href='PLACEHOLDER'>PLACEHOLDER</a>
  </div>
        `;

var article_layout=`
  <!doctype html>
  <html>
  <title>PLACEHOLDER</title>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body class=PLACEHOLDER> 
        <div class="PLACEHOLDER">PLACEHOLDER
        </div>
        <hr>
`;


var log_in_block=`
<input type='text' id ='log_in_username_button' class ="input_box" placeholder="Enter Username"></input><br>
<input type='password' id ='log_in_password_button' class ="input_box" placeholder="Enter Password"></input><br>
<input type='submit' id ='log_in_submit_button' class = "submit_btn" value='Log in!'></input><br><br><hr>
<input type='submit' id ='sign_up_submit_button' class = "submit_btn" value='Sign up!'  onClick="postOnClick();"></input>
<br><br><br>
`;

var log_out_block=`<input type='submit' id ='log_out_submit_button' class = "submit_btn" value='Log Out' onClick="postOnClick();"></input><br>`;

var delete_block=`<input type='submit' id =PLACEHOLDER class = 'submit_btn_small' value='delete' onClick='PLACEHOLDER;'></input><br>`;

var update_block=`<input type='submit' id =PLACEHOLDER class = 'submit_btn_small' value='update' onClick='PLACEHOLDER;'></input><br>`;

app.get('/ui/log_out',function(req,res)
{
  //if user is logged in delete session token
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    ////console.log("inside log_out end point");
    delete req.session.auth.user_id;
    res.send("logged out!");
    ////console.log("inside log_out end point after delete");
  }
});


app.get('/ui/log_out_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  ////console.log("previous_page:",req.query);
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
          ////console.log("inside readyState");
          //request.setRequestHeader('Content-Type','application/json');
          window.location.href = "http://ceidloc.imad.hasura-app.io/ui/${previous_page}";
      }
    }
    ////console.log("outside readyState");
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
{//url -> log_in_page/previous_page?previous_page=...
  var previous_page=req.query.previous_page;
  res.send(log_in_page_template(previous_page));
});


function log_in_page_template(previous_page)
{ 
    //console.log("\n\n inside log_in_page_template,previous_page:",previous_page);
    var category=previous_page.split('/')[1];
    if (category===undefined)
      category=previous_page.split('/')[0];
    //console.log("\n\n inside log_in_page_template,category:",category);

    //replcaing PLACEHOLDER with desired value
    var nav_bar_for_this_category=nav_bar.replace('PLACEHOLDER','/');//href= 
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','HOME');//value in b/w <a> tag
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','/ui/a/'+category);//href
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER',category);//value in b/w <a> tag

    //replcaing PLACEHOLDER with desired value
    var layout_for_this_category=article_layout.replace('PLACEHOLDER',category);//first one is for title
     layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body class 
     layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category+'_header');//header class
     layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body head
    

    var html_data=layout_for_this_category+nav_bar_for_this_category;
    
    if (category==='cafe_menu'||category==='cafe_home_page')
      html_data=cafe_layout;

  html_data+=`
    <div class="page_head">
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
  ////console.log("previous_page:",req.query);
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
      //Loading
      submit_btn.value='Submitting';
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
          ////console.log("inside readyState");
          //request.setRequestHeader('Content-Type','application/json');
          window.location.href = "http://ceidloc.imad.hasura-app.io/ui/sign_up_page/previous_page?previous_page=${previous_page}";
      }
    }
    ////console.log("outside readyState");
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
    //console.log("\n\n inside sign_up_page_template,previous_page:",previous_page);
    var category=previous_page.split('/')[1];
    if (category===undefined)
      category=previous_page.split('/')[0];
    //console.log("\n\n inside sign_up_page_template,category:",category);
    //replcaing PLACEHOLDER with desired value
    var nav_bar_for_this_category=nav_bar.replace('PLACEHOLDER','/');//href= 
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','HOME');//value in b/w <a> tag
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','/ui/a/'+category);//href
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER',category);//value in b/w <a> tag

    //replcaing PLACEHOLDER with desired value
    var layout_for_this_category=article_layout.replace('PLACEHOLDER',category);//first one is for title
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body class 
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category+'_header');//header class
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body head


    var html_data=layout_for_this_category+nav_bar_for_this_category;

    if (category==='cafe_menu'||category==='cafe_home_page')
      html_data=cafe_layout;

  html_data+=`
    <div class="page_head">
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
      //Loading
      submit_btn.value='Submitting';      
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
  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
    log_in_details=["logged in",req.session.auth.user_id.user_id];

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
      ////console.log("inside cs js insert cart result:",result);
     cart_bill_format(res,cart_id,JSON.stringify(["insert item",item_id]),log_in_details);
    }
    else
    {
      ////console.log("inside cs js update cart result:",result);
      ////console.log("inside cs js update cart quantity:",result.rows[0].quantity);
      cart_bill_format(res,cart_id,JSON.stringify(["update item",item_id,result.rows[0].quantity]),log_in_details);
    }
  });
});

app.get('/ui/a/cafe_menu/order_page/', function (req, res) {// add /:cart_id 
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
    previous_page="a/cafe_menu/order_page";
    res.send(log_in_page_template(previous_page));
   }
  
});


app.get('/ui/a/cafe_menu/order_page_js/:cart_id', function (req, res) {
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  res.send(order_template_js(cart_id));
  
});

var cart_counter=0;
function cart_bill_format(res,cart_id,data)
{
  //data is an array with format ['type of query',]
//type's of query's to handle : data value
//from interleaf 1.insert->create new: new cart;2.select->give list of carts:give cart list,3. on click on cart_id from list,link to order_page with clicked cart_id
//from server_template's on load select->load cart with given cart_id:load cart
//from client_side_template on click add, 1.insert->the item in cart given cart_id item_id : " ['insert item',item_id] "
//                                     or 2.update->update cart given cart_id,item_id : update cart
//                                    and 3.recycle server_template's select query for client side templating with modified data:c-side load cart

  if (data.substr(2,11)==="update item")
  {
    ////console.log("inside c_b_f insert cart data:",data);
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
        ////console.log("inside c_b_f insert cart result:",result);
        cart_bill_format(res,cart_id,"cs-load cart");
      }

    });

  }
  else if (data.substr(2,11)==="insert item")
  {
    //add item,corresponding to given item_id,to the cart,corresponding to given cart_id, and set quantity to 1
    ////console.log("inside c_b_f insert cart data:",data);
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
        ////console.log("inside c_b_f insert cart result:",result);
        cart_bill_format(res,cart_id,"cs-load cart");
      }

    });

  }
  else 
  {
    //if (data==="load cart")
    //selecting all the items from menu,which exits in cart,corresponding to given cart_id,along with its quantity from cart
    pool.query("SELECT m.item_id,m.price,c.quantity FROM cart AS c LEFT JOIN cafe_menu AS m ON c.item_id=m.item_id WHERE c.cart_id=$1 ORDER BY m.item_id",
      [cart_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (data==="cs-load cart")
      {//data for client side,ajax data call 
          ////console.log("inside c_b_f cs-load cart result:",result);
          res.send(JSON.stringify(result.rows));
      }
      else if (data==="load cart")
      { 
        //selecting all the cafe_menu present in the menu,with its corresponding head from article_table,where article_id=0,aka the cafe shop owner
         pool.query("SELECT a.head,m.price,m.item_id FROM article_table AS a LEFT JOIN cafe_menu AS m ON a.article_id=m.item_id ORDER BY m.item_id",
          function(err,cafe_menu)
          {
            if (err)
            {
              res.status(500).send(err.toString());
            }
            else if (result.rows.length!==0)
            { 
              ////console.log("inside load cart result:",result);
              ////console.log("inside load cart cafe_menu:",cafe_menu);
             res.send(order_template( JSON.stringify(cafe_menu.rows) , JSON.stringify(result.rows) ,cart_id ) );
            }
            else
            {
              ////console.log("inside load cart else result:",result);
              ////console.log("inside load cart else cafe_menu:",cafe_menu);
             res.send(order_template( JSON.stringify(cafe_menu.rows),JSON.stringify("empty cart") ,cart_id ) );
            }

          });

        }
    });
  }

};


//post requst to insert comment
app.post('/ui/a/:category/:article_id', function (req, res)
{ 
  //can only add comments if logged in!
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    log_in_details=req.session.auth.user_id.user_id;

    //url type: ui/3/comment?comment=... here id = 3
    var article_id=req.params.article_id;
    var article_id=parseInt(article_id,10);//convertin id containg string type  value to int type decimal value
    var comment=req.body.comment;
    if (comment!=="")
      {
        //list[id_no].push(comment);
        comment_format(res,['insert comment',comment],article_id,log_in_details);

      }
    //returning only the row containing the comments from current page as JSON string represntation of that row,stored in a 2-D array
    //res.send(JSON.stringify(list[id_no])); 
  }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/main.js',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/a/:category/submit_page',function(req,res)
  {
    var category=req.params.category;
    if (req.session && req.session.auth && req.session.auth.user_id )
    {
      log_in_details=req.session.auth.user_id.user_id;
      res.send(submit_page_template(category));
    } 
    else
    {
      //redirecting to login page,using the log_in_page_tempate
      //after login redirects to submit_page,aka the current end point 
      previous_page="a/"+category+"/submit_page";
      res.send(log_in_page_template(previous_page));
    } 
  });

app.get('/ui/a/:category/submit_page_js',function(req,res)
  {
    var category=req.params.category;
    res.send(submit_page_template_js(category))
  });


function submit_page_template(category)
{
  
    //replcaing PLACEHOLDER with desired value
    var nav_bar_for_this_category=nav_bar.replace('PLACEHOLDER','/');//href= 
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','HOME');//value in b/w <a> tag
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','/ui/a/'+category);//href
    nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER',category);//value in b/w <a> tag

    //replcaing PLACEHOLDER with desired value
    var layout_for_this_category=article_layout.replace('PLACEHOLDER',category);//first one is for title
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body class 
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category+'_header');//header class
    layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body head


    var html_data=layout_for_this_category+nav_bar_for_this_category;

    if (category==='cafe_menu')
      html_data=cafe_layout;

  html_data+=`
    <div class="page_head">
    Submit An Article!
    <hr>
    </div>
  `;
  html_data+=`
  <input type='text' id ='article_sumbit_head_button_${category}' class ="input_box" placeholder="Enter A Title"></input><br>
  <textarea rows="4" cols="50" id ='article_sumbit_body_button_${category}' class ="input_box" placeholder="Enter Some Text"></textarea><br>
  <input type='submit' id ='article_sumbit_button_${category}' class = "submit_btn" value='Submit Article!'></input><br><br><hr>

  `;

  html_data+=`  
  </body>
  <script type="text/javascript" src="/ui/a/${category}/submit_page_js">
  </script>
  </html>
  `;
  return html_data;
}

function submit_page_template_js(category)
{
  var js_data=`
    //get the submit element on this page by referencing it with given article_id

    submit_btn=document.getElementById('article_sumbit_button_${category}');


    //use send_req_and_get_res when page is loaded and when submit_btn is clicked

    submit_btn.onclick=function ()
      {
        send_req_and_get_res();
      }   
    // send_req_and_get_res();//when page is loaded

     //function that sends request,with data as null when page is loaded,catches resopse and render's on current page

    function send_req_and_get_res()
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        //Loading
        submit_btn.value='Submitting';      

        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
            var res=JSON.parse(request.responseText);
            //console.log("inside 200, res",res);
            //res=['',{article_id:value}]
            if (res[0]==="successfully created article")
            {
            window.location.href='http://ceidloc.imad.hasura-app.io/ui/a/${category}/'+res[1].article_id;
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
      head=document.getElementById('article_sumbit_head_button_${category}').value;
      body=document.getElementById('article_sumbit_body_button_${category}').value;

      request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"body":body,"head":head} ) );
    };

    `

  return js_data;
    

}

//post requst to insert article,belonging to this category
app.post('/ui/a/:category', function (req, res)
{ 
  //can only add article's if logged in!
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    var user_id=req.session.auth.user_id.user_id;
    var category=req.params.category;
    var head=req.body.head;
    var body=req.body.body;
    if (head!=="" && body!=="")
    {
      //inserts the article,then load's its page
      article_format(res,['insert an article',user_id,category,head,body],log_in_details);
    }
  }
});



//returns all the articles present belonging to this category
app.get('/ui/a/:category',function(req,res)
{ 
  var category=req.params.category;
   var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
   log_in_details=["logged in",req.session.auth.user_id.user_id];

  //returns all categories
  if (category==="all_categories")
    article_format(res,['categories'],log_in_details);
  else
    //returns all articles for given category
    article_format(res,['select all',category],log_in_details)

});

//give's article page by given article_id,category
app.get('/ui/a/:category/:article_id', function (req, res) {
  var article_id=req.params.article_id;
  var article_id=parseInt(article_id,10);//convertin id containg string type  value to int type decimal value
  var category=req.params.category;

  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
   log_in_details=["logged in",req.session.auth.user_id.user_id];

  //using article_format to select article,then comment format from inside to load it along with it's comments
  article_format(res,['select an article',article_id,category],log_in_details)
});

//to delete a comment,referenced by it's comment_id, is verified by user_id of current_user_id
app.post('/ui/a/:category/:article_id/:comment_id',function(req,res)
  {

  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for not logged in user
  if (req.session && req.session.auth && req.session.auth.user_id )
   log_in_details=["logged in",req.session.auth.user_id.user_id];

  var user_id=log_in_details[1];
  var comment_id=req.body.comment_id;

    comment_format(res,['delete comment',user_id,comment_id],log_in_details);
  });

function comment_format(res,data,article_id,log_in_details)
{ 
  //data is an array with format ['type of query',comments/JSON.stringify(article data)]

  if (data[0]==='delete comment')//removes the comment by updating its text as 'removed by user!'
    //data=['delete comments',comment_id]
  { 
    //data[1]=user_id,data[2]=comment_id
    pool.query("UPDATE comments SET text='removed by user!'WHERE user_id=$1 AND comment_id=$2 ",[data[1],data[2]],function(err,result)
      {
        console.log("removed comment,result",result.rows);
        if (err)
        { 
          res.status(500).send(err.toString());
        }
        //can only insert comments if logged in hence sending logged in to the recursive call;
          res.send("removed by user!");
      } );
  }
  else
  if (data[0]==='insert comment')
    //data=['insert comments',comment]
  { 
    //console.log("\n inside comment_format IF,data:",data);
    ////console.log("\n inside comment_format IF,data.parsed[1]:",JSON.parse(data[1]));
    pool.query('INSERT into comments(text,article_id,user_id) values($1,$2,$3)',[data[1],article_id,log_in_details],function(err,result)//data[1]=comment
      {
        if (err)
        { 
          res.status(500).send(err.toString());
        }
          comment_format(res,["new comment"],article_id,log_in_details);
      } );
  }
  else
  {
    pool.query('SELECT c.comment_id,c.text,c.time,u.username,u.user_id from comments as c,user_table as u WHERE c.article_id=$1 and c.user_id=u.user_id ORDER BY c.comment_id'
      ,[article_id],function(err,comments)
        {
          if (err)
          { 
           res.status(500).send(err.toString());
          }
          //data to dereference js end point request
          if (data[0]==="new comment")
          { 
            ////console.log("in select comments",comments);
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
              ////console.log("in select comments data != new comments,comment:",comments);
              res.send(article_template(JSON.parse(data[1]),JSON.stringify ( comments.rows ) ,log_in_details) );
            }
            else
            {
               res.send(article_template(JSON.parse(data[1]),'Be the first to comment!',log_in_details) );
            }
          }
        } );
    }
};



function article_format(res,data,log_in_details)
{
  //data will be of foramt ['type of query',,]
  //type's of query to handle
  //select all categories for article,from categories table
  //select all articles belonging to given category
  //insert an article belonging to given category 
  //select an article belonging to given category ['select an article',aritcle_id,category]

  if (data[0]==="delete article")
  {//data=['remove article',category,article_id]
    pool.query("DELETE FROM article_tablet WHERE article_id=$1",[data[2]],function(err,result)//data[2]=article_id
    {
      if (err)
      { 
        res.status(500).send(err.toString());
      }
      else
      {
        article_format(res,['select all',data[1]],log_in_details);//data[1]=category
      }
    });
  }

  else if (data[0]==="categories")
  {
    pool.query("SELECT * FROM categories WHERE category != 'cafe_menu' ORDER BY categories",function(err,result)
    {
      if (err)
      { 
        res.status(500).send(err.toString());
      }
      else
      {
        res.send(JSON.stringify(result.rows));
      }
    });
  }
  else if (data[0]==="select all")
  {     
      //selecting all article's from article_table belonging to the given category
      //data=['select all',category]
      var category=data[1];
      pool.query('SELECT a.head,a.article_id,u.username,u.user_id,a.time FROM article_table as a LEFT JOIN user_table as u ON u.user_id=a.user_id WHERE a.category=$1 ORDER BY a.article_id',[category],function(err,result)
      {
        if (err)
        {
          res.status(500).send(err.toString());
        }
        else if (result.rows.length===0)
        {
          res.send(article_home_page_template(res,category,'no articles present',log_in_details)) 
        }
        else
        { 
          //console.log("\n\n inside select article's form this category \n ,result.rows:",result.rows);

          res.send(article_home_page_template(res,category,JSON.stringify( result.rows ),log_in_details))  
        }
      });
  }
  else if (data[0]==="select an article")
  {
    //select an article belonging to given category data=['select an article',aritcle_id,category
    //selecting the article details from the article_tabel corresponding to the given article_id
    var article_id=data[1];
    var category=data[2];
    pool.query('SELECT a.head,a.body,a.category,a.article_id,a.time,u.username,u.user_id FROM article_table as a LEFT JOIN user_table as u ON u.user_id=a.user_id WHERE a.article_id=$1 AND a.category=$2 ORDER BY a.article_id',[article_id,category],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (result.rows.length===0)
      {
        res.status(404).send("this article is not present in this category"); 
      }
      else
      {
        //selcting comments and rendering from the server side
        //after comments on this article are queried,the current article page data along with comments will be sent to article_template
        comment_format(res,["select",JSON.stringify( result.rows[0] )],article_id,log_in_details);  
      }
    });
  }
  else if (data[0]==="insert an article")
  {
    //insert into article_table and then select this article by referencing the last article_id
    //data=['insert',user_id,category,head,body]
    var user_id=data[1];
    var category=data[2];
    var head=data[3];
    var body=data[4];

    pool.query('INSERT INTO article_table(user_id,category,head,body) values($1,$2,$3,$4)',[user_id,category,head,body],function(err,result)
      { 
       if (err)
        {
          res.status(500).send(err.toString());
        }
        else
        { //selecting the last article inserted by this user in this category,aka the current article just inserted
          article_format(res,['select last',user_id,category],log_in_details)
        }
      });
  }
  else if (data[0]==="select last")
  {
    //selecting the last article inserted by this user in this category,aka the current article just inserted
    //data=['select last',user_id,category]
    var user_id=data[1];
    var category=data[2];

    pool.query('SELECT article_id FROM article_table WHERE user_id=$1 AND category=$2',[user_id,category],function(err,result)
    {
     if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      { //send the article_id of the last article created by this user,belonging to this category
        //console.log("\n\n inside select after inserting article,result.rows[result.rows.length-1]",result.rows[result.rows.length-1]);
        res.send( ["successfully created article",result.rows[result.rows.length-1] ] );
      }
    });
  }
};


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

//returns js for article page
app.get('/ui/a/:category/:article_id/article_comment_js/', function (req, res) {
  article_id=req.params.article_id;
  category=req.params.category;
  //using article_template to resopnd with js that will sit in client and do client-side-templating to get comments on the page referenced by this id
  
  //if logged in
  //add the js for deletion,updation of comments on this.article page
  if (req.session && req.session.auth && req.session.auth.user_id )
    res.send(comment_template(category,article_id)+comment_template_delete_update_js(category,article_id));
  else
    //if not logged in 
    //sends only the js_data from comment_template
    res.send(comment_template(category,article_id));
  
});


app.get('/ui/images/:image_no', function (req, res) {
  var image_no=req.params.image_no
  res.sendFile(path.join(__dirname, 'ui', 'images',image_no+'.png'));
});


app.get('/ui/cafe_home_page',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
    log_in_details=["logged in",req.session.auth.user_id.user_id];

  res.send(cafe_home_page_template(log_in_details));
});

app.get('/ui/cafe_home_page.js',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.send(cafe_home_page_template_js(11));
});

function article_home_page_template(res,category,articles,log_in_details)
{

  //extracting log_in_details as ['logged in'/'not logged in' , user_id], note if not logged in user_id=-1
  var current_user_id=log_in_details[1];
  log_in_details=log_in_details[0];

  if(articles!=="no articles present")
    var article=JSON.parse(articles);
  
  //replcaing PLACEHOLDER with desired value
  var nav_bar_for_this_category=nav_bar.replace('PLACEHOLDER','/');//href= 
  nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','HOME');//value in b/w <a> tag
  nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','/ui/a/'+category);//href
  nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER',category);//value in b/w <a> tag

  //replcaing PLACEHOLDER with desired value
  var layout_for_this_category=article_layout.replace('PLACEHOLDER',category);//first one is for title
   layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body class 
   layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category+'_header');//header class
   layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body head
  

  var html_data=layout_for_this_category+nav_bar_for_this_category;
  
  if (category==='cafe_menu')
   { html_data=cafe_layout;
      html_data+=`
  <div class="page_head">
    ${category}`;
   }
   else
   {
    html_data+=`
  <div class="page_head">
    Articles`;
   }

  html_data+=`
    <hr>
    </div>
    <div class="menu">`;
  if(log_in_details==="logged in")
  {
    html_data+="<div class=side_nav_link>"+log_out_block+"</div>"; 
    html_data+=`<a href="/ui/a/${category}/submit_page">Submit New Article</a><br><br> `;
    html_data+=` <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=a/${category}"></script>`;
    
  }

  else
  {
    html_data+=`<a href='/ui/log_in_page/previous_page?previous_page=a/${category}' id ='log_in_page_link' class = side_nav_link>Log in!<a>`;
    html_data+=`<a href="/ui/log_in_page/previous_page?previous_page=a/${category}/submit_page">Submit New Article</a><br><br> `;
  }

  html_data+=`</div>
                <ul class="${category}_comment_list">`;

  if(articles!=="no articles present")
  {
    for(var i=0;i<=article.length-1;i++)
    { 
      //article_id of current article
      var article_id=article[i].article_id;
      var head=article[i].head;
      var username=article[i].username;
      var time=article[i].time;
      time = new Date(time)//takes a string with timestamp value and converts to a date object?
      localtime=time.toLocaleTimeString();
      date=time.toLocaleDateString();

      html_data+=`
       <li><a href="/ui/a/${category}/${article_id}">${head}</a>
       <div class='details'>
       by ${username} <br>at ${localtime} at ${date}
       </div>
       </li>
      `;
    }
  }
  else
  {
    html_data+=articles;
  }

      html_data+=`
      </ul>
    </body>
  </html>
  `;
  return html_data;

};


function cafe_home_page_template(log_in_details)
{

  //extracting log_in_details as ['logged in'/'not logged in' , user_id], note if not logged in user_id=-1
  var current_user_id=log_in_details[1];
  log_in_details=log_in_details[0];

  html_data=cafe_layout;
  html_data+=`
  <div class="page_head">
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
        Place Your Order! <a href="/ui/a/cafe_menu/order_page">Click Here</a><br><br><br>
        <img src='/ui/images/0' id="mi_0" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/0">Espresso</a><br><br>
        <img src='/ui/images/1' id="mi_1" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/1">Espresso Macchiato</a><br><br>
        <img src='/ui/images/2' id="mi_2" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/2">Espresso con Panna </a><br><br>
        <img src='/ui/images/3' id="mi_3" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/3">Caffe Latte </a><br><br>
        <img src='/ui/images/4' id="mi_4" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/4">Flat White </a><br><br>
        <img src='/ui/images/5' id="mi_5" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/5">Caffe Breve </a><br><br>
        <img src='/ui/images/6' id="mi_6" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/6">Cappuccino </a><br><br>
        <img src='/ui/images/7' id="mi_7" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/7">Caffe Mocha </a><br><br>
        <img src='/ui/images/8' id="mi_8" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/8">Americano </a><br><br>
        <img src='/ui/images/9' id="mi_9" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/9">Latte Macchiato </a><br><br>
        <img src='/ui/images/10' id="mi_10" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/10">Red Eye </a><br><br>
        <img src='/ui/images/11' id="mi_11" class="menu_icon"> <br> <a href="/ui/a/cafe_menu/11">Cafe au Late </a><br><br>
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


function cafe_home_page_template_js(no_of_menu_items) // returns js for index page 
{
  var js_data=``;
  //writing events for each image,referenced by its id as mi_1,mi_2 ...
  for(var i=0;i<=no_of_menu_items; i++)
  {
    js_data+=`
      cafe_menu_${i}=document.getElementById('mi_${i}');
      
      var count_${i}=0;
      var key_${i}=1;
      var super_key_${i}=1;

      function movearound_${i}()
      { 
        if(key_${i}==1)
        { count_${i}=count_${i} + 25;
          cafe_menu_${i}.style.marginLeft =count_${i} + 'px';
          if (count_${i}==200)
            key_${i}=0;
        }
        else
        { if(count_${i} > 0)
          {
            count_${i}=count_${i} - 25;
            cafe_menu_${i}.style.marginLeft =count_${i} + 'px';
          
          if (count_${i}==25)
           super_key_${i}=1;  // entier back and forth animation is over 
          
          }
        }
      };

      cafe_menu_${i}.onmouseover=function()
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

      cafe_menu_${i}.onmouseleave=function()
      { 
       //super_key_${i}=1;
         
      }; 
    `;
  };
  return js_data;
};



function comment_template(category,id)//returns a js code unique for each page
{   
  var js_data=`
    //get the submit element on this page by referencing it with given article_id

    var delete_block="${delete_block}";
    var update_block="${update_block}";
   
    submit_btn=document.getElementById('sub_${category}_id_${id}');


    //use send_req_and_get_res when page is loaded and when submit_btn is clicked

    submit_btn.onclick=function ()
      {
        send_req_and_get_res();
      }   
      
    // send_req_and_get_res();//when page is loaded
     //function that sends request,with data as null when page is loaded,catches resopse and render's on current page

    function send_req_and_get_res()
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        //Loading
        submit_btn.value='Submitting';

        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take comments from the request and parse them into array 
            var comment=request.responseText;
            comment=JSON.parse(comment);
            var time = new Date(comment.time);
            var old_list=document.getElementById('ol_${category}_id_${id}');
            
            if (old_list.innerHTML.trim()==='Be the first to comment!' )
              old_list.innerHTML="";

            var new_comment="<li><div id="+comment.comment_id+">"+comment.text+"</div><div class='details'>By:"+comment.username+"<br>submitted at:"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"<br>";

            delete_btn=delete_block.replace('PLACEHOLDER','delete_btn_id_'+comment.comment_id );//replace's id=PLACEHOLDER
            delete_btn=delete_btn.replace('PLACEHOLDER','delete_comment('+ comment.comment_id+');');//replaces onclick='PLACEHOLDER'

            new_comment+=delete_btn;

            update_btn=update_block.replace('PLACEHOLDER','update_btn_id_'+comment.comment_id );//replace's id=PLACEHOLDER
            update_btn=update_btn.replace('PLACEHOLDER','update_comment('+ comment.comment_id+');');//replaces onclick='PLACEHOLDER'

            new_comment+=update_btn;

            old_list.innerHTML+="</div></li>";

            old_list.innerHTML=new_comment+old_list.innerHTML;

          }
        }

      };

      //making request
      input=document.getElementById('in_${category}_id_${id}');
      data=input.value;
      //sending request to page with id=current_id
      request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}/${id}',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}/${id}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {comment:data} ) );
    };

    `

  return js_data;
    
}


function comment_template_delete_update_js(category,article_id)
{
  js_data+=`
    function delete_comment(comment_id)
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take comments from the request and parse them into array 
            var comment=request.responseText;
            if (comment==='removed by user!')
              //updating the value of removed comment
              {
              old_comment=document.getElementById(comment_id);
              console.log("old_comment:",old_comment);
              old_comment.innerHTML=comment;
            }
          }
        }

      };

      //making request
      //sending as post for time being,will update to DELETE
      request.open('POST',"http://ceidloc.imad.hasura-app.io/ui/a/${category}/${article_id}/"+comment_id.toString(),true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"comment_id":comment_id} ) );
    };
  `;
  return js_data;
}


function article_template(data,comments,log_in_details)//returns html doc
{   
    //extracting log_in_details as ['logged in'/'not logged in' , user_id], note if not logged in user_id=-1
    var current_user_id=log_in_details[1];
    log_in_details=log_in_details[0];

    var article_id=data.article_id;
    var title=data.title;
    var body=data.body;
    var head=data.head;
    var username=data.username;
    var user_id=data.user_id;
    var time=data.time;
    var category=data.category;


      //replcaing PLACEHOLDER with desired value
      var nav_bar_for_this_category=nav_bar.replace('PLACEHOLDER','/');//href= 
      nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','HOME');//value in b/w <a> tag
      nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER','/ui/a/'+category);//href
      nav_bar_for_this_category=nav_bar_for_this_category.replace('PLACEHOLDER',category);//value in b/w <a> tag

      //replcaing PLACEHOLDER with desired value
      var layout_for_this_category=article_layout.replace('PLACEHOLDER',category);//first one is for title
      layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body class
       layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category+'_header');//header class
      layout_for_this_category=layout_for_this_category.replace('PLACEHOLDER',category);//body head


      var html_data=layout_for_this_category+nav_bar_for_this_category;

      if (category==='cafe_menu')
        html_data=cafe_layout;


    html_data+=`
        <div class='page_head'>
          ${head}
        </div>
        <div class='center'>
        ${body}
        <hr>
        </div>
          <div class="${category}_comment_head">
          Comments
          </div>
          <!-creating seperate id's for each page by using the article_id from the js obj->
          <ol id = 'ol_${category}_id_${article_id}' class="${category}_comment_list">
        
        `;

        if(comments==='Be the first to comment!')
        {   
          html_data+=comments;
        }
        else
        {
          ////console.log("inside article_template,comments",comments);
          comment=JSON.parse(comments);
          ////console.log("inside article_template,comment",comment);
          //creating a string to render in the inner html of ol on this article page
          for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
            {
              var time = new Date(comment[i].time);
              ////console.log("inside article_template,time var:",time);
              html_data+="<li> <div id=" + comment[i].comment_id + ">"+comment[i].text+"</div><div class='details'>By:"+comment[i].username+"<br>submitted at:"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"<br>";

              if (comment[i].user_id===current_user_id)
              {
                
                delete_btn=delete_block.replace('PLACEHOLDER','delete_btn_id_'+ comment[i].comment_id);//replaces; id=PLACEHOLDER
                delete_btn=delete_btn.replace('PLACEHOLDER','delete_comment('+ comment[i].comment_id+');');//replaces; onclick='PLACEHOLDER'
                html_data+=delete_btn;

                update_btn=update_block.replace('PLACEHOLDER','update_btn_id_'+comment[i].comment_id );
                update_btn=update_btn.replace('PLACEHOLDER','update_comment('+ comment[i].comment_id+');');//replaces; onclick='PLACEHOLDER'
                html_data+=update_btn;
              }

              html_data+="</div></li>";
            };
        }
        
        html_data+="</ol><br><hr>";

        if (log_in_details==="not logged in")
        {
          html_data+=`<br><div class=${category}_comment_head>not logged in! </div>`;
          html_data+=log_in_block;
          html_data+=`
          <script type="text/javascript" src="/ui/log_in_page_js/previous_page?previous_page=a/${category}/${article_id} ">
          </script>
        `;
        }
        else
        {
          html_data+= `
          <input type='text' id ='in_${category}_id_${article_id}' class ="input_box" placeholder="Submit a new comment!"></input>
          <br>
          <input type='submit' id ='sub_${category}_id_${article_id}' class = "submit_btn" value='Submit'></input><br>
          `;
          html_data+=log_out_block+`
          <!-script for log_out ->
          <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=a/${category}/${article_id} ">
          </script>

          <!-js for inserting comments ->
          <script type="text/javascript" src="/ui/a/${category}/${article_id}/article_comment_js/">
          </script>
        `; 
        }

        html_data+=`
      </body>
    </html>`;

    return html_data;
}

function order_template(cafe_menu,cart,cart_id)
{ 
  cafe_menu=JSON.parse(cafe_menu);
  cart=JSON.parse(cart);
  var html_data=cafe_layout;
  html_data+=`
        <div class="page_head">
        Place your order
        </div>
        <hr>
        <ol id = 'cafe_menu_item_list'>
        `;
  
    for (var i=0;i<=11;i++)
    {
      //extracting the item_id and head of each item present in the menu_list
      var item_id=cafe_menu[i].item_id;
      var head=cafe_menu[i].head;
      var price=cafe_menu[i].price;
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
              html_data+="<li>"+cafe_menu[cart[i].item_id].head +" Qty:"+cart[i].quantity +" price:"
              +cart[i].price.substr(0,1)+(cart[i].quantity * parseInt(cart[i].price.substr(1,4),10) ).toString() +"</li>";
              //converting price string($322)'s substring into int 
            };

        }

    html_data+="</ul>"
    html_data+="<div class=side_nav_link>"+log_out_block+`</div>
    <script type="text/javascript" src="/ui/a/cafe_menu/order_page_js/${cart_id}">
    </script>
    <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=a/cafe_menu/order_page">
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
                new_order+="<li>"+head +" Qty:"+new_cart[i].quantity +" price:"
                +new_cart[i].price.substr(0,1)+(new_cart[i].quantity * parseInt(new_cart[i].price.substr(1,4),10) ).toString() +"</li>";
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
  ////console.log(`IMAD course app listening on port ${port}!`);
});