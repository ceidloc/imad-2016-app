var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool =require('pg').Pool;
var app = express();
app.use(morgan('combined'));

config=
{
  user:'ceidloc',
  database:'ceidloc',
  host:'db.imad.hasura-app.io',
  port:'5432',
  password:process.env.DB_PASSWORD
};

pool =new Pool(config);

var menu_item=
{
      '0':
    {
      title:'Menu',
      head:'Espresso',
      body:
        ` 
          Espresso is coffee brewed by forcing a small amount of nearly boiling water under pressure through finely ground coffee beans. 
Espresso is generally thicker than coffee brewed by other methods, has a higher concentration of suspended and dissolved solids, and has crema on top (a foam with a creamy consistency).As a result of the pressurized brewing process, the flavors and chemicals in a typical cup of espresso are very concentrated. 

Espresso is also the base for other drinks such as a caffÃ¨ latte, cappuccino, caffÃ¨ macchiato, caffÃ¨ mocha, flat white, or caffÃ¨ Americano.
        `
      ,
      item_id:'0',
      price:322
    },

      '1':
    {
      title:'Menu',
      head:'Espresso Macchiato',
      body:
      `
      In northern Europe and Scandinavia the term cafÃ© au lait has traditionally been used for the combination of espresso and milk. In France, caffÃ¨ latte is mostly known from the original Italian name of the drink (caffÃ¨ latte or caffelatte); a combination of espresso and steamed milk equivalent to a "latte" is in French called grand crÃ¨me and in German Milchkaffee or (in Austria) Wiener Melange.

        Variants include replacing the coffee with another drink base such as masala chai (spiced Indian tea), mate or matcha, and other types of milk, such as soy milk or almond milk are also used.
      `, 
      item_id:'1',
      price:322
    },

      '2':
    {
      title:'Menu',
      head:'Espresso con Panna',
      body:`
      Espresso con panna, which means "espresso with cream" in Italian, is a single or double shot of espresso topped with whipped cream. In the United States it may also be called cafÃ© Vienne. In France and in the United Kingdom it's called cafÃ© Viennois.

Historically served in a demitasse cup, it is perhaps a more old fashioned drink than a latte or cappuccino, though still very popular, whichever name it receives, at Coffeehouses in Budapest and Vienna.
      `, 
      item_id:'2',
      price:322
    },

      '3':
    {
      title:'Menu',
      head:'Caffe Latte',
      body:
      `
        A latte is a coffee drink made with espresso and steamed milk.

        In northern Europe and Scandinavia the term cafÃ© au lait has traditionally been used for the combination of espresso and milk. In France, caffÃ¨ latte is mostly known from the original Italian name of the drink (caffÃ¨ latte or caffelatte); a combination of espresso and steamed milk equivalent to a "latte" is in French called grand crÃ¨me and in German Milchkaffee or (in Austria) Wiener Melange.

        Variants include replacing the coffee with another drink base such as masala chai (spiced Indian tea), mate or matcha, and other types of milk, such as soy milk or almond milk are also used.
      `
      , 
      item_id:'3',
      price:322
    },

      '4':
    {
      title:'Menu',
      head:'Flat White',
      body:
      `
      A flat white is an espresso based coffee beverage. The beverage is prepared by pouring microfoam (steamed milk consisting of small, fine bubbles with a glossy or velvety consistency) over a shot of espresso. It is somewhat similar to the traditional 140 ml (5 imp fl oz) cappuccino or the latte although smaller in volume, therefore having a higher proportion of coffee to milk, and milk that is more velvety in consistency â allowing the espresso to dominate the flavour, while being supported by the milk.
      `, 
      item_id:'4',
      price:322
    },

      '5':
    {
      title:'Menu',
      head:'Caffe Breve',
      body:`
      Caffe Breve is an American variation of a latte: a milk-based espresso drink using steamed half-and-half mixture of milk and cream instead of milk
      `, 
      item_id:'5',
      price:322
    },

      '6':
    {
      title:'Menu',
      head:'Cappuccino',
      body:
      `
      A cappuccino is an Italian coffee drink that is traditionally prepared with double espresso, hot milk, and steamed milk foam.

Cream may be used instead of milk and is often topped with cinnamon.It is typically smaller in volume than a caffÃ¨ latte, with a thicker layer of micro foam.

The name comes from the Capuchin friars, referring to the colour of their habits,and in this context referring to the colour of the beverage when milk is added in small portion to dark, brewed coffee (today mostly espresso). The physical appearance of a modern cappuccino with espresso crÃ©ma and steamed milk is a result of a long evolution of the drink.
      `, 
      item_id:'6',
      price:322
    },

      '7':
    {
      title:'Menu',
      head:'Caffe Mocha',
      body:
      `
      A caffÃ¨ mocha also called mocaccino, is a chocolate-flavored variant of a caffÃ¨ latte.
      `, 
      item_id:'7',
      price:322

    },

      '8':
    {
      title:'Menu',
      head:'Americano',
      body:`
      CaffÃ¨ Americano or Americano (shortened from Italian: caffÃ¨ americano or American Spanish: cafÃ© americano, literally American coffee) is a style of coffee prepared by brewing espresso with added hot water, giving it a similar strength to, but different flavor from drip coffee. The strength of an Americano varies with the number of shots of espresso and the amount of water added. The name is also spelled with varying capitalization and use of diacritics: e.g., cafÃ© americano.
      `, 
      item_id:'8',
      price:322
    },

      '9':
    {
      title:'Menu',
      head:'Latte Macchiato',
      body:`
      Latte macchiato is a coffee beverage; the name literally means stained milk. This refers to the method of preparation, wherein the milk is "stained" by the addition of espresso.
      `, 
      item_id:'9',
      price:322
    },

      '10':
    {
      title:'Menu',
      head:'Red Eye',
      body:`
      A red eye is a fortified coffee drink in which espresso is combined with normal drip coffee. It is known by various names, some of which refer to different variants.
      `, 
      item_id:'10',
      price:322
    },

    '11':
    {
      title:'Menu',
      head:'Cafe au Late',
      body:`
      CafÃ© au lait is coffee with hot milk added. It differs from white coffee, which is coffee with cold milk or other whitener added.
      `,
      item_id:'11',
      price:322
    } 


};

var bill={};
//populating the bill

  for (var i=0;i<=11;i++)
  {
    bill[i]=[menu_item[i].head,0,0];
    //bill[i][0]=menu_item[i].head;
  };

app.get('/ui/get_bill_details_for_item_id/:id', function (req, res)
{

  var id=req.params.id;
  var id_no=parseInt(id,10);//convertin id containg string type  value to int type decimal value
  if (id_no!=-1)
  {
    bill[id_no][1]+=1; //increasing the quantity by 1
    bill[id_no][2]+=menu_item[id_no].price; //adding prise of 1 purchase
  }

  var printed_bill="";
  for (var i = 0;i<=11;i++)
  {
   if (bill[i][1]!=0)
   {
    printed_bill+="Coffee: "+bill[i][0] + "<br>Qty: " +bill[i][1] + " price: "+bill[i][2] +"<br>";
   }
  }


  //for future commenting kappa
  res.send(JSON.stringify(printed_bill));
});


//storing comments in a 2-d array as [page][comments]
var list=[[],[],[],[],[],[],[],[],[],[],[],[]];

app.get('/ui/:id/comments', function (req, res)
{
  //url type: ui/3/comments?comment=... here id = 3
  var id=req.params.id;
  var id_no=parseInt(id,10);//convertin id containg string type  value to int type decimal value
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

  pool.query('SELECT * FROM menu_items WHERE item_id=$1',[no],function(err,result)//* = item_id,title,body,head
    {
      if (err)
      {
        res.Status(500).send(err.toString());
      }
      else if (result.rows.length===0)
      {
        res.Status(404).send("item not present in menu."); 
      }
      else
      {
        res.send(menu_item_template(result.rows[0]));
        //res.send(result.rows)
      }
    });

  //res.send(menu_item_template(menu_item[no]));//using menu_item_template to create many html pages using jsobject
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/menu_comment/:id', function (req, res) {
  id=req.params.id;
  //using menu_item_template to resopnd with js that will sit in client and do client-side-templating to get comments on the page referenced by this id
  res.send(comment_template(id));
});

app.get('/ui/place_order', function (req, res) {
  //sending the order as menu list with quantity html doc generated by this template
  res.send(order_template(menu_item));
});


app.get('/ui/order_page_js', function (req, res) {
  //sending the order as menu list with quantity html doc generated by this template
  res.send(order_template_js());
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
     send_req_and_get_res();//when page is loaded

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
            var new_list="";
            //creating a string to render in the inner html of ol on this article page
            for (var i=comment.length-1;i>=0;i--)    //storing in reverse to show the most recent comment at the top
             {
                new_list+="<li>"+comment[i]+"</li>";
              };
            var old_list=document.getElementById('ol_id_${id}');
            if (new_list!=="")
            {
            old_list.innerHTML=new_list;
            }
          }
        }

      };

      //making request
      input=document.getElementById('in_id_${id}');
      data=input.value;
      //sending request to page with id=current_id
      request.open('GET','http://localhost:8080/ui/${id}/comments?comment='+data,true);
      //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/${id}/comments?comment='+data,true);
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
        <ol id = 'ol_id_${item_id}' class="comment_list">Be the first to comment!
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


function order_template(menu_item)
{
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
      var item_id=menu_item[i].item_id;
      var head=menu_item[i].head;
      var price=menu_item[i].price;
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
    <ul id='bill'>Your cart</ul>
    <script type="text/javascript" src="/ui/order_page_js">
    </script>
    </body>
    </html>
    `

  return html_data;
}

function order_template_js()
{
  var js_data=`var bill=document.getElementById('bill'); `;

  for (var i=-1;i<=11;i++)
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
              new_order=JSON.parse(request.responseText);
              if(new_order!=="")
              {
              bill.innerHTML=new_order;
              }
            }
          }

        };

        //making request
        if (id_no === -1)
        request.open('GET','http://localhost:8080/ui/get_bill_details_for_item_id/-1',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/-1',true);
        else 
        request.open('GET','http://localhost:8080/ui/get_bill_details_for_item_id/${i}',true);
        //request.open('GET','http://ceidloc.imad.hasura-app.io/ui/get_bill_details_for_item_id/${i}',true);
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
