$(function() {
    var $tip_ct;
    // 拒绝提现弹框
    var disagree_box = new Box({
        title: "拒绝提现",
        css: {
            "width": "400px"
        },
        fnSure: function(that,fn) {
            var $form = $('.disagree_form');
            if (!base.formValidate($form)) {
                return false;
            } else {
                var data = {
                    objectId: $('[name="objectId"]',$form).val(),
                    errmsg: $('[name="errmsg"]').val()
                };
                $.ajax({
                    url: "http://192.168.1.211:5211/back/finance/cashout_disagree",
                    type: "POST",
                    dataType: "json",
                    data: data
                }).done(function(data){
                    if(data.status == 1){
                        $tip_ct.operTip((data && data.msg) || "操作成功！",{theme: "success", css:{"white-space": "nowrap",dir: 'left'}});
                        cashout_table.data = null;
                        cashout_table.render();
                    }else{
                        $tip_ct.operTip((data && data.msg) || "操作失败！",{theme: "danger", css:{"white-space": "nowrap",dir: 'left'}});
                    }
                }).fail(function(e){
                    $tip_ct.operTip("操作失败！",{theme: "danger", css:{"white-space": "nowrap",dir: 'left'}});
                });
            }
        },
        fnCancel: function(t) {}
    });

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
            filter: true
        }, {
            key: "alipay_name",
            title: "真实姓名",
            filter: true
        }, {
            key: "objectId",
            title: "操作",
            width: '60',
            render: function(a, b, c, d) {
                a.append($('<button type="button" class="btn btn_info btn_query_detail" data-id="' + d.uid + '">查看</button>'));
                a.append($('<button type="button" class="btn btn_success btn_agree" data-id="' + b + '">同意</button>'));
                a.append($('<button type="button" class="btn btn_danger btn_disagree" data-id="' + b + '">拒绝</button>'));
            }
        }],
        // isLocal: true,
        url: "http://192.168.1.211:5211/back/finance/cashout_query"
    };
    var cashout_table = new Table(opt);
    

    var isAgreeClick = false;
    // 判断是否离开页面
    var pageVisibility = (function() {
        var prefixSupport, keyWithPrefix = function(prefix, key) {
            if (prefix !== "") {
                // 首字母大写
                return prefix + key.slice(0,1).toUpperCase() + key.slice(1);    
            }
            return key;
        };
        var isPageVisibilitySupport = (function() {
            var support = false;
            if (typeof window.screenX === "number") {
                ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
                    if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
                        prefixSupport = prefix;
                        support = true;   
                    }
                });        
            }
            return support;
        })();
        
        var isHidden = function() {
            if (isPageVisibilitySupport) {
                return document[keyWithPrefix(prefixSupport, "hidden")];
            }
            return undefined;
        };
        
        var visibilityState = function() {
            if (isPageVisibilitySupport) {
                return document[keyWithPrefix(prefixSupport, "visibilityState")];
            }
            return undefined;
        };
        return {
            isSupport: typeof isHidden() !== "undefined",
            hidden: isHidden(),
            visibilityState: visibilityState(),
            visibilitychange: function(fn, usecapture) {
                usecapture = undefined || false;
                if (isPageVisibilitySupport && typeof fn === "function") {
                    return document.addEventListener(prefixSupport + "visibilitychange", function(evt) {
                        this.hidden = isHidden();
                        this.visibilityState = visibilityState();
                        fn.call(this, evt);
                    }.bind(this), usecapture);
                }
                return undefined;
            }
        };    
    })();
    pageVisibility.visibilitychange(function() {
        if(!pageVisibility.hidden && isAgreeClick){
            isAgreeClick = false;
            cashout_table.data = null;
            cashout_table.render();
        }
    });

    var mask= new Mask({
        isShow: false,
        $ct: $("body"),
        content: '<button class="btn btn_info_outline btn_pay_ok">支付完成</button>'
    });
    $("body").on("click", ".btn_pay_ok", function() {
        mask.hide();
        cashout_table.data = null;
        cashout_table.render();
    }).on('click','table .btn_query_detail',function(){
        window.open('http://192.168.1.211:5211/back/page/user_detail/'+$(this).data('id'));
    }).on('click','table .btn_agree',function(){
        isAgreeClick = true;
        if(!pageVisibility.isSupport){
            mask.show();
        }
        window.open("http://app2.laizhuan.com/v1/duiba.php?pnowoid=" + $(this).data('id'));
    }).on('click','table .btn_disagree',function(){
        $tip_ct = $(this).parent();
        disagree_box.initContent('<form class="disagree_form">'
                    +'<input type="hidden" name="objectId" value="'+$(this).data('id')+'">'
                    +'<div class="grid_nowrap">'
                        +'<div class="ct_4 field">'
                            +'原因'
                        +'</div>'
                        +'<div class="ct_4-3">'
                            +'<textarea data-validate="require" name="errmsg"></textarea>'
                        +'</div>'
                    +'</div>'
                +'</form>');
        disagree_box.show();
    });
});
