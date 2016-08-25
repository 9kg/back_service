$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "uid",
            title: "用户ID",
            cls: 'hidden_xs',
            sort: true,
            filter: true
        }, {
            key: "nickname",
            title: "微信昵称",
            sort: true,
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "price",
            title: "提现金额",
            sort: true,
            filter: true
        }, {
            key: "createdAt",
            title: "提现时间",
            sort: true,
            filter: true,
            cls: 'hidden_xs'
        }, {
            key: "alipay",
            title: "支付宝账号",
            sort: true,
            filter: true
        }, {
            key: "alipay_name",
            title: "真实姓名",
            sort: true,
            filter: true
        }, {
            key: "objectId",
            title: "操作",
            width: '60',
            render: function(a, b, c, d) {
                a.append($('<button type="button" class="btn btn_success btn_agree" data-id="' + b + '">同意</button>'));
                a.append($('<button type="button" class="btn btn_danger btn_disagree" data-id="' + b + '">拒绝</button>'));
            }
        }],
        // isLocal: true,
        url: "http://192.168.1.211:5211/back/finance/cashout_query"
    };
    new Table(opt);
    
    $("body").on("click", ".btn_level", function() {
        var obj = $(this).data("obj");
        oper_guest.box.initHeader('添加特邀用户');
        oper_guest.box.initContent('http://192.168.1.211:5211/back/page/guest_user_add .add_guest_user_form', function() {
            $('[name="uid"]').val(obj.id);
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
