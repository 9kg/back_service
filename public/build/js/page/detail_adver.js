$(function(){function e(){window.location.href=window.location.href,window.opener&&window.opener.renderTable&&window.opener.renderTable()}var a,t=new Box({title:"广告主充值",html:'<form class="recharge_form"><input type="hidden" name="ad_id" value="'+adData.id+'"><div class="grid_nowrap"><div class="ct_4"><label class="whether"><input type="checkbox" checked class="isPos"><span class="opt_imitate">加</span><span class="opt_imitate">减</span></label></div><div class="ct_4-3"><label class="suffix"><input type="text" name="price_all" data-validate="require,+"><span class="opt_imitate">元</span></label></div></div></form>',css:{width:"300px"},fnSure:function(a,t){var n=$(".recharge_form");if(!base.formValidate(n))return!1;var r=+$('[name="price_all"]',n).val(),i={token:"b725d85cc16ff50cf9dec5274e7a2259",ad_id:$('[name="ad_id"]',n).val(),price_all:$(".isPos").prop("checked")?r:-r};$.ajax({url:"http://192.168.1.211:9211/adver/recharge",type:"POST",dataType:"json",data:i}).done(function(a){console.log(a),1==a.status?e():$(".btn_recharge").parent().operTip(a&&a.msg||"操作失败！",{theme:"danger",css:{"white-space":"nowrap",left:"auto",right:"-2em"}})}).fail(function(e){console.dir(e)})},fnCancel:function(e){}}),n=new Box({title:"修改广告主",css:{"min-width":"320px","max-width":"420px"},fnSure:function(t,n){if(!base.formValidate(a))return!1;$.trim($('[name="resetpwd"]').val())||$('[name="resetpwd"]').prop("disabled",!0);var r=a.serializeArray();$('[name="resetpwd"]').prop("disabled",!1),$.ajax({url:"http://192.168.1.211:9211/adver/edit",type:"POST",dataType:"json",data:r}).done(function(a){console.log(a),1==a.status?e():$(".btn_edit").parent().operTip(a&&a.msg||"操作失败！",{theme:"danger",css:{"white-space":"nowrap",left:"auto",right:"-2em"}})}).fail(function(e){console.dir(e)})},fnCancel:function(e){}}),r=new Box({title:"充值记录",html:'<div class="records_list"></div>',css:{"min-width":"320px"},footer:!1});n.initContent("http://192.168.1.211:9211/page/adver_add .add_adver_form",function(){a=$("form.add_adver"),$('[name="company"]').val(adData.company),$('[name="name"]').val(adData.name).before($('<input type="hidden" name="id" value="'+adData.id+'">')),$('[name="phone"]').val(adData.phone),$('[name="username"]').val(adData.username).prop("disabled",!0),$('[name="password"]').attr("name","resetpwd").attr("placeholder","如不修改请留空").removeAttr("data-validate")}),$("body").on("click",".btn_edit",function(){n.show()}).on("click",".btn_recharge",function(){t.show()}).on("click",".recharge_records",function(){r.show();var e={$ct:$(".records_list"),col:[{key:"createdAt",title:"时间",sort:!0,filter:!0},{key:"price_all",title:"金额",sort:!0,filter:!0},{key:"descripe",title:"描述",sort:!0,filter:!0,cls:"hidden_xs"}],isLocal:!0,theme:"lightblue",url:"http://192.168.1.211:9211/adver/recharge_records?id="+adData.id};!$(".records_list .table").length&&new Table(e)}).on("click",".btn_add_task",function(){oper_task.box.initHeader("添加任务"),oper_task.box.operType="insert",oper_task.box.initContent("http://192.168.1.211:9211/page/task_add .add_task_form",function(){oper_task.box.show(),oper_task.initWidget(),$("form.add_task").prepend($('<input type="hidden" name="ad_id" value="'+adData.id+'">'))});var e=$(this).parent();oper_task.box.afterfnSure=function(a,t){a?e.operTip(t||"操作成功！",{theme:"warning",css:{"white-space":"nowrap",left:"auto",right:"3em"}}):e.operTip(t||"操作失败！",{theme:"danger",css:{"white-space":"nowrap",left:"auto",right:"3em"}})}})});