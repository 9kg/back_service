//table
function Table(opt){
    this.info = "显示 start ~ end 条，共 num 条记录";      //当前展示记录数量信息
    this.info_nodata = "暂无数据";                       //当前展示记录数量信息
    this.url = '';                                      //获取数据的地址（通过传参获得）
    this.pageSizes = [10,20,50,100];                    //可供分页的页码
    this.$ct = $('.content');                           //当前容器
    this.$el = $('<table class="table">');              //当前表格
    this.page = true;                                   //是否分页（默认分页）
    this.isLocal = false;                               //是否本地处理
    this.footerFix = false;                             //分页组件悬浮（默认否）
    this.pageTotal = 0;                                 //总页数（ajax拿取数据后计算并更新）
    this.total = 0;                                     //总记录数（ajax拿取数据后更新）
    this.data = null;                                   //当前表格数据
    this.theme = "default";                             //主题（样式）
    this.timeout_fv = 900;                              //搜索文本框的延时搜索
    this.time_fv = 0;                                   //搜索文本框的timeout记录
    this.delay_mask_time = 500;                         //响应时间过长显示mask等待框
    this.tip_content = "数据加载中。。。";                 //表格加载提示内容
    this.fnAfterData = $.noop;                          //获取数据后函数
    this.fnAfterRender = $.noop;                        //render后函数
    this.fnAfterLocalFilter = $.noop;                   //本地搜索后函数
    this.sendData = {
        oper_type: 'query',//后台只提供一个接口的情况下，对应查询操作
        page_size: 10,     //每页显示记录数
        cur_page: 1,       //当前页数
        sort: '',          //需要排序的字段
        sort_dir: 'asc',   //排序规则，正序(asc)或者倒序(desc)
        filter_key: '',    //需要检索的字段
        filter_val: ''     //检索的内容
    };                                                  //发送给后台的数据

    this.init(opt);
};
Table.prototype = (function(){
    var init = function(opt){

        $.extend(true, this, opt);

        this.mask = new Mask({
            isShow: false,
            $ct: this.$ct,
            content: this.tip_content
        });                                             //当前表格的遮罩

        if(!this.sendData.sort){
            this.sendData.sort = this.col[0].key
        }
        !this.page && (this.sendData.page_size = undefined);
        if(this.isLocal){
            this.timeout_fv = 0;                        //本地处理时 将检索文本框的延时时间置零
        }
        this.$ct.append(this.renderFilter());
        this.render();
        this.addEvent();
    },render = function(){
        var that = this;
        var s_data = that.sendData;

        if(!this.isLocal){
            this.getData(function(){
                _renderHtml(that,that.data);
            });
        }else{
            if(this.data === null){
                this.getData(function(){
                    _render_local(that);
                });
            }else{
                _render_local(that);
            }
        }
        this.fnAfterRender();
    },_render_local = function(that){
        var s_data = that.sendData;
        // 检索
        var data = $.map(that.data,function(item){
            if(~(''+item[s_data.filter_key]).indexOf(s_data.filter_val)){
                return item;
            }
        });
        var _total = data.length;
        // 排序
        data.sort(function(a,b){
            var aSort = a[s_data.sort];
            var bSort = b[s_data.sort];
            var isAsc = s_data.sort_dir === "asc" ? 1 : -1;
            if(aSort == +aSort &&  bSort == +bSort){
                return ((aSort - bSort > 0) ? 1 : -1)*isAsc;
            }else{
                return (''+aSort).localeCompare(''+bSort)*isAsc;
            }
        });
        that.fnAfterLocalFilter(data);
        // 分页
        var renderData = s_data.page_size ? data.splice((s_data.cur_page - 1)*s_data.page_size, s_data.page_size) : data;

        if(s_data.filter_val){

        }
        var tObj = {data:that.data};
        s_data.filter_val && (tObj.total = _total);
        that.clacTotal(tObj);
        // 渲染
        if(!that.page){
            var _tip = _total ? '共 '+_total+' 条记录' : '无数据';
            var $total = that.$ct.find('.table_filter .page_size');
            !$total.length ? ($total = $('<div class="page_size">'+_tip+'</div>').prependTo(that.$ct.find('.table_filter'))) : $total.text(_tip);
        }
        _renderHtml(that,renderData);
    },_renderHtml = function(that,data){
        var oldClass = that.$el[0].className.split(' ');
        var newClass = $.map(oldClass,function(item){
            if(item.slice(0,12) !== 'table_theme_'){
                return item;
            }
        }).join(' ');
        that.$el[0].className = newClass;
        that.theme !== "default" && that.$el.addClass('table_theme_'+that.theme);

        $('.table_filter',that.$ct).after(that.$el);

        that.renderTh();
        that.renderTd(data);

        if(that.page){
            var $foot = that.$ct.find('.table_foot');
            $foot.length ? $foot.replaceWith(that.renderFoot()) : that.$ct.append(that.renderFoot());
        }
    },getData = function(fn){
        var that = this;
        var maskTimeout = setTimeout(function(){
                        that.mask.show();
                    },that.delay_mask_time);

        var s_data = {};
        if(this.isLocal){
            $.extend(true,s_data,that.sendData);
            s_data.page_size = s_data.cur_page = s_data.sort = s_data.sort_dir = s_data.filter_key = s_data.filter_val = undefined;
        }else{
            s_data = that.sendData;
        }
        $.ajax({
            url: this.url,
            dataType: "json",
            data: s_data
        }).done(function(data) {
            if(data && data.status === 1){
                that.fnAfterData(data);
                that.clacTotal(data);
                fn && fn();
            }else{
                that.$ct.find(".table_filter").operTip((data && data.msg) || "返回数据异常",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
            }
        }).fail(function(e){
            console.dir(e);
            that.$ct.find(".table_filter").operTip("程序发生错误",{dir:'bottom',theme: 'danger',timeout: 5000,css:{'white-space':'nowrap'}});
        }).always(function(){
            clearTimeout(maskTimeout);
            that.mask.hide();
        });
    },renderData = function(fn){
        fn && fn();
        this.clacTotal({data:this.data});
        this.render();
    },clacTotal = function(data){
        this.data = data.data;
        this.total = data.total === undefined ? this.data.length : data.total;
        this.pageTotal = Math.ceil(this.total/this.sendData.page_size) || 1;
        if(this.sendData.cur_page > this.pageTotal){
            this.sendData.cur_page = this.sendData.cur_page - 1;
        }
    },renderFilter = function() {
        var filter_ct = $('<div class="table_filter">'
                    +'</div>');
        if(this.page){
            var filter_page_size = $('<div class="page_size">'
                                        +'每页显示'
                                        +'<select name="page_size">'
                                        +'</select>'
                                        +'条'
                                    +'</div>');
            base.renderOption($('[name="page_size"]',filter_page_size),this.pageSizes);
            filter_page_size.find('option[value="'+this.sendData.page_size+'"]').prop("selected",true);
            filter_ct.append(filter_page_size);
        }
        var filterOpt = $.map(this.col, function(n) {
                            if (n.filter) {
                                return {
                                    key: n.key,
                                    val: n.title
                                };
                            }
                        });
        if(filterOpt.length){
            var filter_key = $('<div class="ct_2 filter_key">'
                                +'<select name="filter_key">'
                                +'</select>'
                            +'</div>');
            var filter_val = $('<div class="ct_2 filter_val">'
                                +'<input type="text" name="filter_val">'
                            +'</div>');
            base.renderOption($('[name="filter_key"]',filter_key),filterOpt);
            !this.sendData.filter_key && (this.sendData.filter_key = filterOpt[0].key);
            $('[name="filter_key"]',filter_key).find('option[value="'+this.sendData.filter_key+'"]').prop("selected",true);
            $('[name="filter_val"]',filter_val).val(this.sendData.filter_val);
            filter_ct.append(filter_key,filter_val);
        }
        return filter_ct;
    },renderTh = function() {
        var that = this;
        var tr = $("<tr>");
        var ths = $.map(this.col, function(n) {
            if(n.show !== false){
                var th = $("<th>").html(n.title);
                th.addClass(n.cls).css("width",n.width);
                if (n.sort) {
                    if (n.key === that.sendData.sort) {
                        th.addClass("sort_" + that.sendData.sort_dir);
                    } else {
                        th.addClass("sort");
                    }
                }
                return th[0];
            }
        });
        tr.append(ths);
        this.$el.html($("<thead>").append(tr));
    },renderTd = function(data) {
        var $this = this;
        var trs = $.map(data, function(m) {
            var tr = $("<tr>");
            var tds = $.map($this.col, function(n) {
                if(n.show !== false){
                    var td = $("<td>");
                    n.cls && td.addClass(n.cls);
                    if (n.render) {
                        n.render(td,m[n.key],tr,m);
                    } else {
                        td.html(m[n.key]);
                    }
                    return td[0];
                }
            });
            tr.append(tds);
            return tr;
        });
        var $nodata = this.$ct.find(".table_no_data");
        if(!trs.length){
            $nodata.length ? $nodata.show() : this.$el.after($('<div class="table_no_data">暂无数据</div>'));
        }else{
            $nodata.hide();
        }
        if(this.footerFix){
            this.$el.nextAll(".table_no_data").css("margin-top","-45px");
        }
        this.$el.append($("<tbody>").append(trs));
    },renderFoot = function(){
        var foot = $("<div>").addClass("table_foot");
        if(this.footerFix){
            foot.addClass("foot_fix");
            this.$el.css("margin-bottom","45px");
        }

        var info = this.renderInfo();
        var buttons = this.renderButton(); 

        foot.append(info,buttons);

        return foot;
    },addEvent = function(){
        var that = this;
        this.$ct.on("click",".sort,.sort_asc,.sort_desc",function(){
            var title = $.trim($(this).text());
            $.each(that.col,function(i,item){
                if(item.title === title){
                    that.sendData.sort = item.key;
                }
            });
            that.sendData.sort_dir = $(this).is('.sort_asc') ? 'desc' : 'asc';
            that.render();
        }).on("change",'[name="page_size"]',function(){
            that.sendData.page_size = $(this).val();
            that.sendData.cur_page = 1;
            that.render();
        }).on("keyup",".cur_page",function(){
            var thisVal = $(this).val();
            var invalid = thisVal == that.sendData.cur_page || !base.isPosInt(thisVal) || thisVal == 0 || thisVal > that.pageTotal;

            $(this).validate(!invalid || thisVal == that.sendData.cur_page,"请输入合法页码");
            $('.page_goto',that.$ct).toggleClass("active",invalid);
        }).on("keydown",".cur_page",function(e){
            if(e.keyCode === 13 && !$('.page_goto',that.$ct).is(".active")){
                $('.page_goto',that.$ct).trigger("click");
            }
        }).on("click",'.page_first,.page_last,.page_prev,.page_next,.page_goto',function(){
            if($(this).is('.active')){
                return false;
            }
            if($(this).is(".page_first")){
                that.sendData.cur_page = 1;   
            }else if($(this).is(".page_last")){
                that.sendData.cur_page = that.pageTotal;   
            }else if($(this).is(".page_prev")){
                that.sendData.cur_page -= 1;   
            }else if($(this).is(".page_next")){
                that.sendData.cur_page += 1;   
            }else if($(this).is(".page_goto")){
                that.sendData.cur_page = +$('.cur_page',that.$ct).val();   
            }
            that.render();
        }).on("change",'[name="filter_key"]',function(){
            that.sendData.filter_key = $(this).val();
            if(that.sendData.filter_val !== ""){
                that.sendData.cur_page = 1;
                that.render();
            }
        }).on("keyup",'[name="filter_val"]',function(){
            var thisVal = $(this).val();
            if(that.sendData.filter_val === thisVal){
                return;
            }
            that.time_fv && clearTimeout(that.time_fv);
            that.time_fv = setTimeout(function(){
                that.sendData.filter_val = thisVal;
                that.sendData.cur_page = 1;
                that.render();
            },that.timeout_fv);
        });
    },renderInfo = function(){
        var start = (this.sendData.cur_page-1)*this.sendData.page_size+1;
        var end = Math.min(this.sendData.cur_page*this.sendData.page_size,this.total);
        var info = this.info.replace("start",start).replace("end",end).replace("num",this.total);
        if(end === 0){
            info = this.info_nodata;
        }
        return $("<div>").addClass("table_info ct_5-2").text(info);
    },renderButton = function(){
        var div = $("<div>").addClass("table_btns ct_5-3");
        var button = $("<button>").attr("type","button").addClass("btn btn_info_outline");
        var isFirst = this.sendData.cur_page === 1;
        var isLast = this.sendData.cur_page === this.pageTotal;
        var firstButton = button.clone().addClass("page_first").text("首页").toggleClass("active",isFirst);
        var lastButton = button.clone().addClass("page_last").text("末页").toggleClass("active",isLast);
        var prevButton = button.clone().addClass("page_prev").text("上一页").toggleClass("active",isFirst);
        var nextButton = button.clone().addClass("page_next").text("下一页").toggleClass("active",isLast);
        var gotoButton = button.clone().addClass("page_goto active").text("跳至");
        var cur_page = $('<label><input class="cur_page" type="text" value="'+this.sendData.cur_page+'">页</label>');
        div.append([firstButton,prevButton,gotoButton,cur_page,nextButton,lastButton]);

        return div;
    };
    return {
        init: init,
        getData: getData,
        render: render,
        renderFilter: renderFilter,
        renderData: renderData,
        clacTotal: clacTotal,
        renderTh: renderTh,
        renderTd: renderTd,
        renderFoot: renderFoot,
        addEvent: addEvent,
        renderInfo: renderInfo,
        renderButton: renderButton,
    }
})();