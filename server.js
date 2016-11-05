var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool =require('pg').Pool;
var app = express();
app.use(morgan('combined'));

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



//var bill={};
//populating the bill

  //for (var i=0;i<=11;i++)
  //{
   // bill[i]=[menu_item[i].head,0,0];
    //          bill[i][0]=menu_item[i].head;
  //};

app.get('/ui/get_bill_details_for_item_id/:cart_id/:item_id', function (req, res)// replace /1/: by /:cart_id
{

  var item_id=req.params.item_id;
  item_id=parseInt(item_id,10);//convertin id containg string type  value to int type decimal value
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  //var cart_id=parseInt(id,10);//convertin id containg string type  value to int type decimal value
  
  pool.query("SELECT quantity FROM cart WHERE cart_id=$1 AND item_id=$2 ",[cart_id,item_id],function(err,result)
  {
    if (err)
    {
      res.status(500).send(err.toString());
    }
    else if (result.rows.length===0)//first insertion of this item in this cart 
    { 
      //if (result.rows.length===0)
      //res.send(order_template(result.rows) );
      //else

      console.log("inside cs js insert cart result:",result);
     cart_bill_format(res,cart_id,JSON.stringify(["insert item",item_id]));
    }
    else
    {
      console.log("inside cs js update cart result:",result);
      console.log("inside cs js update cart quantity:",result.rows[0].quantity);
      cart_bill_format(res,cart_id,JSON.stringify(["update item",item_id,result.rows[0].quantity]));
    }

  });
          
 
});

app.get('/ui/place_order/', function (req, res) {// add /:cart_id
  //sending the order as menu list with quantity html doc generated by this template
  //res.send(order_template(menu_item));
  cart_id=1;//req.params.cart_id;//new cart or load cart

  cart_bill_format(res,cart_id,"load cart");
});


app.get('/ui/order_page_js/:cart_id', function (req, res) {
  var cart_id=req.params.cart_id;
  cart_id=parseInt(cart_id,10);
  //sending the order as menu list with quantity html doc generated by this template
  res.send(order_template_js(cart_id));
  
});

var cart_counter=0;
function cart_bill_format(res,cart_id,data)
{
   console.log("\n\n\n BrokeBack") 
//type's of query's to handle : data value
//from interleaf 1.insert->create new: new cart;2.select->give list of carts:give cart list,3. on click on cart_id from list,link to order_page with clicked cart_id
//from server_template's on load select->load cart with given cart_id:load cart
//from client_side_template on click add, 1.insert->the item in cart given cart_id item_id : " ['insert item',item_id] "
//                                     or 2.update->update cart given cart_id,item_id : update cart
//                                    and 3.recycle server_template's select query for client side templating with modified data:c-side load cart



// WRITE app.get for new cart using cart counter
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
    pool.query("SELECT m.item_id,m.head,m.price,c.quantity FROM cart as c LEFT JOIN menu_items as m  ON c.item_id=m.item_id WHERE c.cart_id=$1 ORDER BY m.item_id",
      [cart_id],function(err,result)
    {
      if (err)
      {
        res.status(500).send(err.toString());
      }
      else if (data==="load cart")
      { 
        //if (result.rows.length===0)
        //res.send(order_template(result.rows) );
        //else
         pool.query("SELECT item_id,head,price FROM menu_items ORDER BY item_id",function(err,menu_items)
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
             res.send(order_template( JSON.stringify(menu_items.rows),JSON.stringify("empty cart") ,cart_id) );
            }

          });

        }
        else if (data==="cs-load cart")
        { 
          console.log("inside c_b_f cs-load cart result:",result);
          res.send(JSON.stringify(result.rows));
        }

    });
  }

};


//storing comments in a 2-d array as [page][comments]
//var list=[[],[],[],[],[],[],[],[],[],[],[],[]];

app.get('/ui/menu_item/:item_id/comment', function (req, res)
{
  //url type: ui/3/comment?comment=... here id = 3
  var item_id=req.params.item_id;
  var item_id=parseInt(item_id,10);//convertin id containg string type  value to int type decimal value
  var comment=req.query.comment;
  if (comment!=="")
    {
      //list[id_no].push(comment);
      comment_format(res,JSON.stringify(['insert comment',comment]),item_id);

    }
  //returning only the row containing the comments from current page as JSON string represntation of that row,stored in a 2-D array
  //res.send(JSON.stringify(list[id_no])); 
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/menu_item/:id', function (req, res) {
  var id=req.params.id;
  var item_id=parseInt(id,10);//convertin id containg string type  value to int type decimal value

  pool.query('SELECT * FROM menu_items WHERE item_id=$1',[item_id],function(err,result)//* = item_id,title,body,head
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

        //res.send(menu_item_template(result.rows[0],comment_format(item_id) ));  
        comment_format(res,JSON.stringify( result.rows[0] ),item_id);  

        //res.send(menu_item_template(result.rows[0]));
        //res.send(result.rows)
      }
    });

  //res.send(menu_item_template(menu_item[no]));//using menu_item_template to create many html pages using jsobject
});


function comment_format(res,data,item_id)
{ 
  
  if (data.substr(2,14)==="insert comment")
    //data=['insert comments',comment]
  { 
    console.log("inside comment_format IF,data:",data);
    console.log("\n inside comment_format IF,data.parsed[1]:",JSON.parse(data)[1]);
    pool.query('INSERT into comments(text,item_id) values($1,$2)',[JSON.parse(data)[1],item_id],function(err,result)//data[1]=comment
      {
        if (err)
        {
          res.status(500).send(err.toString());
        }
          //res.send(comment);
          comment_format(res,"new comment",item_id);
      } );
  }
  else
  {
    pool.query('SELECT text from comments WHERE item_id=$1 ORDER BY comment_id',[item_id],function(err,comments)
        {
          if (err)
          { 
           res.status(500).send(err.toString());
          }
          if (data==="new comment")
          { 
            console.log("in select comments",comments);
            res.send(  comments.rows[comments.rows.length-1].text ) ;
          }
          else
          { 
            console.log("in select comments data != new comments \n BrokeBack ...");
            //two parametrs ,one is a json object and the other is an array of comments,are sent to the template
            //return(JSON.stringify( comments.rows ) );
            //###########################################################################################################################################################################################################
            if (comments.rows.length!==0)
            {
              res.send(menu_item_template(JSON.parse(data),JSON.stringify ( comments.rows ) ) );
            }
            else
            {
               res.send(menu_item_template(JSON.parse(data),'Be the first to comment!' ) );
            }
          }
        } );
    }
};

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
  res.sendFile(path.join(__dirname, 'ui', 'images',image_no+'.png'));
});


app.get('/ui/index.js',function(req, res){
  //res.sendFile(path.join(__dirname,'ui','main.js'));
  res.send(index_template());
});




function index_template() // returns js for index page 
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
            //var comment=JSON.parse(request.responseText);
            var comment=request.responseText;
            //var new_list="";
            //creating a string to render in the inner html of ol on this article page
            //for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
              //{
                //new_list+="<li>"+comment[i].text+"</li>";
              //};
            var old_list=document.getElementById('ol_id_${id}');
            //if (new_list!=="")
            //{
            //old_list.innerHTML=new_list;
           // if (old_list.innerHTML== 'Be the first to comment!')
        //{old_list.innerHTML='<li>'+comment+'</li>';}
            //else
              //{
                old_list.innerHTML='<li>'+comment+'</li>'+old_list.innerHTML;
              //}
            //}
          }
        }

      };

      //making request
      input=document.getElementById('in_id_${id}');
      data=input.value;
      //sending request to page with id=current_id
      request.open('GET','http://localhost:8080/ui/menu_item/${id}/comment?comment='+data,true);
      //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/menu_item/${id}/comment?comment='+data,true);
      request.send(null);
    };

    `

  return js_data;
    
}



function menu_item_template(data,comments)//returns html doc
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
        <div class="header">SleepyHead Cafe
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
        <!-creating seperate id's for each page by using the item_id from the js obj->
        <ol id = 'ol_id_${item_id}' class="comment_list">
        `;

        if(comments==='Be the first to comment!')
        {   
          html_data+=comments;
        }
        else
        {
          comments=JSON.parse(comments);
          //creating a string to render in the inner html of ol on this article page
          for (var i=comments.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
            {
              html_data+="<li>"+comments[i].text+"</li>";
            };
        }
        
          
        html_data+= `
        </ol>
        <input type='text' id ='in_id_${item_id}' class ="input_box" placeholder="Submit a new comment!"></input>
        <br>
        <input type='submit' id ='sub_id_${item_id}' class = "submit_btn" value='Submit'></input>
        <script type="text/javascript" src="/ui/menu_comment/${item_id}">
        </script>
      </body>
    </html>`;

    return html_data;
}


function order_template(menu_items,cart,cart_id)
{ 
  menu_items=JSON.parse(menu_items);
  cart=JSON.parse(cart);
  html_data=`
    <html>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <title>Place your order
    </title>
      <body>
        <div class="header">SleepyHead Cafe
        </div>
        <hr>
        <div class="menu_head">
        Place your order
        </div>
        <hr>
        <ol id = 'menu_page_item_list'>
  `
  for (var i=0;i<=11;i++)
    {
      //extracting the item_id and head of each item present in the menu_list
      var item_id=menu_items[i].item_id;
      var head=menu_items[i].head;
      var price=menu_items[i].price;
      html_data+=`<li>
      ${head}
      <div id='quantity_item_id_${item_id}'></div>
      <div id='price_item_id_${item_id}'>${price}</div>
      <input type='submit' id='place_this_item_id_${item_id}' class = "place_order_submit_btn" value='Add in cart'> </input>
      </li>
      `
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
              html_data+="<li>"+cart[i].head +" Qty:"+cart[i].quantity +" prices:"
              + (cart[i].quantity * cart[i].price ).toString() +"</li>";
            };

        }

    html_data+=`</ul>
    <script type="text/javascript" src="/ui/order_page_js/${cart_id}">
    </script>
    </body>
    </html>
    `

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
              {
                new_order+="<li>"+new_cart[i].head +" Qty:"+new_cart[i].quantity +" prices:"
              + (new_cart[i].quantity * new_cart[i].price ).toString() +"</li>";
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
        request.open('GET','http://localhost:8080/ui/get_bill_details_for_item_id/${cart_id}/-1',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/-1',true);
        else 
        request.open('GET','http://localhost:8080/ui/get_bill_details_for_item_id/${cart_id}/${i}',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${cart_id}/${i}',true);
        request.send(null);
      };`
    }//else end
  }
  


  return js_data;
}

  

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});