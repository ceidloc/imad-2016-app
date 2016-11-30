//load's list of categories and insert inside ol whoes id=home_page_categories

var log_details = document.getElementById('log_in_details');

var categories = document.getElementById('home_page_categories');

if (categories)
 {
	var request = new XMLHttpRequest();	
	request.onreadystatechange = function(){
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) 
		{
            old_list=document.getElementById('home_page_categories');
            respone=JSON.parse(request.responseText);//[[list of categories],[,'log_in_details'user_id]]
            categories=respone[0];

            log_in_details=respone[1][0];
            if (log_in_details==="logged in")
              {
                log_details.innerHTML=`
                  <li>
                    <input type="submit" class="btn btn-danger" href="/ui/" value='Log Out' onclick="log_out_func();">
                    </input>
                  </li>
                `;
             }
             else
             {
            log_details.innerHTML=`
              <li><a href="/ui/sign_up_page/previous_page?previous_page=home_page"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="/ui/log_in_page/previous_page?previous_page=home_page"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                `;
             }

            var new_list=` `;
            for(var i=0;i<=categories.length -1;i++)
             {
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

function log_out_func()
{
  request.open('DELETE',window.location.protocol+'//'+window.location.host+'/ui/log_out',true);
  request.send(null);
  window.location.href=window.location.protocol+'//'+window.location.host+'/'
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

