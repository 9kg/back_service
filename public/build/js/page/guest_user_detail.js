$(function(){var t=base.getParam("id");$.ajax({url:"http://lz.594211.xyz//js/json/detail.json",data:{id:t},type:"GET",dataType:"JSON"}).always(function(t){$.each(t,function(t,e){if($.isPlainObject(e)){var i="";e.input_by_date&&(i+="每"+{day:"日",week:"周",month:"月"}[e.charge_by_date]+e.input_by_date+"元<br>"),e.input_by_one&&(i+="每个"+e.input_by_one+"元<br>"),e.input_by_other&&(i+=e.input_by_other),$(".guest_money").html(i)}else $(".guest_"+t).text(e)})});var e=new Box({title:"IDFA("+t+")",html:'<div class="idfa_list t_right"><button type="button" class="btn btn_info">导出</button></div>',css:{"max-width":700},footer:!1});$("body").on("click",".query_idfa",function(){var t={$ct:$(".idfa_list"),col:[{key:"id",title:"IDFA",sort:!0,filter:!0},{key:"login",title:"邀请时间",sort:!0,filter:!0},{key:"login_times",title:"再邀请人数",sort:!0,filter:!0}],isLocal:!0,theme:"warning",url:"http://lz.594211.xyz//js/json/user.json"};!$(".idfa_list .table").length&&new Table(t),e.show()}).on("click",".query_num",function(){window.open("http://lz.594211.xyz//html/report/guest_user.html?id="+t)}).on("click",".query_money",function(){window.open("http://lz.594211.xyz//html/report/guest_user.html?id="+t+"&type=money")})});