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

            var new_list=` `;
            for(var i=0;i<=categories.length -1;i++)
             {
              console.log("mega brokeback");
             	category=categories[i].category;
                  details=categories[i].details;
             	new_list+=`
                     <div class="panel panel-default">
                        <div class="panel-heading" style="background-color:#feee7d;">
                          <h4 class="panel-title" >
                            <a data-toggle="collapse" data-parent="#home_page_categories" href="#collapse`+i+`">
                            <div class="panel-heading">`+category+`</div>
                          </h4>
                        </div>
                        </a>
                        <div id="collapse`+i+`" class="panel-collapse collapse">
                          <div class="panel-body" >
                            <a href="/ui/a/`+category+`" class="list-group-item " style="background-color:#feee7d;">
                              <h4>`+details+`</h4>
                            </a>  
                          </div>
                        </div>
                      </div>
                  `;
             }

            old_list.innerHTML=new_list;
		}
	};
	request.open('GET',window.location.protocol+'//'+window.location.host+'/ui/get/all_categories_cs',true);
    request.send(null);
}

  //bootstrap nav bar 

    /* Set the width of the side navigation to 250px */
    function openNav() {
        document.getElementById("mySidenav").style.width = "80%";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }  

//load side nav bar to display log_in,sign_up / log_out link's

