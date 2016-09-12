$(function() {
    var $tip_ct;
    var box = new Box({
        title: "申请打款",
        html: "_HOST_/page/adver_cashed_add .adver_cashed_form",
        css: {
            "min-width": "320px",
            "max-width": "420px",
        },
        fnSure: function(that,fn) {
            var $dockForm = $('form.adver_cashed');
            if (!base.formValidate($dockForm)) {
                return false;
            } else {
                var data = $dockForm.serializeArray();
                $.ajax({
                    url: "_HOST_/finance/adver_cash_request",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        $tip_ct.operTip(data.msg || "操作成功!",{theme: "success",dir:'left',css:{'white-space':'nowrap'}});
                        renderTable();
                    }else{
                        $tip_ct.operTip(data.msg || "操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
                    }
                }).fail(function(e){
                    $tip_ct.operTip("操作失败!",{theme: "danger",dir:'left',css:{'white-space':'nowrap'}});
                });
            }
        },
        fnCancel: function(t) {}
    });
    var opt = {
        $ct: $(".content"),
        col: [{
            key: "name",
            title: "广告主",
            sort: true,
            filter: true
        }, {
            key: "money",
            title: "金额",
            sort: true,
            filter: true
        }, {
            key: "price_all",
            title: "预扣",
            sort: true,
            filter: true
        }],
        isLocal: true,
        url: "_HOST_/finance/adver_cashed"
    };
    if(role === 5 || role === 7){
        opt.col.push({
            key: "id",
            title: "操作",
            width: 60,
            cls: "t_center",
            render: function(a, b) {
                var btn_query = $('<button type="button" class="btn btn_info btn_request" data-id="' + b + '">申请</button>');
                a.append(btn_query);
            }
        });
    }
    window.renderTable = function(){
        adver_cashed_table.data = null;     //将本地数据清空，table控件在render时才会重新发起请求拿数据
                                            //此处更好的做法应该是后台返回我成功添加的这条数据 我塞进本地数据。留作后期优化吧
        adver_cashed_table.render();
    };
    var adver_cashed_table = new Table(opt);
    $('body').on('click','table .btn_request',function(){
        $tip_ct = $(this).parent();
        var id = $(this).data("id");
        box.initContent('_HOST_/page/adver_cashed_add .adver_cashed_form', function() {
            $('form.adver_cashed').prepend($('<input type="hidden" name="id" value="'+id+'"/>'));
            box.show();
        });
    });
});
