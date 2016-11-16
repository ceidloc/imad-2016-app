//load's list of categories and insert inside ol whoes id=home_page_categories


var categories = document.getElementById('home_page_categories');

if (categories)
 {
	var request = new XMLHttpRequest();	
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) 
		{
			
            old_list=document.getElementById('home_page_categories');
            categories=JSON.parse(request.responseText);

            var new_list="";
            for(var i=0;i<=categories.length -1;i++)
             {
             	category=categories[i].category;
             	new_list+="<li><a href='/ui/a/"+category+"'>"+category+"</a></li>"
             }

            old_list.innerHTML=new_list;
		}
	};
	request.open('GET','http://localhost:8080/ui/a/all_categories',true);
    request.send(null);
    console.log("\n\n inside if \n");
}

//load side nav bar to display log_in,sign_up / log_out link's

