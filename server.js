//for easy navigation through various sections of this app
//use ->find //section
//each section has
//  1.end points for respective section
//  2.all template function's to generate html and javascript string's for respective section
//  3.(optionally)function to handle all database queries if needed

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


  //  var spawn = require('child_process').spawn,
  //  py    = spawn('python', [path.join(__dirname,'ui','py_scripts','twitter_streaming_data_collection.py')]),    


config=
{
  user:'ceidloc',
  database:'ceidloc',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD
};

pool =new Pool(config);


//bootstrap end point

 app.use("/ui/bootstrap", express.static(__dirname+'/ui/bootstrap'));  

//images end point

 app.use("/ui/images", express.static(__dirname+'/ui/images'));

//html layout's to be used inside templates


function article_layout_template(category,log_in_details,previous_page)
{
  var article_layout=`
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Home</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/ui/style.css">
    <link rel="stylesheet" href="/ui/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="/ui/bootstrap/css/bootstrap.min.css">
    <link rel='shortcut icon' type='image/x-icon' href='/ui/images/0.png' />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script> 
    <script type="text/javascript" src='/ui/bootstrap/js/bootstrap.js'></script>
    <script type="text/javascript" src='/ui/bootstrap/js/bootstrap.min.js'></script>
    <script>//to make drop down menu work
    $(document).ready(function () {
        $('.dropdown-toggle').dropdown();
    });
</script>
    <style>
        .loader {
      border: 16px solid #d9e1e8 ;
      border-radius: 50%;
      border-top: 16px solid #9baec8 ;
      width: 120px;
      height: 120px;
      -webkit-animation: spin 2s linear infinite;
      animation: spin 2s linear infinite;
    }

    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    </style>

  <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> -->
</head>


<body class="${category}">
<div class="container-fluid ${category}_header category_header">
  `;
  if(category==="cafe_menu")
  {
    article_layout+=`
  <h1 class="text-center page_head" >Milky Way Cafe</h1>
  <h3 class="text-center ">Menu</h3>
  `;
  }
  else
  {
    article_layout+=`
  <h1 class="text-center page_head">${category}</h1>
  <h3 class="text-center">Articles</h3>
  `; 
  }
  
  article_layout+=`
  
  <p></p>
</div>

    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>                        
          </button>
          <a class="navbar-brand" href='/'>Home</a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#">Featured Pages<span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="/ui/cafe_home_page">Milky Way Cafe</a></li>
                <li><a href="#">About</a></li>
              </ul>
            </li>
          `;
          if(category==="cafe_menu")
            {
              article_layout+=`
              <li><a href="/ui/cafe_home_page">Milky Way Cafe</a></li>
              <li><a href="/ui/order/cafe_menu/order_page">Order</a></li>
            </ul>`;
            }
          else
            {
              article_layout+=`
              <li><a href="/ui/get/all_categories_ss">Articles</a></li>`;
            }
            if(category!=="home_page" && category!=="cafe_menu")
            {
              article_layout+=`
                   <li><a href="/ui/a/${category}">${category}</a></li>`;
            }

            article_layout+="</ul>";
          
          if(log_in_details==="not logged in")
          {
            article_layout+=
            `
            <ul class="nav navbar-nav navbar-right">
              <li><a href="/ui/sign_up_page/previous_page?previous_page=${previous_page}"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="/ui/log_in_page/previous_page?previous_page=${previous_page}"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>
            `;
          }
          else
          {
            article_layout+=
            `
            <ul class="nav navbar-nav navbar-right">
              `+log_out_block+`
            </ul>
            `;
          }

          article_layout+=`
        </div>
      </div>
    </nav>
  `;

  return article_layout;
};


//html for log_out,update delete button's and for log_in_block

var log_in_block=`
<div class='rows'>
<div class='col-xs-1 col-md-3'>
</div>
  <div class='col-xs-10 col-md-6'>
    <input type='text' id ='log_in_username_button' class ="form-control " autocomplete='on' placeholder='Enter Username'></input><br>
    <input type='password' id ='log_in_password_button' class ="form-control" placeholder="Enter Password"></input><br><br>
    <input type='submit' id ='log_in_submit_button' class = 'btn btn-primary' value='Log in!'></input><br><hr>
    <input type='submit' id ='sign_up_submit_button' class = 'btn btn-primary' value='Sign up!'  onClick="sign_up_OnClick();"></input>
  </div>
</div>
`;

var log_out_block=`<input type='submit' id ='log_out_submit_button' class = 'btn btn-danger' value='Log Out' onClick="log_out_OnClick();"></input>`;

var delete_block=`<input type='submit' id =PLACEHOLDER class = 'btn btn-warning' value='delete' onClick='PLACEHOLDER;'> </input>`;

var update_block=`<input type='submit' id =PLACEHOLDER class = 'btn btn-info' value='update' onClick='PLACEHOLDER'; autofocus wrap='hard'> </input>`;

//function's to prevent xss attack

function escape_html_js(text)
{//all output's for the user entered input,will use this function during client side rendering
  var text=document.createTextNode(text);
  var div=document.createElement('div');
  div.appendChild(text);

  return div.innerHTML;
}


function escape_html_cs(unsafe)
{//all output's for user entered data,from the server side will use this function
 return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

//function's to create session token

app.use(session (
  {
    secret:crypto.randomBytes(128).toString('hex'),
    cookie:{maxAge:1000*60*60*24}//last's one day
  })
);


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

function hash (input, salt) 
{
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


//section 
//end points for index/home page

app.get('/', function (req, res) 
{
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/home_page', function (req, res) 
{
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/main.js',function(req, res)
{
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


//section 
//end points for log_in/log_out
  
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

app.get('/ui/log_in_page_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  res.send(log_in_page_template_js(previous_page));
});

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


//for log_out

app.delete('/ui/log_out',function(req,res)
{
  //if user is logged in delete session token
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    delete req.session.auth.user_id;
    res.send("logged out!");
  }
});


app.get('/ui/log_out_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  res.send(log_out_template_js(previous_page));
});

//template function's for log_in log_out

function log_in_page_template(previous_page)
{ 
    var category=previous_page.split('/')[1];
    if (category===undefined)
      category=previous_page.split('/')[0];

    if (category==="cafe_home_page")
      category="cafe_menu"

    else if (category==="all_categories")
      category="home_page"

    var html_data=article_layout_template(category,'not logged in',previous_page);
    

  html_data+=`
    <h1 class="text-center">
    Log in!
    <hr>
    </h1>
  `;
  log_in_block_autofocus=log_in_block.replace("placeholder='Enter Username'>","placeholder='Enter Username' autofocus>");
  html_data+=log_in_block_autofocus;
  html_data+=`  
  </body>
  <script type="text/javascript" src="/ui/log_in_page_js/previous_page?previous_page=${previous_page}">
  </script>
  </html>
  `;
  return html_data;
}

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
          window.location.href=window.location.protocol+'//'+window.location.host+'/ui/${previous_page}';
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
    { request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/log_in',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify({username:username,password:password}));
    }
  };

function sign_up_OnClick()
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() 
    {
      if (request.readyState == 4 && request.status == 200) 
      {    
          window.location.href = window.location.protocol+"//"+window.location.host+"/ui/sign_up_page/previous_page?previous_page=${previous_page}";
      }
    }
    request.open('GET',window.location.protocol+'//'+window.location.host+'/ui/sign_up_page/previous_page?previous_page=${previous_page}',true);
    request.send(null);
}


  `;
  return js_data;
}


//for log_out

function log_out_template_js(previous_page)
{
  if (previous_page==="default")
    previous_page="";
  js_data=`
    function log_out_OnClick()
    {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() 
        {
          if (request.readyState == 4 && request.status == 200) 
          {    
              window.location.href = window.location.protocol+"//"+window.location.host+"/ui/${previous_page}";
          }
        }
        request.open('DELETE',window.location.protocol+'//'+window.location.host+'/ui/log_out',true);
        request.send(null);
    }


  `;
  return js_data;
}

//section 
//end points for sign_up

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

//????
app.get('/ui/sign_up_page_js/previous_page',function(req,res)
{
  var previous_page=req.query.previous_page;
  res.send(sign_up_page_template_js(previous_page));
});

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

//template function's for sig_up page

function sign_up_page_template(previous_page)
{ 
    var category=previous_page.split('/')[1];
    if (category===undefined)
      category=previous_page.split('/')[0];
    
    if (category==="cafe_home_page")
      category="cafe_menu"

    else if (category==="all_categories")
      category="home_page"

    var html_data=article_layout_template(category,'not logged in',previous_page);

  html_data+=`
    <h1 class="text-center">
    Sign Up!
    <hr>
    </h1>
<div class='rows'>
  <div class='col-xs-1 col-md-3'>
  </div>
  <div class='col-xs-10 col-md-6'>    
    <input type='text' id ='sign_up_username_button' class ="form-control" placeholder="Enter Username" autofocus></input><br>
    <input type='password' id ='sign_up_password_button' class ="form-control"  placeholder="Enter Password"></input><br><br>
    <input type='submit' id ='sign_up_submit_button' class = 'btn btn-primary' value='Submit'></input>
  </div>
  </div>
  </body>
  <script type="text/javascript" src="/ui/sign_up_page_js/previous_page?previous_page=${previous_page} ">
  </script>
  </html>
  `;
  return html_data;
}

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
          window.location.href=window.location.protocol+'//'+window.location.host+'/ui/${previous_page}';
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
    { request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/sign_up',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/sign_up',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify({username:username,password:password}));
    }
  };
  `;
  return js_data;
}

//section 
//end points for article's 

//end point that returns all categories
app.get('/ui/get/:all_categories',function(req,res)
  {

    console.log("/ui/get/all_categories");
  var all_categories=req.params.all_categories;
   var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
   log_in_details=["logged in",req.session.auth.user_id.user_id];

    //returns all categories
    if (all_categories==='all_categories')
      all_categories='all_categories_ss';//calling from the server_side if default is used

    article_format(res,[all_categories],log_in_details);
    //categories for server-side,will send to all_categories_template

  });


//end point for submit page for submitting an article
app.get('/ui/a/:category/submit_page',function(req,res)
  {
    var category=req.params.category;
    if (req.session && req.session.auth && req.session.auth.user_id )
    {
      log_in_details=["logged in",req.session.auth.user_id.user_id];
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

//post requst to insert/update article,belonging to this category
app.post('/ui/a/:category/:action_on_article', function (req, res)
{ 
  //can only add article's if logged in!
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    var user_id=req.session.auth.user_id.user_id;
    var log_in_details=["logged in",user_id];
    var category=req.params.category;
    var action_on_article=req.params.action_on_article;
    var head=req.body.head;
    var body=req.body.body;
    if (head!=="" && body!=="")
    {
      var data=[action_on_article,user_id,category,head,body]
      if (action_on_article==='update article')
      {//need the comment_id to update the connets of the commment
        var article_id=req.body.article_id;
        data.push(article_id);
      }
      //inserts the article,then load's its page
      article_format(res,data,log_in_details);
    }
  }
});

//request to delete the body of the article
app.delete('/ui/a/delete_article/:category',function(req,res)
{
  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for not logged in user
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    log_in_details=["logged in",req.session.auth.user_id.user_id];
    var user_id=log_in_details[1];
    var article_id=req.body.article_id;
    article_format(res,['delete article',article_id,user_id],log_in_details);
  }
});

//returns article update and delete js
app.get('/ui/a/:category/:article_id/article_template_js',function(req,res)
{
  article_id=req.params.article_id;
  category=req.params.category;
  res.send(article_template_js(category,article_id));
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

//template function's for articles

function article_template_js(category,article_id)
{
  var js_data=escape_html_js.toString();
  update_text_block=`<textarea rows='4' cols='50' id ='PLACEHOLDER' class ='update_article_box' ></textarea><br><input type='submit' id ='PLACEHOLDER' class = 'btn btn-primary' value='update' onclick='PLACEHOLDER'></input>`;

  js_data+=`
    
    function delete_article(article_id)
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take comments from the request and parse them into array 
            var text=request.responseText;
            window.location.href=window.location.protocol+'//'+window.location.host+'/ui/a/${category}';
          }
        }

      };

      //making request
      //sending DELETE request
      request.open('DELETE',window.location.protocol+'//'+window.location.host+'/ui/a/delete_article/${category}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"article_id":article_id} ) );
    };

 function updating_article(article_id)
    { 
      update_article_text=document.getElementById('article_body_'+article_id);
      previous_text=update_article_text.innerHTML;
      
      update_text_block="${update_text_block}";
      
      update_text_block=update_text_block.replace('PLACEHOLDER','article_update_body_'+article_id );//id for text area of body
      update_text_block=update_text_block.replace('PLACEHOLDER','article_update_button_'+article_id );//id for submit_btn for updating article
      update_text_block=update_text_block.replace('PLACEHOLDER','update_article('+article_id +')' );//replcaing onclick='PLACEHOLDER'
      
      update_article_text.innerHTML=update_text_block;
      update_article_text=document.getElementById('article_update_body_'+article_id);//the textarea for updating article
      update_article_text.defaultValue=previous_text;

      //reseting the update_article_btn to close button and onclick to close_updating_btn      
      close_article_btn=document.getElementById('update_article_btn_id_'+article_id);
      close_article_btn.value='close';
      close_article_btn.onclick=function()
      {
        close_article_updating_btn(article_id,previous_text);
      }

    };

    function update_article(article_id)
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take articles from the request and parse them into array 
            var article=request.responseText;
            //updated the value of article
            old_article=document.getElementById('article_body_'+article_id);
            old_article.innerHTML=escape_html_js(article);

            //reseting the close_article_btn to update button and onclick to updating_article
            close_article_btn=document.getElementById('update_article_btn_id_'+article_id);
            close_article_btn.value='update';
            close_article_btn.onclick=function()
            {
              updating_article(article_id);
            }

          }
        }

      };

      //making request
      updated_article=document.getElementById('article_update_body_'+article_id ).value;
      request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/a/${category}/update article',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"body":updated_article,"article_id":article_id} ) );
    };

    function close_article_updating_btn(article_id,previous_text)
    { 
      update_article_text=document.getElementById('article_body_'+article_id);
      update_article_text.innerHTML=previous_text;

      //reseting the close_article_btn to update button and onclick to updating_article
      close_article_btn=document.getElementById('update_article_btn_id_'+article_id);
      close_article_btn.value='update';
      close_article_btn.onclick=function()
      {
        updating_article(article_id);
      }
    }
  `;

  return js_data;
};

function article_home_page_template(res,category,articles,log_in_details)
{

  //extracting log_in_details as ['logged in'/'not logged in' , user_id], note if not logged in user_id=-1
  var current_user_id=log_in_details[1];
  log_in_details=log_in_details[0];

  if(articles!=="no articles present")
    var article=JSON.parse(articles);
   
  var html_data=article_layout_template(category,log_in_details,'a/'+category);
  
    html_data+=`
  <div class="container-fluid ">
  `;

  if(log_in_details==="logged in")
  {
    html_data+=`<a href="/ui/a/${category}/submit_page">
    <button type="button" class="btn btn-link"><h3>Submit an Article!</h3></button>
    </a>`;
  }

  else
  {
    html_data+=`<a href="/ui/log_in_page/previous_page?previous_page=a/${category}/submit_page">
    <button type="button" class="btn btn-link"><h3>Submit an Article!</h3></button>
    </a>`;
  }

  html_data+=`
  <div id=main class="${category}_comment_list">
  <h2>Articles</h2>
      <div id="this_panel" class="panel-group" >`;

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
         <div class="panel panel-default">
            <a data-toggle="collapse" data-parent="#this_panel" href="#collapse`+i+`">
              <div class="panel-heading" style="background-color:#fff;">
                  <h3>${head}</h3>
              </div>
            </a>
            <div class="panel-body">
              <a href="/ui/a/${category}/${article_id}">
                <button class="btn btn-info">Read</button>
              </a>  
            </div>
            <div id="collapse`+i+`" class="panel-collapse collapse">
              <div class="panel-heading" >
                <a href="/ui/a/${category}/${article_id}" >
                  <footer>by ${username} at ${localtime} on ${date}</footer>
                </a>  
              </div>
            </div>
          </div>
      `;      
    }
  }
  else
  {
    html_data+=articles;
  }

    if(log_in_details==="logged in")
      html_data+=`
          <!-script for log_out ->
          <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=a/${category}">
          </script>`;

      html_data+=`
      </div>
    </div>
    <hr>
   
    </body>
  </html>
  `;

  return html_data;

};

function all_categories_template(all_categories,log_in_details)
{
  var current_user_id=log_in_details[1];
    log_in_details=log_in_details[0];

  var categories=JSON.parse(all_categories);

    var html_data=article_layout_template('home_page',log_in_details,'get/all_categories');

    html_data+="<div class='container-fluid' id=this_panel >";

    for(var i=0;i<=categories.length -1;i++)
     {
      category=categories[i].category;
          details=categories[i].details;
          html_data+=`
          <div class="panel panel-default">
            <a href="/ui/a/${category}/">
              <div class="panel-heading" style="background-color:#a8dba8;">
                  <h3>${category}</h3>
              </div>
            </a>
            <div class="panel-body" style="background-color:#cff09e;">
              <a data-toggle="collapse" data-parent="#this_panel" href="#collapse`+i+`">
                <button class="btn btn-info">Summary</button>
              </a>  
            </div>
            <div id="collapse`+i+`" class="panel-collapse collapse">
              <div class="panel-heading" style="background-color:#feee7d;">
                <a href="/ui/a/${category}/" >
                  <h3>
                  ${details}
                  </h3>
                </a>  
              </div>
            </div>
          </div>
          `;
     }
     html_data+=`
    </div>
          <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=get/all_categories">
          </script>
          </body>
          </html>
     `;
  return html_data;
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

    
    
      var html_data=article_layout_template(category,log_in_details,'a/'+category+'/'+article_id);//3rd arg is previous_page

       
      var time = new Date(time);

      html_data+=`    
        <div class="container-fluid">
            <!-- using escape_html_cs to prevent xss attack -->
            <h1>${escape_html_cs(head)}</h1>
            <blockquote>
              <p>
                <div id=article_body_${article_id}>
                    ${escape_html_cs(body)}
                </div>
              </p>    
                  <footer style="color:#fff;">
                    by ${username}
                    at ${time.toLocaleTimeString()}
                    on ${time.toLocaleDateString()}
                  </footer>
            </blockquote>
            `;

        
      if(current_user_id===user_id)
      {
        update_btn=update_block.replace('PLACEHOLDER','update_article_btn_id_'+article_id );
        update_btn=update_btn.replace('PLACEHOLDER','updating_article('+ article_id+');');//replaces; onclick='PLACEHOLDER'
        html_data+='<br>'+update_btn;

        delete_btn=delete_block.replace('PLACEHOLDER','delete_article_btn_id_'+ article_id);//replaces; id=PLACEHOLDER
        delete_btn=delete_btn.replace('PLACEHOLDER','delete_article('+ article_id+');');//replaces; onclick='PLACEHOLDER'
        html_data+=delete_btn;

      }

      if (log_in_details==="not logged in")
      {
          html_data+=`
          <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
          
            <div class=text-center style="color:#fff;"><h3>Not logged in!<h3></div>`;
              html_data+=log_in_block;
              html_data+=`
              <script type="text/javascript" src="/ui/log_in_page_js/previous_page?previous_page=a/${category}/${article_id} ">
              </script>
          </div>      
        `;
      }
      else
      {
        html_data+= `
        <div id="mySidenav" class="sidenav" style="color:#111;">
          <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
          <div class='rows'>
          <div class='col-xs-1 col-md-3'>
          </div>
            <div class='col-xs-10 col-md-6'>          
              <textarea rows="3" cols="30" id ='in_${category}_id_${article_id}' class ="form-control" placeholder="Submit a new comment!" ></textarea>
              <br>
              <input type='submit' id ='sub_${category}_id_${article_id}' class = 'btn btn-primary' value='Submit' onclick="closeNav();"></input><br>
            </div>          
          </div>
          `;
          html_data+=`
          <!-script for log_out ->
          <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=a/${category}/${article_id} ">
          </script>

          <!-js for inserting comments ->
          <script type="text/javascript" src="/ui/a/${category}/${article_id}/article_comment_js/">
          </script>
        </div>
        `;
      }

      html_data+=`
          <hr>
          <!-- creating seperate id's for each page by using the article_id from the js obj  -->
          <div id="main" class="${category}_comment_list"><!--will be displaced by the sidenav-->
              <h3 class=text-center>Comments</h3>
              <button class="hover_button" onclick="openNav()"><span>Submit comment!</span></button>
          <div class="list-group" id = 'ol_${category}_id_${article_id}' style="color:#111;">
        `;

        if(comments==='Be the first to comment!')
        {   
          html_data+="<h4>Be the fisrt to comment!</h4>";
        }
        else
        {
          comment=JSON.parse(comments);
          //creating a string to render in the inner html of ol on this article page
          for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
            {
              var time = new Date(comment[i].time);
              html_data+="<div class='list-group-item '><blockquote>"
              html_data+="<div id=comment_text_" + comment[i].comment_id + ">";
              //to prevent xss attack via sending html code through input
              html_data+=escape_html_cs(comment[i].text)+"</div><footer>By:";
              html_data+=escape_html_cs(comment[i].username);
              html_data+=" submitted at:"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString();

              if (comment[i].user_id===current_user_id)
              {
                update_btn=update_block.replace('PLACEHOLDER','update_btn_id_'+comment[i].comment_id );
                update_btn=update_btn.replace('PLACEHOLDER','updating_comment('+ comment[i].comment_id+');');//replaces; onclick='PLACEHOLDER'
                html_data+="<br>"+update_btn;

                delete_btn=delete_block.replace('PLACEHOLDER','delete_btn_id_'+ comment[i].comment_id);//replaces; id=PLACEHOLDER
                delete_btn=delete_btn.replace('PLACEHOLDER','delete_comment('+ comment[i].comment_id+');');//replaces; onclick='PLACEHOLDER'
                html_data+=delete_btn;

              }

              html_data+="</footer></blockquote></div>";
            };
        }

        html_data+="</div></div><hr>";

        if(current_user_id===user_id)
        {
          
          html_data+=`<!-js for inserting comments ->
          <script type="text/javascript" src="/ui/a/${category}/${article_id}/article_template_js/">
          </script>`;
        }

        html_data+=`
        <script type="text/javascript" src="/ui/main.js/">
          </script>
      </body>
    </html>`;

    return html_data;
}

//template function's for submit page

function submit_page_template(category)
{

    var html_data=article_layout_template(category,'logged in','a/'+category);

    if (category==='cafe_menu')
      html_data=cafe_layout;

  html_data+=`
    <div class="page_head">
    Submit An Article!
    <hr>
    </div>
  `;
  html_data+=`
<div class='rows'>
<div class='col-xs-1 col-md-3'>
</div>
  <div class='col-xs-10 col-md-6'>  
  <input type='text' id ='article_sumbit_head_button_${category}' class ="form-control" placeholder="Enter A Title" autofocus ></input><br>
  <textarea rows="4" cols="50" id ='article_sumbit_body_button_${category}' class ="form-control" placeholder="Enter Some Text" wrap="hard"></textarea><br>
  <input type='submit' id ='article_sumbit_button_${category}' class = "btn btn-primary" value='Submit Article!'></input><br><br><hr>
</div>
</div>
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
            //res=['',{article_id:value}]
            if (res[0]==="successfully created article")
            {
            window.location.href=window.location.protocol+'//'+window.location.host+'/ui/a/${category}/'+res[1].article_id;
            }
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

      request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/a/${category}/insert an article',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"body":body,"head":head} ) );
    };

    `

  return js_data;
}


//function to handle all query's to the database from the above end points 

function article_format(res,data,log_in_details)
{
  //data will be of foramt ['type of query',,]
  //type's of query to handle
  //select all categories for article,from categories table
  //select all articles belonging to given category
  //insert an article belonging to given category 
  //select an article belonging to given category ['select an article',aritcle_id,category]
  //etc

  if (data[0]==="delete article")
  {//data=['remove article',article_id,user_id]
    pool.query("DELETE FROM article_table WHERE article_id=$1 AND user_id=$2",[data[1],data[2]],function(err,result)//data[1]=article_id
    {
      if (err)
      { 
        res.status(500).send(err.toString());
      }
      else
      {
        res.send("successfully deleted");
      }
    });
  }

  else if (data[0]==="all_categories_cs" || data[0]==="all_categories_ss")
  {
    pool.query("SELECT * FROM categories WHERE category != 'cafe_menu' ORDER BY categories",function(err,result)
    {
      if (err)
      { 
        res.status(500).send(err.toString());
      }
      else
      {
        if (data[0]==='all_categories_cs')
          res.send(JSON.stringify([result.rows,log_in_details]));
        else
          res.send(all_categories_template(JSON.stringify(result.rows),log_in_details))
      }
    });
  }
  else if (data[0]==="select all")
  {     
      //selecting all article's from article_table belonging to the given category
      //data=['select all',category]
      var category=data[1];
      pool.query('SELECT a.head,a.article_id,u.username,u.user_id,a.time FROM article_table as a LEFT JOIN user_table as u ON u.user_id=a.user_id WHERE a.category=$1 ORDER BY a.article_id  DESC',[category],function(err,result)
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
  else if (data[0]==="update article")
  {
    //insert into article_table and then select this article by referencing the last article_id
    //data=['insert',user_id,category,head,body,article_id]
    var user_id=data[1];
    var category=data[2];
    var head=data[3];
    var body=data[4];
    var article_id=data[5];
    
    pool.query('UPDATE article_table SET body=$2 WHERE article_id=$3 AND user_id=$1',[user_id,body,article_id],function(err,result)
      { 
       if (err)
        {
          res.status(500).send(err.toString());
        }
        else
        { //selecting the last article inserted by this user in this category,aka the current article just inserted
          res.send(body);
        }
      });
  }
  else if (data[0]==="select last")
  {
    //selecting the last article inserted by this user in this category,aka the current article just inserted
    //data=['select last',user_id,category]
    var user_id=data[1];
    var category=data[2];

    pool.query('SELECT article_id FROM article_table WHERE user_id=$1 AND category=$2 ORDER BY article_id',[user_id,category],function(err,result)
    {
     if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      { //send the article_id of the last article created by this user,belonging to this category
        res.send( ["successfully created article",result.rows[result.rows.length-1] ] );
      }
    });
  }
  else if (data[0]==="cafe_home_page")
  {
    //data=['cafe home page',log_in_details]
    console.log("indside cafe_home_page,pre result");
    pool.query('SELECT c.item_id,a.head,c.price,c.summary FROM cafe_menu as c LEFT JOIN article_table as a ON c.item_id=a.article_id ORDER BY c.item_id',function(err,result)
    {
     if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      { 
        console.log("indside cafe_home_page,result",result);
        res.send(cafe_home_page_template(JSON.stringify(result.rows),log_in_details));
      }
    });
  }
};

//section 
//end points for comments

//post requst to insert/update comment
app.post('/ui/a/:category/:article_id/:action_on_commnet', function (req, res)
{ //body has comment and may have comment_id for updation of comment
  //can only add comments if logged in!
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
    log_in_details=["logged in",req.session.auth.user_id.user_id];

    //url type: ui/3/comment?comment=... here id = 3
    var article_id=req.params.article_id;
    var article_id=parseInt(article_id,10);//convertin id containg string type  value to int type decimal value
    var action=req.params.action_on_commnet;

    var comment=req.body.comment;
    if (comment!=="")
      { 
        var data=[action,comment]
        if (action==='update comment')
        {//need the comment_id to update the connets of the commment
          var comment_id=req.body.comment_id;
          data.push(comment_id);
        }
        comment_format(res,data,article_id,log_in_details);
      }
  }
});

//to delete a comment,referenced by it's comment_id, is verified by user_id of current_user_id
app.delete('/ui/a/delete_comment/:category',function(req,res)
{
  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for not logged in user
  if (req.session && req.session.auth && req.session.auth.user_id )
   {
    log_in_details=["logged in",req.session.auth.user_id.user_id];
    var user_id=log_in_details[1];
    var comment_id=req.body.comment_id;
    comment_format(res,['delete comment',user_id,comment_id],log_in_details);
  }
});

//template functions for comment

function comment_template(category,id)//returns a js code unique for each page
{   
   var js_data=escape_html_js.toString();
   //this function is used to prevent xss attack

   js_data+=`
    //get the submit element on this page by referencing it with given article_id

    var delete_block="${delete_block}";
    var update_block="${update_block}";
   
    submit_btn=document.getElementById('sub_${category}_id_${id}');

    submit_btn.onclick=function ()
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
            closeNav();
            //take comments from the request and parse them into array 
            var comment=request.responseText;
            comment=JSON.parse(comment);
            var time = new Date(comment.time);
            var old_list=document.getElementById('ol_${category}_id_${id}');
            
            if (old_list.innerHTML.trim()==='Be the first to comment!' )
              old_list.innerHTML="";

            var new_comment="<div class='list-group-item '><blockquote><div id=comment_text_"+comment.comment_id+">"+escape_html_js(comment.text)+"</div><footer>By:"+escape_html_js(comment.username)+" submitted at:"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"<br>";

            update_btn=update_block.replace('PLACEHOLDER','update_btn_id_'+comment.comment_id );//replace's id=PLACEHOLDER
            update_btn=update_btn.replace('PLACEHOLDER','updating_comment('+ comment.comment_id+');');//replaces onclick='PLACEHOLDER'

            new_comment+=update_btn;

            delete_btn=delete_block.replace('PLACEHOLDER','delete_btn_id_'+comment.comment_id );//replace's id=PLACEHOLDER
            delete_btn=delete_btn.replace('PLACEHOLDER','delete_comment('+ comment.comment_id+');');//replaces onclick='PLACEHOLDER'

            new_comment+=delete_btn;

            new_comment+="</div></footer></blockquote>";
            old_list.innerHTML=new_comment+old_list.innerHTML;

            submit_btn.value='Submit';
          }
        }

      };

      //making request
      input=document.getElementById('in_${category}_id_${id}');
      data=input.value;
      //sending request to page with id=current_id
      request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/a/${category}/${id}/insert comment',true);
      //request.open('POST','http://ceidloc.imad.hasura-app.io/ui/a/${category}/${id}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {comment:data} ) );
    };

    `

  return js_data;
    
}


function comment_template_delete_update_js(category,article_id)
{
  update_text_block=`<textarea rows='4' cols='50' id ='PLACEHOLDER' class ='update_comment_box' ></textarea><br><input type='submit' id ='PLACEHOLDER' class = 'btn btn-primary' value='update' onclick='PLACEHOLDER'></input>`;

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
              old_comment=document.getElementById('comment_text_'+comment_id);
              old_comment.innerHTML=comment;
            }
          }
        }

      };

      //making request
      //sending DELETE request
      request.open('DELETE',window.location.protocol+'//'+window.location.host+'/ui/a/delete_comment/${category}',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"comment_id":comment_id} ) );
    };

    function updating_comment(comment_id)
    { 
      update_comment_text=document.getElementById('comment_text_'+comment_id);
      previous_comment_text=update_comment_text.innerHTML;
      
      update_text_block="${update_text_block}";
      
      update_text_block=update_text_block.replace('PLACEHOLDER','comment_update_body_'+comment_id );//id for text area of body
      update_text_block=update_text_block.replace('PLACEHOLDER','comment_update_button_'+comment_id );//id for submit_btn for updating comment
      update_text_block=update_text_block.replace('PLACEHOLDER','update_comment('+comment_id +')' );//replcaing onclick='PLACEHOLDER'
      
      update_comment_text.innerHTML=update_text_block;
      update_comment_text=document.getElementById('comment_update_body_'+comment_id);//the textarea for updating comment
      update_comment_text.defaultValue=previous_comment_text;

      //reseting the update_btn to close button and onclick to close_updating_btn      
      close_btn=document.getElementById('update_btn_id_'+comment_id);
      close_btn.value='close';
      close_btn.onclick=function()
      {
        close_updating_btn(comment_id,previous_comment_text);
      }

    };

    function update_comment(comment_id)
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {//take comments from the request and parse them into array 
            var comment=request.responseText;
            //updated the value of comment
            old_comment=document.getElementById('comment_text_'+comment_id);
            old_comment.innerHTML=escape_html_js(comment);

            //reseting the close_btn to update button and onclick to updating_comment
            close_btn=document.getElementById('update_btn_id_'+comment_id);
            close_btn.value='update';
            close_btn.onclick=function()
            {
              updating_comment(comment_id);
            }

          }
        }

      };

      //making request
      updated_comment=document.getElementById('comment_update_body_'+comment_id.toString() ).value;
      request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/a/${category}/${article_id}/update comment',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"comment":updated_comment,"comment_id":comment_id} ) );
    };

    function close_updating_btn(comment_id,previous_text)
    { 
      update_comment_text=document.getElementById('comment_text_'+comment_id);
      update_comment_text.innerHTML=previous_text;

      //reseting the close_btn to update button and onclick to updating_comment
      close_btn=document.getElementById('update_btn_id_'+comment_id);
      close_btn.value='update';
      close_btn.onclick=function()
      {
        updating_comment(comment_id);
      }
    }
  `;
  return js_data;
}

//function to handle all comment queries to database,requsted by the above end points

function comment_format(res,data,article_id,log_in_details)
{ 
  //data is an array with format ['type of query',comments/JSON.stringify(article data)]

  if (data[0]==='delete comment')//removes the comment by updating its text as 'removed by user!'
    //data=['delete comment',user_id,comment_id]
  { 
    //data[1]=user_id,data[2]=comment_id
    pool.query("UPDATE comments SET text='removed by user!' WHERE user_id=$1 AND comment_id=$2 ",[data[1],data[2]],function(err,result)
      {
        if (err)
        { 
          res.status(500).send(err.toString());
        }
          res.send("removed by user!");
      } );
  }
  else
  if (data[0]==='insert comment')
    //data=['insert comments',comment]
  { 
    pool.query('INSERT into comments(text,article_id,user_id) values($1,$2,$3)',[data[1],article_id,log_in_details[1]],function(err,result)//data[1]=comment
      {
        if (err)
        { 
          res.status(500).send(err.toString());
        }
          comment_format(res,["new comment"],article_id,log_in_details);
      } );
  }
  else
  if (data[0]==='update comment')
    //data=['update comments',comment,comment_id]
  { 
    pool.query('UPDATE comments SET text=$1 WHERE comment_id=$2 AND user_id=$3',[data[1],data[2],log_in_details[1]],function(err,result)//data[1]=comment
      {
        if (err)
        { 
          res.status(500).send(err.toString());
        }
        else
        {
          res.send(data[1]);
        }
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

//section 
//end points for milkyway cafe home page

app.get('/ui/cafe_home_page',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  var log_in_details=["not logged in",-1];//2nd element is user_id,-1 for no user
  if (req.session && req.session.auth && req.session.auth.user_id )
    log_in_details=["logged in",req.session.auth.user_id.user_id];

   article_format(res,['cafe_home_page'],log_in_details);
});

app.get('/ui/cafe_home_page.js',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.send(cafe_home_page_template_js(11));
});

//template function's for cafe home page

function cafe_home_page_template(menu,log_in_details)
{

  //extracting log_in_details as ['logged in'/'not logged in' , user_id], note if not logged in user_id=-1
  var current_user_id=log_in_details[1];
  log_in_details=log_in_details[0];

  var menu=JSON.parse(menu);//contians id,head,price and summary of items

  html_data=article_layout_template("cafe_menu",log_in_details,"cafe_home_page");
  
  html_data+=`
  </div>
        <body style="background-color:#F6B352;">
          <h1 class=" text-center">MENU</h1>
        <hr>
        <h2><a href="/ui/order/cafe_menu/order_page">Build an Order!</a></h2>
        <div class=row>
        `
        for(var j=1;j<=2;j++)
        {
          html_data+=`
          <div class="col-xs-6 c"> 
            <div class="list-group">
              `;
            var k=parseInt(((menu.length)/2)*(j-1),10);//will have value=0 or lenght/2
            console.log("value of k",k);

            for(var i=k;i<=j*(menu.length-1)/2;i++)
              {
                html_data+=`
                <div class="list-group-item" style="background-color:#FDD692;">
                     <div class="panel-group" >
                      <div class="panel panel-default">
                         <a data-toggle="collapse" href="#collapse`+i+`"> 
                           <div class="panel-heading" style="background-color:#FBFFB9;">
                              <h3 style="color:#111;">       `
                              +menu[i].head+`
                              </h3>   
                            </div>
                          </a>
                        <div id="collapse`+i+`" class="panel-collapse collapse">
                          <ul class="list-group">
                            <!-- will add summary later -->
                            <a href="/ui/a/cafe_menu/`+menu[i].item_id+`">
                              <li class="list-group-item"><h3>View Details</h3></li>
                            </a>
                            <li class="list-group-item"><h4>Price:`+menu[i].price+`</h4></li>
                            <li class="list-group-item">
                              <img src="/ui/images/`+i+`.png" class="img-responsive">
                                <!-- alt="Chania" width="460" height="345" -->
                              </img>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                </div>

                `;
              
              }

              html_data+=`            
            </div>
          </div>
          `;
        }

        html_data+=`
        </div><!-- end of rows -->
       </div>   `;
  

       html_data+=`   
        <script type="text/javascript" src="/ui/cafe_home_page.js">
        </script>
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

//section 
//end points for order page

app.get('/ui/order/cafe_menu/order_page/', function (req, res) 
{
  if (req.session && req.session.auth && req.session.auth.user_id )
   {
     cart_id=req.session.auth.user_id.user_id;//change to auth.cart_id;
     //loading a cart,note can be both new cart or pre-existing
     //if new cart is to be made the user_id is used as cart_id,foreign key constraint
     cart_bill_format(res,cart_id,JSON.stringify(["load cart"]) );
   }
   else
   {
    //redirecting to login page,using the log_in_page_tempate
    //after login redirects to order_page,aka the current end point 
    previous_page="order/cafe_menu/order_page";
    res.send(log_in_page_template(previous_page));
   }
  
});

app.get('/ui/order/cafe_menu/order_page_js/:cart_id', function (req, res) {
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  res.send(order_template_js(cart_id));
  
});

//inserts/update's quantity and price of items in cart
app.post('/ui/order/cafe_menu/order_page/update_order', function (req, res) {
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
  var cart_id=req.body.cart_id;
  var item_id=req.body.item_id;
  var update_by=req.body.update_by;
  if(cart_id===req.session.auth.user_id.user_id)
  {
    var data=JSON.stringify(["get quantity",cart_id,item_id,update_by]);
    cart_bill_format(res,cart_id,data);
  }
  }
});

//inserts/update's quantity and price of items in cart
app.delete('/ui/order/cafe_menu/order_page/delete_order', function (req, res) {
  if (req.session && req.session.auth && req.session.auth.user_id )
  {
  var cart_id=req.body.cart_id;
  var item_id=req.body.item_id;
    if(cart_id===req.session.auth.user_id.user_id)
    {
      var data=JSON.stringify(["clear cart",cart_id,item_id]);
      cart_bill_format(res,cart_id,data);
    }
  }
});

//template functions for order page

function order_template(cafe_menu,cart,cart_id)
{ 
  cafe_menu=JSON.parse(cafe_menu);
  cart=JSON.parse(cart);
  var html_data=article_layout_template('cafe_menu','logged in','order/cafe_menu/order_page');
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
      <input type='submit' id='place_this_item_id_${item_id}' class = "btn btn-primary" value='Add in cart' onclick='update_quantity(${item_id},1);' > </input>
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
            { 
              //inserting head,stored in menu_iems, of item in cart,referenced by using its item_id 
              html_data+="<li><div id=cart_item_id_head_"+cart[i].item_id+">"+cafe_menu[cart[i].item_id].head+"</div>"
              +"<ul>"
              +"<li style='display: inline-block;'><div id=cart_item_id_quantitiy_"+cart[i].item_id+">Qty:"+cart[i].quantity+"</div>"
              +"<input type=submit class='btn btn-info' id=increase_quantity_"+cart[i].item_id+" value='+' onclick='update_quantity("+cart[i].item_id+",1);'> </input>"
              +"<input type=submit class='btn btn-warning' id=decrease_quantity_"+cart[i].item_id+" value='-' onclick='update_quantity("+cart[i].item_id+",-1);'></input>"
              +"</li>"
              +"<li id=cart_item_id_price_"+cart[i].item_id+">price:"
              //converting price string($3.22)'s substring into int 
              +cart[i].price.substr(0,1)
              +(cart[i].quantity * parseFloat(cart[i].price.substr(1,4),10) ).toFixed(3).toString()
              +"</li></ul></li>";
            };
        }

    html_data+="</ul><br><input type=submit class='btn btn-warning' id=clear_cart_id_("+cart_id+") value='Clear Cart' onclick='clear_cart("+cart_id+");' "
    html_data+=`</div>
    <script type="text/javascript" src="/ui/order/cafe_menu/order_page_js/${cart_id}">
    </script>
    <script type="text/javascript" src="/ui/log_out_js/previous_page?previous_page=order/cafe_menu/order_page">
    </script>
    </body>
    </html>
    `;

  return html_data;
}

function order_template_js(cart_id)
{     
  var js_data=`    
      function update_quantity(item_id,update_by)//update_by=1 or -1
      {
        var request=new XMLHttpRequest();
        request.onreadystatechange= function()
        {
          if (request.readyState===XMLHttpRequest.DONE)
          {
            if (request.status === 200)
            {
              var response=request.responseText;
              var new_order="";
              //creating a string to render in the inner html of ol on this article page
              //extracting head ,for this item in cart, from the html doc for this end point,referenced by item_id of item inserted/updated in current cart.
              var head=document.getElementById('head_for_item_id_'+item_id).innerHTML;
              //extracting price of one quantity of the item
              price=document.getElementById('price_item_id_'+item_id).innerHTML.split('$')[1];

              if(response==="inserted successfully")
              {
                new_cart="<li><div id=cart_item_id_head_"+item_id+">"+head+"</div>"
                +"<ul>"
                +"<li><div id=cart_item_id_quantitiy_"+item_id+">Qty:"+1+"</div>"
                +"<input type=submit class='btn btn-info' id=increase_quantity_"+item_id+" value='+' onclick='update_quantity("+item_id+",1);'></input>"
                +"<input type=submit class='btn btn-warning' id=decrease_quantity_"+item_id+" value='-' onclick='update_quantity("+item_id+",-1);'></input>"
                +"</li>";

                price="<li id=cart_item_id_price_"+item_id+">price:$"+parseFloat(price,10).toFixed(3).toString();
                new_cart+=price+"</li></ul></li>";

                old_cart=document.getElementById('cart');
                if (old_cart.innerHTML==="Empty Cart")
                  old_cart.innerHTML="";

                old_cart.innerHTML=new_cart+old_cart.innerHTML;
              }

              else if(response==="updated successfully")
              {
                document.getElementById('cart_item_id_head_'+item_id).innerHTML=head;
                
                old_quantity=document.getElementById('cart_item_id_quantitiy_'+item_id);
                old_quantity.innerHTML="Qty:"+(parseInt(old_quantity.innerHTML.split(':')[1],10)+parseInt(update_by,10)).toString();

                //extracting total price of the item in the cart
                old_total_price=document.getElementById('cart_item_id_price_'+item_id).innerHTML.split('$')[1];

                new_price="<li id=cart_item_id_price_"+item_id+">price:$"
                +( ( parseFloat(price,10)*parseInt(update_by,10) )+parseFloat(old_total_price,10) ).toFixed(3).toString();
                //eg (3.220*-1)+32.200

                document.getElementById('cart_item_id_price_'+item_id).innerHTML=new_price;
              }

            }
          }
        };

        //making request
        request.open('POST',window.location.protocol+'//'+window.location.host+'/ui/order/cafe_menu/order_page/update_order',true);
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify({"cart_id":${cart_id},"item_id":item_id,"update_by":update_by}));
      };

    function clear_cart(cart_id)
    {
      var request=new XMLHttpRequest();
      request.onreadystatechange= function()
      {
        if (request.readyState===XMLHttpRequest.DONE)
        {
          if (request.status === 200)
          {
           document.getElementById('cart').innerHTML="Empty Cart";
          }
        }

      };

      //making request
      //sending DELETE request
      request.open('DELETE',window.location.protocol+'//'+window.location.host+'/ui/order/cafe_menu/order_page/delete_order',true);
      request.setRequestHeader('Content-Type','application/json');
      request.send(JSON.stringify ( {"cart_id":cart_id} ) );
    };


      `;

  return js_data;
}

//function to handle all queries from order page to database 

function cart_bill_format(res,cart_id,data)
{
  data=JSON.parse(data);
  //data is an array with format ['type of query',]
//type's of query's to handle : data value
//from interleaf 1.insert->create new: new cart;2.select->give list of carts:give cart list,3. on click on cart_id from list,link to order_page with clicked cart_id
//from server_template's on load select->load cart with given cart_id:load cart
//from client_side_template on click add, 1.insert->the item in cart given cart_id item_id : " ['insert item',item_id] "
//                                     or 2.update->update cart given cart_id,item_id : update cart
//                                    and 3.recycle server_template's select query for client side templating with modified data:c-side load cart

  if(data[0]==="get quantity")
  {
    //data=["get quantity",cart_id,item_id,update_by]
    var item_id=data[2];
    pool.query("SELECT quantity FROM cart WHERE cart_id=$1 AND item_id=$2 ",[cart_id,item_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      //first insertion of this item in this cart || or if the qunatity is reduced to zero
      //if quantity is 
      else if (result.rows.length===0 )
      { 
       cart_bill_format(res,cart_id,JSON.stringify(["insert new item",item_id]));
      }
      else
      {
        if (result.rows[0].quantity===0 && data[3]===-1)//data[3]=update_by
        {
          //quantity cannot be lower than 0
          res.send("unsuccessfull updation");
        }
      else
        cart_bill_format(res,cart_id,JSON.stringify(["update item",item_id,result.rows[0].quantity,data[3] ]) );//data[3]=update_by
      }
    });
  }
  
  else if (data[0]==="update item")
  {
    //data=['',item_id,quantity,update_by]
    pool.query("UPDATE cart SET quantity=$3 WHERE cart_id=$1 AND item_id=$2",[cart_id,data[1],data[2]+data[3]],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      {
        res.send("updated successfully");
      }

    });

  }
  else if (data[0]==="insert new item")
  {
    //add new item,corresponding to given item_id,to the cart,corresponding to given cart_id, and set quantity to 1
    //data=['',item_id]
    pool.query("INSERT INTO cart(cart_id,item_id,quantity) values ($1,$2,$3) ",[cart_id,data[1],1],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      { 
       res.send("inserted successfully");
      }

    });

  }

  else if (data[0]==="clear cart")
  {
    //data=['clear cart',cart_id]
    pool.query("DELETE FROM cart WHERE cart_id=$1",[data[1]],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
      {
        res.send("cart cleared successfully");
      }

    });

  }

  //
  else 
  {
    //select's data for cart AND data for all menu items

    //selecting all the items from menu,which exits in cart,corresponding to given cart_id,along with its quantity from cart
    pool.query("SELECT m.item_id,m.price,c.quantity FROM cart AS c LEFT JOIN cafe_menu AS m ON c.item_id=m.item_id WHERE c.cart_id=$1 ORDER BY c.quantity DESC",
      [cart_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else
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
             res.send(order_template( JSON.stringify(cafe_menu.rows) , JSON.stringify(result.rows) ,cart_id ) );
            }
            else
            {
             res.send(order_template( JSON.stringify(cafe_menu.rows),JSON.stringify("empty cart") ,cart_id ) );
            }

          });

        }
    });
  }

};

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  //console.log(`IMAD course app listening on port ${port}!`);
});