$(function() {
    // var opt = {
    //     $ct: $(".content"),
    //     col: [{
    //         key: "id",
    //         title: "ID",
    //         cls: 'hidden_xs',
    //         sort: true,
    //         filter: true
    //     }, {
    //         key: "idfa",
    //         title: "IDFA",
    //         cls: 'hidden_xs',
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "phone",
    //         title: "电话",
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "wechat",
    //         title: "微信",
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "ip",
    //         title: "最近IP",
    //         sort: false,
    //         cls: 'hidden_xs',
    //         filter: true
    //     }, {
    //         key: "login_times",
    //         title: "登录次数",
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "login",
    //         title: "最近登录",
    //         cls: 'hidden_xs',
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "today",
    //         title: "今日收入",
    //         sort: false,
    //         filter: true
    //     }, {
    //         key: "money",
    //         title: "历史收入",
    //         cls: 'hidden_xs',
    //         sort: true
    //     }, {
    //         key: "id",
    //         title: "操作",
    //         render: function(a, b) {
    //             var btn_query = $('<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>');
    //             var btn_level = $('<button type="button" class="btn btn_danger btn_level" data-id="' + b + '">特邀</button>');
    //             a.append(btn_query, btn_level);
    //         }
    //     }],
    //     // isLocal: true,
    //     url: "http://192.168.1.107:9211/js/json/user.json"
    // };
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
            key: "objectId",
            title: "操作",
            render: function(a, b) {
                var btn_query = $('<button type="button" class="btn btn_info btn_query_detail" data-id="' + b + '">查看</button>');
                var btn_level = $('<button type="button" class="btn btn_danger btn_level" data-id="' + b + '">特邀</button>');
                a.append(btn_query, btn_level);
            }
        }],
        // isLocal: true,
        url: "http://192.168.1.107:9211/user/query"
    };
    new Table(opt);
    
    $("body").on("click", ".btn_level", function() {
        var id = $(this).data("data-id");
        oper_guest.box.initHeader('添加特邀用户');

        oper_guest.box.initContent('http://192.168.1.107:9211/html/temp/add_guest_user.html .add_guest_user_form', function() {
            oper_guest.box.show();
        });
        var $tip_ct = $(this).closest("td");
        oper_guest.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning"});
        }
    }).on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.107:9211/html/detail/user_detail.html?id='+$(this).data('id'));
    });
});
