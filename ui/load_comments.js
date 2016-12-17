// Eg: ceidloc.imad.hasura-app.io/ui/a/:category:/:article_id will result in :article_id
var current_article_id = window.location.pathname.split('/')[4];

var delete_block=`<input type='submit' id =PLACEHOLDER class = 'btn btn-warning' value='delete' onClick='PLACEHOLDER;'> </input>`;

var update_block=`<input type='submit' id =PLACEHOLDER class = 'btn btn-info' value='update' onClick='PLACEHOLDER'; wrap='hard'></input>`;

var reply_block=`<input type='submit' id =PLACEHOLDER class = 'btn btn-defult' value='reply' onClick='PLACEHOLDER';></input>`;

var upvote_block=`<button type='submit' id =PLACEHOLDER class = 'btn btn-success'  onClick='PLACEHOLDER';><span class="glyphicon glyphicon-thumbs-up"></span> </button>`;

var downvote_block=`<button type='submit' id =PLACEHOLDER class = 'btn btn-danger' onClick='PLACEHOLDER';><span class="glyphicon glyphicon-thumbs-down"></span></button>`;

function escape_html_cs(text)
{//all output's for the user entered input,will use this function during client side rendering
  var text=document.createTextNode(text);
  var div=document.createElement('div');
  div.appendChild(text);

  return div.innerHTML;
}


function find_children(article_id,stack,parent_comment_id,bg_color)
{
	//finding all of it's children 
	//parent_comment_id = -1, mean's comment has no parent
	var children=[];

	//sending request to api end-point
	
	var request=new XMLHttpRequest();

	request.onreadystatechange=function()
	{
		if (request.readyState===XMLHttpRequest.DONE && request.status === 200)
		{
			//gives array of all comment's ordered by point's,having parent's comment_id=parent_comment_id
			comments=JSON.parse( request.responseText );

			//the last element of array is has log_in_details=["logged in"/"not logged in",user_id]
			log_in_details=comments[comments.length -1];
			current_user_id=log_in_details[1];
			log_in_details=log_in_details[0];

			//removing the last element
			comments.splice(comments.length-1,comments.length);

			//adding comments in reverse order so that the comment with moust point's is at top
			children.push.apply( children,comments.reverse() );
			//console.log("\n\n children of parent",parent_comment_id,children.length);

			//display all children
			//if no of children != 0 
			if (children.length!==0)
			{	
				if (parent_comment_id!==-1)
					parent=document.getElementById('comment_body_'+parent_comment_id);
				else
					parent.innerHTML="";

				var html_data="";
				var children_stack=[];
				for(i=0;i<children.length;i++)
				{
					comment=children[i];
					//pushing the comment with the most points at the bottom of the children_stack
					children_stack.push(comment.comment_id);
					//adding the child to the parent div

					var time = new Date(comment.time);
					
					html_data+="<div class='list-group-item ' id=comment_body_"+comment.comment_id+" style='background-color:"+bg_color+";' >";

					html_data+=`
		              <h4 id='points_on_comment_id_`+comment.comment_id+`' class=details>
		              `+ comment.points +` points
		              </h4>`;

					html_data+="<blockquote><div id=comment_text_"+comment.comment_id+">"+escape_html_cs(comment.text)+"</div><footer>By:"+escape_html_cs(comment.username)+" submitted at:"+time.toLocaleTimeString()+" on:"+time.toLocaleDateString()+"</footer></blockquote>";

					

					if (comment.user_id===current_user_id)
					{

						update_btn=update_block.replace('PLACEHOLDER','update_btn_id_'+comment.comment_id );
						update_btn=update_btn.replace('PLACEHOLDER','updating_comment('+ comment.comment_id+');');//replaces; onclick='PLACEHOLDER'
						html_data+="<br> "+update_btn;

						delete_btn=delete_block.replace('PLACEHOLDER','delete_btn_id_'+ comment.comment_id);//replaces; id=PLACEHOLDER
						delete_btn=delete_btn.replace('PLACEHOLDER','delete_comment('+ comment.comment_id+');');//replaces; onclick='PLACEHOLDER'
						html_data+=" "+delete_btn;

					}
					else if (log_in_details==="logged in")
					{

						upvote_btn=upvote_block.replace('PLACEHOLDER','upvote_comment_btn_id_'+comment.comment_id );
						upvote_btn=upvote_btn.replace('PLACEHOLDER','update_points_on_comment('+article_id+','+ comment.comment_id+',1);');//replaces; onclick='PLACEHOLDER'
						html_data+='<br> '+upvote_btn;

						downvote_btn=downvote_block.replace('PLACEHOLDER','downvote_comment_btn_id_'+ comment.comment_id);//replaces; id=PLACEHOLDER
						downvote_btn=downvote_btn.replace('PLACEHOLDER','update_points_on_comment('+article_id+','+ comment.comment_id+',-1);');//replaces; onclick='PLACEHOLDER'
						html_data+=' '+downvote_btn;        

						reply_btn=reply_block.replace('PLACEHOLDER','reply_btn_id_'+comment.comment_id );
						reply_btn=reply_btn.replace('PLACEHOLDER','reply_comment('+ comment.comment_id+');');//replaces; onclick='PLACEHOLDER'
						html_data+=" "+reply_btn;

					}



		            html_data+="</div>";


						
				}

				if(children_stack.length!==0)
				{
					
					//adding all the children to the parent comment
					parent.innerHTML+=html_data;

					if (bg_color==='#fff')
						new_bg_color="#F8FAFF";
					else
						new_bg_color='#fff'

					load_comment(article_id, children_stack.reverse() ,new_bg_color);
				}

			}
			else if(parent_comment_id===-1)
			{
				//no comments on this article
				parent.innerHTML="Be the first to comment!";
			}

		}
	}

	
	request.open('GET',window.location.protocol+"//"+window.location.host+"/ui/parent/"+article_id+"/"+parent_comment_id ,true);
	request.send(null);
}


function load_comment(article_id,stack,bg_color)
{
	while(stack.length !==0)//while stack is not empty
	{	
		//console.log("\n\n initial stack",stack,":parent",parent_comment_id);
		//extracting the top comment_id from stack
		var parent_comment_id=stack.pop();

		find_children(article_id,stack,parent_comment_id,bg_color);
	}
}


var parent=document.getElementById('comments_body_'+current_article_id);
parent.innerHTML="<h4 class=text-center>loading...</h4>";

//calls funtion load_comment on load
load_comment(current_article_id,[-1],'#fff');