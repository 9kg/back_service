$(function() {
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "name",
            title: "广告主",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "createdAt",
            title: "时间",
            cls: "hidden_xs",
            sort: true,
            filter: true
        }, {
            key: "money",
            title: "收入/支出",
            sort: true,
            filter: true
        }, {
            key: "token",
            title: "明细",
            sort: true,
            filter: true
        }, {
            key: "username",
            title: "操作人",
            sort: true,
            cls: "hidden_xs"
        }],
        isLocal: true,
        url: "_HOST_/finance/adver_cash"
    };
    if(role === 2 || 1){
        opt.col.push({
            key: "id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b) {
                var btn_query = $('<button type="button" class="btn btn_info btn_confirm" data-id="' + b + '">确认</button>');
                a.append(btn_query);
            }
        });
    }
    window.renderTable = function(){
        adver_cash_table.data = null;       //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                            //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        adver_cash_table.render();
    };
    var adver_cash_table = new Table(opt);
    $('body').on('click','table .btn_confirm',function(){
        var $tip_ct = $(this).parent();
        var id = $(this).data("id");
        $.ajax({
            url: "_HOST_/finance/adver_cash_confirm",
            type: "POST",
            dataType: "json",
            data: {
                id:id
            }
        }).done(function(data){
            if(data.status == 1){
                $tip_ct.operTip(data.msg || "操作成功!",{theme: "success",dir:'left',css:{'white-space':'nowrap'}});
                setTimeout(renderTable,1000);
            }else{
                $tip_ct.operTip(data.msg || "操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
            }
        }).fail(function(e){
            $tip_ct.operTip("操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
        });
    });
});
