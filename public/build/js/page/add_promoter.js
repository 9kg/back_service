$(function(){function t(t){var n=$("form.add_promoter");if(!base.formValidate(n))return!1;var o=n.serializeArray();return $.ajax({url:"test.php",type:"POST",dataType:"json",data:o}).done(function(){t&&t("das")}).fail(function(n){t&&t(),console.dir(n)}),!0}function n(){var n=new Box({title:"添加推广人员",html:"http://lz.594211.xyz//page/promoter_add .add_promoter_form",css:{"min-width":"320px","max-width":"420px"},fnSure:function(n,o){return t(n&&n.afterfnSure)?void 0:!1},fnCancel:function(t){}});window.oper_promoter={box:n}}$('[name="spd_name"]').length?$('form.add_promoter [name="spd_name"]').attr("data-validate-dir",""):n(),$("body").on("click",".btn_promoter_submit",function(){t(function(t){})})});