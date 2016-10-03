

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










