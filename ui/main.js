
<<<<<<< HEAD
menu=[]

for (var i=1; i <= 12; i++) {
	menu[i]=document.getElementById('mi_'+i.toString());
};


menu[1].onclose=function()
{
  menu[1].style.marginLeft ='100px';
};

menu[1].onmouseleave=function()
{
  menu[1].style.marginLeft ='0px';
};

menu[1].onclick=function()
{
  //send request to its specific article page
};


menu[2].onclose=function()
{
  menu[2].style.marginLeft ='100px';
};

menu[2].onmouseleave=function()
{
  menu[2].style.marginLeft ='0px';
};

menu[2].onclick=function()
{
  //send request to its specific article page
};


menu[3].onclose=function()
{
  menu[3].style.marginLeft ='100px';
  menu[3].style.block ='kappa';
};

menu[3].onmouseleave=function()
{
  menu[3].style.marginLeft ='0px';
};

menu[3].onclick=function()
{
  //send request to its specific article page
  menu[3].style.marginLeft ='100px';
};


menu[4].onclose=function()
{
  menu[4].style.marginLeft ='100px';
};

menu[4].onmouseleave=function()
{
  menu[4].style.marginLeft ='0px';
};

menu[4].onclick=function()
{
  //send request to its specific article page
};


menu[5].onclose=function()
{
  menu[5].style.marginLeft ='100px';
};

menu[5].onmouseleave=function()
{
  menu[5].style.marginLeft ='0px';
};

menu[5].onclick=function()
{
  //send request to its specific article page
};


menu[6].onclose=function()
{
  menu[6].style.marginLeft ='100px';
};

menu[6].onmouseleave=function()
{
  menu[6].style.marginLeft ='0px';
};

menu[6].onclick=function()
{
  //send request to its specific article page
};


menu[7].onclose=function()
{
  menu[7].style.marginLeft ='100px';
};

menu[7].onmouseleave=function()
{
  menu[7].style.marginLeft ='0px';
};

menu[7].onclick=function()
{
  //send request to its specific article page
};


menu[8].onclose=function()
{
  menu[8].style.marginLeft ='100px';
};

menu[8].onmouseleave=function()
{
  menu[8].style.marginLeft ='0px';
};

menu[8].onclick=function()
{
  //send request to its specific article page
};


menu[9].onclose=function()
{
  menu[9].style.marginLeft ='100px';
};

menu[9].onmouseleave=function()
{
  menu[9].style.marginLeft ='0px';
};

menu[9].onclick=function()
{
  //send request to its specific article page
};


menu[10].onclose=function()
{
  menu[10].style.marginLeft ='100px';
};

menu[10].onmouseleave=function()
{
  menu[10].style.marginLeft ='0px';
};

menu[10].onclick=function()
{
  //send request to its specific article page
};


menu[11].onclose=function()
{
  menu[11].style.marginLeft ='100px';
};

menu[11].onmouseleave=function()
{
  menu[11].style.marginLeft ='0px';
};

menu[11].onclick=function()
{
  //send request to its specific article page
};


menu[12].onclose=function()
{
  menu[12].style.marginLeft ='100px';
};

menu[12].onmouseleave=function()
{
  menu[12].style.marginLeft ='0px';
};

menu[12].onclick=function()
{
  //send request to its specific article page
};
=======

var submit_btn_id=[];
for (var i=1; i <= 12; i++) 
{	//getting elements by id and storing them in an array

	submit_btn_id[i]=document.getElementById('sub_id_'+i.toString());
};


submit_btn_id[1].onclick=comment_template(1);
submit_btn_id[2].onclick=comment_template(2);
submit_btn_id[3].onclick=comment_template(3);
submit_btn_id[4].onclick=comment_template(4);
submit_btn_id[5].onclick=comment_template(5);
submit_btn_id[6].onclick=comment_template(6);
submit_btn_id[7].onclick=comment_template(7);
submit_btn_id[8].onclick=comment_template(8);
submit_btn_id[9].onclick=comment_template(9);
submit_btn_id[10].onclick=comment_template(10);
submit_btn_id[11].onclick=comment_template(11);
submit_btn_id[12].onclick=comment_template(12);


function comment_template(id)
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
				//creating a string to render in the inner html of ul on this article page
				for (var i=1;i<=comment.length;i++)
					{
						new_list+="<li>"+comment[i]+"</li>";
					};
				old_list=document.getElementById('ul_id_'+id.toString());
				old_list.innerHTML=new_list;
			}
		}

	};



	//making request
	input=document.getElementById('in_id_'+id.toString());
	data=input.value;
	request.open('GET','http://localhost:8080/ui/3/comments?comment='+data,true);
	request.send(null);

};








>>>>>>> 4105e68955927bd6fef36e6aded0bf60d1cc783a


