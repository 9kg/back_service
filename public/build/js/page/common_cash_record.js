$(function(){var e={$ct:$(".content"),col:[{key:"objectId",title:"ID",cls:"hidden_xs",sort:!0,filter:!0},{key:"idfa",title:"IDFA",cls:"hidden_xs",filter:!0},{key:"phone",title:"电话",filter:!0},{key:"nickname",title:"昵称",filter:!0},{key:"allGet",title:"历史收入",filter:!0,cls:"hidden_xs"},{key:"taskall_end",title:"总完成任务数",filter:!0,cls:"hidden_xs"},{key:"objectId",title:"操作",width:"60",render:function(e,t,n,a){e.append($('<button type="button" class="btn btn_info btn_query_detail" data-id="'+t+'">查看</button>')),~[1,4,6].indexOf(role)&&e.append($('<button type="button" class="btn btn_danger btn_level">特邀</button>').data("obj",a))}}],url:"http://es2.laizhuan.com/back/user/query"};new Table(e),$("body").on("click",".btn_level",function(){var e=$(this).data("obj");oper_guest.box.initHeader("添加特邀用户"),oper_guest.box.initContent("http://es2.laizhuan.com/back/page/guest_user_add .add_guest_user_form",function(){$('[name="uid"]').val(e.id),$('[name="name"]').val(e.alipay_name||e.nickname),$('[name="alipay"]').val(e.alipay),oper_guest.box.show()});var t=$(this).closest("td");oper_guest.box.afterfnSure=function(e){1===e.status?t.operTip(e.msg||"操作成功！",{theme:"success",dir:"left",css:{"white-space":"nowrap"}}):t.operTip(e.msg||"操作失败！",{theme:"danger",dir:"left",css:{"white-space":"nowrap"}})}}).on("click","table .btn_query_detail",function(){window.open("http://es2.laizhuan.com/back/page/user_detail/"+$(this).data("id"))})});