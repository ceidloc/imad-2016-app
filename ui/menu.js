

var submit_btn_id=[];
for (var i=1; i <= 12; i++) 
{	//getting elements by id and storing them in an array

	submit_btn_id[i]=document.getElementById('sub_id_'+i.toString());
};




submit_btn_id[3].onclick=function ()
{
	comment_template(3);

	

};



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
				old_list=document.getElementById('ul_id_3');
				old_list.innerHTML=new_list;
			}
		}

	};

	//making request
	input=document.getElementById('in_id_3');
	data=input.value;
	request.open('GET','http://ceidloc.imad.hasura-app.io/ui/3/comments?comment='+data,true);
	request.send(null);
	
}











