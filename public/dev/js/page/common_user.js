$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "objectId",
            title: "ID",
            cls: 'hidden_xs',
            sort: true,
            filter: true
        }, {
            key: "idfa",
            title: "IDFA",
            cls: 'hidden_xs',
            filter: true
        }, {
            key: "phone",
            title: "电话",
            filter: true
        }, {
            key: "nickname",
            title: "昵称",
            filter: true
        }, {
            key: "allGet",
            title: "历史收入",
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "taskall_end",
            title: "总完成任务数",
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "objectId",
            title: "操作",
            width: '60',
            render: function(a, b, c, d) {
                a.append($('<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>'));
                if(~[1,4,6].indexOf(role)){
                    a.append($('<button type="button" class="btn btn_danger btn_level">特邀</button>').data("obj",d));
                }
            }
        }],
        // isLocal: true,
        url: "http://192.168.1.211:5211/back/user/query"
    };
    new Table(opt);
    
    $("body").on("click", ".btn_level", function() {
        var obj = $(this).data("obj");
        oper_guest.box.initHeader('添加特邀用户');
        oper_guest.box.initContent('http://192.168.1.211:5211/back/page/guest_user_add .add_guest_user_form', function() {
            $('[name="uid"]').val(obj.objectId);
            $('[name="name"]').val(obj.alipay_name || obj.nickname);
            $('[name="alipay"]').val(obj.alipay);
            oper_guest.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_guest.box.afterfnSure = function(data){
            if(data.status === 1){
                $tip_ct.operTip(data.msg || "操作成功！",{theme: "success", dir: "left", css:{"white-space": "nowrap"}});
            }else{
                $tip_ct.operTip(data.msg || "操作失败！",{theme: "danger", dir: "left", css:{"white-space": "nowrap"}});
            }
        }
    }).on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/back/page/user_detail/'+$(this).data('id'));
    });
});
