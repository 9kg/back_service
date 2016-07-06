$(function(){
    //another form menu
    $('.toggle_another_form').on('click', function() {
        $('.sidebar').toggleClass('another_form');
        localStorage.setItem('another_form',$('.sidebar').is(".another_form"));
        $(window).resize();
    });
    if(localStorage.getItem('another_form') === "true" && $(window).width() > 768){
        setTimeout(function(){
            $('.toggle_another_form').trigger("click");
        },0)
    }

    //buttons
    $("body").on("click",".buttons .btn",function(){
        $(this).next("ul").show();
    }).on("click",".buttons ul li",function(e){
        var text = $(this).text();
        var ul = $(this).closest("ul");
        ul.prev(".btn").text(text);
        $(this).closest("ul").hide();
        e.preventDefault();
    });

    // toTop
    var scrollTimeout = 0;
    var toggleToTopBtn = function(){
        var $top = $("#to_top");
        !$top.length && ($top = $('<div id="to_top"><i class="iconfont icon-60e"></i></div>').appendTo($('body')));
        var topVal = $(window).scrollTop();
        $top.toggleClass("show",topVal > 300);
    };
    toggleToTopBtn();
    $(window).scroll(function(){
        scrollTimeout && clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleToTopBtn,100);
    });
    $("body").on("click","#to_top",function(){
        $('body,html').animate({ scrollTop: 0 }, 500);
    });

    // single control show-hidden
    $('body').on("change",":radio,[data-show]:checkbox,select",function(e){
        var type = $(this).attr("type");
        var check = $(this).is("select") ? "selected" : "checked";
        var name = $(this).attr("name");

        if(type === "checkbox"){
            var show = $(this).attr("data-show");
            $(show).toggleClass("hidden",!$(this).prop(check));

            $(show).find(":input").add($(show).filter(":input.hidden")).prop("disabled",true);
            $(show).find(":input").not(".hidden :input,:input.hidden").add($(show).filter(":input").not(".hidden")).prop("disabled",false);
        }else{
            var $controls = type === "radio" ? $('[name="'+name+'"][data-show]') : $('option[data-show]',this);
            $controls.each(function(){
                var show = $(this).attr("data-show");
                $(show).toggleClass("hidden",!$(this).prop(check));

                $(show).find(":input").add($(show).filter(":input.hidden")).prop("disabled",true);
                $(show).find(":input").not(".hidden :input,:input.hidden").add($(show).filter(":input").not(".hidden")).prop("disabled",false);
            });
        }
    });

    // 给所有表单页长字段模拟title
    $('body').on("mouseenter",".field>.nowrap",function(){
        if($(this).data("titled")){
            return;
        }
        $(this).toTitle($(this).closest(".field"));
        $(this).data("titled",true);
    });
    $('body').on("mouseenter","[data-title]",function(){
        if($(this).data("titled")){
            return;
        }
        $(this).toTitle($(this),{dir: null});
        $(this).data("titled",true);
    });

    // 模拟title
    $.fn.toTitle = function(container,other){
        var paramObj = {
            $ct: container,
            content: $(this).attr("data-title") || $.trim($(this).text()),
            timeout: 1200,
            dir: 'bottom',
            type: 'hover',
            css: {
                padding: "5px",
                "box-shadow": "none",
            },
            noClose: true
        };
        if($.type(other) === "object"){
            $.extend(true, paramObj, other);
        }else if($.type(other) === "number"){
            paramObj.timeout = +other;
        }else if($.type(other) === "string"){
            paramObj.theme = other;
        }
        new Tip(paramObj);
    };

    // 小提示
    $.fn.operTip = function(content,other){
        var _$ct = $(this);
        while(_$ct.css("overflow") === "hidden" && !_$ct.is('body')){
            _$ct = _$ct.parent();
        }
        var paramObj = {
            $ct: _$ct,
            timeout: 2000,
            noClose: true,
            content: content,
            css: {
                padding: "5px",
                "box-shadow": "none",
            }
        };
        if($.type(other) === "object"){
            $.extend(true, paramObj, other);
        }else if($.type(other) === "number"){
            paramObj.timeout = +other;
        }else if($.type(other) === "string"){
            paramObj.theme = other;
        }
        new Tip(paramObj);
        return this;
    };

    // 验证
    $.fn.validate = function(condition,tip,other){
        $.isFunction(condition) && (condition = condition.call(this));
        $(this).toggleClass("invalid",!condition);
        var paramObj = {isShow: !condition,dir:'top',theme: 'danger',timeout: 3000,css:{'white-space':'nowrap'}};
        $.extend(true, paramObj, other);
        $(this).parent().operTip(tip,paramObj);
        return condition;
    };

    // 日期控件
    $.fn.datepicker = function(opt){
        var option = {
            $ct: $(this).parent(),
            $toInput: $(this),
            isShow: false
        };
        $.extend(true, option, opt);
        return new Datepicker(option);
    };

    $("body").on("keyup","[data-validate]",function(){
        var condition=true,tip,types = $(this).attr('data-validate');
        types && (types = types.split(','));
        var val = $(this).val();
        for(var i=0; i<types.length; i++){
            if(!condition){
                break;
            }
            switch(types[i]){
                case 'require': tip = "该字段必填！",condition = !!val; break;
                case 'num': tip = "请输入数字！",condition = base.isNum(val); break;
                case 'int': tip = "请输入整数！",condition = base.isInt(val); break;
                case '+': tip = "请输入大于0的数字！",condition = val > 0; break;
                case '-': tip = "请输入小于0的数字！",condition = val < 0; break;
                case '!-': tip = "请输入不小于0的数字！",condition = val >= 0; break;
                case '!+': tip = "请输入不大于0的数字！",condition = val <= 0; break;
                default: tip = "您的输入有误！",condition = base.isNum(val);
            };
        }
        var dir = $(this).attr('data-validate-dir') || 'top';
        $(this).validate(condition,tip,{dir:dir});
    });

    //表格中全选
    $('body').on('change', '[type="checkbox"]', function(){
        var $table = $(this).closest('table');
        var $check_one = $table.find('td [type="checkbox"]');
        var $check_all = $table.find('th [type="checkbox"]');
        if($(this).closest('th,td').is('th')){
            $check_one.prop('checked', $(this).prop('checked'));
        }else{
            $check_all.prop('checked', $check_one.filter(':checked').length === $check_one.length);
        }
    });

    // suggest下拉列表
    $.fn.suggest = function(opt){
        var key = opt.key;
        var val = opt.val;
        var $key_ct = opt.$key_ct;
        var $val_ct = opt.$val_ct;
        var url = opt.url;
        var suggest_data = opt.data || {};

        $(this).css('position', 'relative');
        $val_ct.attr('autocomplete', 'off');
        var suggest_list = $('<ul class="suggest_list hidden"><li class="data_get"><i class="icon_loading"></i>数据获取中</li></ul>');
        $(this).append(suggest_list);
        if(!$.isEmptyObject(suggest_data)){
            renderSuggestList(suggest_data);
        }else{
            $.ajax({
                url: url,
                dataType: "json"
            }).done(function(data){
                if(data.status == 1){
                    $.each(data.data,function(i,item){
                        suggest_data[item.id] = item.name;
                    });
                    renderSuggestList(suggest_data);
                }else{
                    renderSuggestList();
                }
            }).fail(function(e){
                renderSuggestList();
            });
        }
        function renderSuggestList(data){
            var $lis;
            if(!data){
                $lis = $('<li class="data_error"><i class="iconfont icon-71e"></i>数据获取失败</li>')
            }else if($.isEmptyObject(data)){
                $lis = $('<li class="data_no"><i class="iconfont icon-8a7"></i>无数据</li>')
            }else{
                $lis = $.map(data,function(val,key){
                    return $('<li data-id="'+key+'">'+val+'</li>');
                });
            }
            $('.suggest_list').html($lis);
        }

        var render_time_out;
        var that = this;
        var oper_time = 0;
        $(this).on('click','.suggest_list li',function(){
            if(!$(this).is('.data_get,.data_no,.data_error')){
                $val_ct.val($(this).text()).removeClass('invalid');
                $key_ct.val($(this).data('id'));
                $(this).addClass('active').siblings().removeClass('active');
            }else{
                $val_ct.val('');
                $key_ct.val('');
                renderSuggestList(suggest_data);
            }
            $('.suggest_list',that).addClass('hidden');
            oper_time = +(new Date);
        }).on("focus",$val_ct.selector,function(){
            $('.suggest_list',that).removeClass('hidden');
        }).on("blur",$val_ct.selector,function(){
            setTimeout(function(){
                var key = $key_ct.val();
                if(suggest_data[key] !== $val_ct.val()){
                    if(+(new Date)-300 > oper_time){
                        $('.suggest_list li:first-child',that).trigger('click');
                    }
                }else{
                    $('.suggest_list',that).addClass('hidden');
                }
            },300)
        }).on("keyup",$val_ct.selector,function(){
            if(!$.isEmptyObject(suggest_data)){
                var filter_val = $(this).val();
                render_time_out && clearTimeout(render_time_out);
                render_time_out = setTimeout(function(){
                    var _data = {};
                    $.each(suggest_data,function(key,val){
                        if(~val.indexOf(filter_val)){
                            _data[key] = val;
                        }
                    });
                    renderSuggestList(_data);
                },100);
            }
        });
    }

});