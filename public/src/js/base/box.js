function Box(opt){
    this.$ct = $("body");
    this.css = {};
    this.html = "";
    this.isShow = false;
    this.title = "";
    this.animate_time = 300;
    this.footer = true;
    $.extend(true, this, opt);

    this.init();
}
Box.prototype = (function(){
    var init = function(){
        this.$el = $('<div class="box_mask"><div class="box"><div class="box_content"></div></div></div>');

        !this.$ct.is("body") && this.css2nobody();

        this.title && this.initHeader();
        this.footer && this.initFooter();

        this.html && this.initContent();

        this.render();
        this.addEvent();
    },
    css2nobody = function(){
        var $ct = this.$ct;
        var radius = $ct.css("border-radius");
        $ct.css("position") === "static" && $ct.css("position","relative");
        radius !== "0px" && $ct.css("overflow") !== "hidden" && (this.css['border-radius'] = radius);
        this.css.position = "absolute";
    },
    render = function(){
        $(".box",this.$el).css(this.css);
        this.$ct.append(this.$el);

        this.toggle((!this.css.display || this.css.display !== "none") && this.isShow);
    },
    initHeader = function(content){
        var $header = this.$el.find(".box_header");
        this.title = (content || this.title);
        if($header.length){
            $header.text(this.title);
        }else{
            $header = $('<div class="box_header">'+this.title+'</div>');
            $(".box",this.$el).prepend($header);
        }
    },
    initFooter = function(){
        var $footer = $('<div class="box_footer"><button class="btn confirm_sure btn_success">确认</button><button class="btn confirm_cancel btn_danger">取消</button></div>');

        $(".box",this.$el).append($footer);
    },
    initContent = function(content,fn){
        var cnt = content || this.html;
        if($.trim(cnt)[0] === "<"){
            $(".box_content",this.$el).html(cnt);
        }else{
            $(".box_content",this.$el).load(cnt,function(){
                fn && fn();
            });
        }
    },
    addEvent = function(){
        var that = this;
        this.$el.on("click",".confirm_sure",function(){
            var flag = that.fnSure && that.fnSure(that);
            flag !== false && that.hide();
        }).on("click",".confirm_cancel",function(){
            var flag = that.fnCancel && that.fnCancel(that);
            flag !== false && that.hide();
        }).bind("click",function(e){
            !that.footer && that.$el.is(e.target) && that.hide();
        });
    },
    toggle = function(flag){
        this.$el.toggle(flag);
    },
    show = function(){
        this.$el.fadeIn(this.animate_time);
    },
    hide = function(){
        this.$el.fadeOut(this.animate_time);
    };
    return {
        init: init,
        css2nobody: css2nobody,
        render: render,
        initHeader: initHeader,
        initFooter: initFooter,
        initContent: initContent,
        addEvent: addEvent,
        toggle: toggle,
        show: show,
        hide: hide
    }
})();