function Tip(opt){
    this.$ct = opt.$ct;             //容器
    this.css = {};                  //自定义css
    this.content = "";              //内容
    this.noClose = false;           //不显示关闭按钮
    this.timeout = 0;               //指定时间后消失,默认0一直显示
    this.isShow = true;             //初始化时是否显示
    this.dir = null;                //方向，默认会给出最佳方向
    this.type = "none";            //触发显示事件
    this.theme = "default";         //primary,info,success,warning,danger,magenta(暂时这么多主题)
    $.extend(true, this, opt);      //----------此行上方参数可配置------------

    this.$el = this.$ct.children(".tip");
    
    this.init();
}
Tip.prototype = (function(){
    var init = function(){
        this.render();
        this.resize();
    },render = function(){
        !this.$el.length && (this.$el = $('<div class="tip"><i class="tip_triangle"></i><p class="tip_content"></p></div>'));
        this.$el.removeClass("tip_primary tip_info tip_success tip_warning tip_danger tip_magenta");
        this.theme !== "default" && this.$el.addClass("tip_"+this.theme);

        this.$ct.css("position") === "static" && this.$ct.css("position","relative");

        this.$el.find(".tip_content").text(this.content);
        this.$el.css(this.css);

        if(!this.css.width && !this.css["min-width"] && !this.css["max-width"] && !this.css["white-space"]){
            this.$el.find(">.tip_content").css("width", this.getBestWidth());
        }

        if(this.alert){
            !this.$el.find('.tip_alert').length && this.$el.append($('<div class="tip_alert"><button class="btn alert_sure btn_success">确认</button></div>'));
        }else if(this.confirm){
            !this.$el.find('.tip_confirm').length && this.$el.append($('<div class="tip_confirm"><button class="btn confirm_sure btn_success">确认</button><button class="btn confirm_cancel btn_danger">取消</button></div>'));
        }else{
            !this.noClose && !this.$el.find('.tip_close').length && this.$el.append($('<i class="iconfont icon-733 tip_close"></i>'));
        }
        
        this.addEvent();

        this.$ct.append(this.$el);
        this.correctPos();

        this.toggle((!this.css.display || this.css.display !== "none") && this.isShow);
    },addEvent = function(){
        var that = this;
        // 此处阻止$el向$ct冒泡
        this.$el.click(function(){
            return false;
        });
        //关闭按钮触发事件
        this.$el.find(".tip_close").click(function(){
            var isHide = that.closefn && that.closefn();
            (isHide === undefined || isHide) && $(this).closest(".tip").hide();
        });
        //alert触发事件
        this.$el.find(".alert_sure").click(function(){
            var isHide = that.alertfn && that.alertfn();
            (isHide === undefined || isHide) && $(this).closest(".tip").hide();
        });
        //confirm触发事件
        this.$el.find(".confirm_sure,.confirm_cancel").click(function(){
            var isHide = that.alertfn && that.alertfn($(this).is(".confirm_sure"));
            (isHide === undefined || isHide) && $(this).closest(".tip").hide();
        });

        var that = this;
        if(this.type === "hover"){
            this.$ct.bind("mouseenter mouseleave",function(e){
                that.toggle(e.type === "mouseenter");
            });
        }else if(this.type === "click"){
            this.$ct.bind(this.type,function(){
                that.show();
            }); 
        }else if(this.type === "none"){
            
        }
    },resize = function(){
        var that = this;
        var resizeTimeout = 0;
        $(window).resize(function() {
            resizeTimeout && clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                                that.correctPos();
                            },100);
        });
    },correctPos = function(){
        var that = this;
        this.$ct.each(function(){
            var $tip = $(this).children(".tip");
            $tip.removeClass("tip_left tip_top tip_right tip_bottom");
            $tip.addClass("tip_"+(that.dir || _getMaxDir($(this))));
        });
    },_getMaxDir = function($ct){
        var $ctLT = $ct.offset();
        var $ctL = $ctLT.left;
        var $ctT = $ctLT.top;
        var $ctR = $(window).width() - $ctL - $ct.outerWidth();
        var $ctB = $(window).height() - $ctT - $ct.outerHeight();

        var dirs = {};
        dirs[$ctL] = "left";
        dirs[$ctT] = "top";
        dirs[$ctR] = "right";
        dirs[$ctB] = "bottom";

        return dirs[Math.max($ctL,$ctT,$ctR,$ctB)];
    },getBestWidth = function(){
        // 因为存在行高，所以正常的取平方根会让元素高宽比等于行高，颠倒高宽,使之略宽。
        var ctLen = this.content.length;
        return Math.round(Math.sqrt(ctLen)*1.5)+"em";
    },toggle = function(flag){
        var isShow = flag === undefined ? this.$el.is(":hidden") : flag;
        isShow ? this.show() : this.hide();
    },show = function(){
        this.$ct.find(".tip").show();

        var hideTimeoutId = this.$el.data("hideTimeoutId");
        hideTimeoutId && clearTimeout(hideTimeoutId);
        this.timeout && this.hide(this.timeout);
    },hide = function(time){
        var that = this;
        if(!time){
            this.$ct.find(".tip").hide();
        }else{
            this.$ct.find(".tip").data("hideTimeoutId",setTimeout(function(){
                                            that.$ct.find(".tip").hide();
                                        },time));
        }
    };
    return {
        init: init,
        render: render,
        addEvent: addEvent,
        correctPos: correctPos,
        getBestWidth: getBestWidth,
        resize: resize,
        toggle: toggle,
        show: show,
        hide: hide,
    }
})();