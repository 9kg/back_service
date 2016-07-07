$(function(){
    var id = base.getParam('id');
    $.ajax({
        url: "http://192.168.1.211:5211/back/js/json/detail.json",
        data:{
            id: id
        },
        type: "GET",
        dataType: "JSON"
    }).always(function(data){
        $.each(data,function(key,val){
            if(!$.isPlainObject(val)){
                $('.guest_'+key).text(val);
            }else{
                var text = '';
                val.input_by_date && (text += '每' + ({day:'日', week:'周', month:'月'})[val.charge_by_date] + val.input_by_date + '元<br>');
                val.input_by_one && (text += '每个' + val.input_by_one + '元<br>');
                val.input_by_other && (text += val.input_by_other);
                $('.guest_money').html(text);
            }
        });
    });
    // 定义升级特邀用户窗口
    var box = new Box({
        title: 'IDFA('+id+')',
        html: '<div class="idfa_list t_right"><button type="button" class="btn btn_info">导出</button></div>',
        css:{
            'max-width': 700
        },
        footer: false
    });
    $("body").on("click",'.query_idfa',function(){
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
            isLocal: true,
            theme: 'warning',
            url: "http://192.168.1.211:5211/back/js/json/user.json"
        };
        !$(".idfa_list .table").length && new Table(opt);
        box.show();
    }).on('click', '.query_num', function() {
        window.open('http://192.168.1.211:5211/back/html/report/guest_user.html?id='+id);
    }).on('click', '.query_money', function() {
        window.open('http://192.168.1.211:5211/back/html/report/guest_user.html?id='+id+'&type=money');
    });
});