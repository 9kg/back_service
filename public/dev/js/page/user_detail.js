$(function(){
    var id = base.getParam('id');
    $.ajax({
        url: "http://192.168.1.211:5211/js/json/detail.json",
        data:{
            id: id
        },
        type: "GET",
        dataType: "JSON"
    }).always(function(data){
        $.each(data,function(key,val){
            if(!$.isPlainObject(val)){
                $('.user_'+key).text(val);
            }else{
                var text = '';
                val.input_by_date && (text += '每' + ({day:'日', week:'周', month:'月'})[val.charge_by_date] + val.input_by_date + '元<br>');
                val.input_by_one && (text += '每个' + val.input_by_one + '元<br>');
                val.input_by_other && (text += val.input_by_other);
                $('.user_money').html(text);
            }
        });
    });
    // 定义升级特邀用户窗口
    var box = new Box({
        title: '详情('+id+')',
        html: '<div class="idfa_list t_right"><button type="button" class="btn btn_info">导出</button></div>',
        css:{
            'max-width': 700
        },
        footer: false
    });
    $("body").on("click",'.query_num',function(){
        var opt = {
            $ct: $(".idfa_list"),
            col: [{
                key: "id",
                title: "IDFA",
                sort: true,
                filter: true
            }, {
                key: "login",
                title: "邀请时间",
                sort: true,
                filter: true
            }, {
                key: "login_times",
                title: "再邀请人数",
                sort: true,
                filter: true
            }],
            theme: 'info',
            isLocal: true,
            url: "http://192.168.1.211:5211/js/json/user.json"
        };
        !$(".idfa_list .table").length && new Table(opt);
        box.show();
    }).on("click", ".btn_level", function() {
        var id = $(this).data("data-id");
        oper_guest.box.initHeader('添加特邀用户');

        oper_guest.box.initContent('http://192.168.1.211:5211/html/temp/add_guest_user.html .add_guest_user_form', function() {
            oper_guest.box.show();
        });
        var $tip_ct = $(this).parent();
        oper_guest.box.afterfnSure = function(tip){
            $tip_ct.operTip(tip || "操作成功！",{theme: "warning",css:{left:'auto',right:'20px'}});
        }
    });
});