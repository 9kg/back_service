$(function(){var n,e=new Box({title:"修改个人信息",css:{"min-width":"320px","max-width":"420px"},fnSure:function(a,t){if(!base.formValidate(n))return!1;var o=n.serializeArray();$.ajax({url:"http://lz.594211.xyz//personal/modify",type:"POST",dataType:"json",data:o}).done(function(n){console.log(n),1==n.status?($(".btn_edit").parent().operTip(n.msg||"操作成功！",{theme:"success",css:{"white-space":"nowrap"}}),setTimeout(function(){window.location.href=window.location.href},500)):2==n.status&&($('[data-show=".set_password"]').parent().operTip(n.msg||"操作失败！",{theme:"danger",dir:"top",css:{"white-space":"nowrap"}}),e.show())}).fail(function(n){console.dir(n)})},fnCancel:function(n){}});e.initContent("http://lz.594211.xyz//page/personal_add .add_personal_form",function(){n=$("form.add_personal"),$('[name="name"]').val(personalData.name).before($('<input type="hidden" name="id" value="'+personalData.id+'">')),$('[name="phone"]').val(personalData.phone)}),$("body").on("click",".btn_edit",function(){e.show()})});