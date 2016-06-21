function Mask(opt){
    this.$ct = $("body");
    this.css = {};
    this.content = "";
    this.timeout = 0;
    this.isShow = true;
    $.extend(true, this, opt);
    
    this.$el = $(this.$ct.find(">.mask")[0] || $('<div class="mask"><div class="mask_box"></div></div>')[0]);

    this.init();
}
Mask.prototype = (function(){
    var init = function(){
        this.$el.is(":hidden") && this.show();
        var hideTimeoutId = this.$el.data("hideTimeoutId");
        hideTimeoutId && clearTimeout(hideTimeoutId);

        !this.$ct.is("body") && this.css2nobody();
        this.content && this.renderContent();
        this.render();
        this.timeout && this.hide(this.timeout);
    },
    css2nobody = function(){
        var $ct = this.$ct;
        var radius = $ct.css("border-radius");
        $ct.css("position") === "static" && $ct.css("position","relative");
        radius !== "0px" && $ct.css("overflow") !== "hidden" && (this.css['border-radius'] = radius);
        this.css.position = "absolute";
    },
    render = function(){
        this.$el.css(this.css);
        this.$ct.append(this.$el);

        this.toggle((!this.css.display || this.css.display !== "none") && this.isShow);
    },
    renderContent = function(content){
        var loading = '<div class="loading"><i></i><i></i><i></i><i></i><i></i></div>';
        var desc = '<p class ="mask_desc">'+(content || this.content)+'</p>';
        var $contentBox = $('<div class="mask_content">'+loading+desc+'</div>');

        $(".mask_box",this.$el).html($contentBox);
    },
    toggle = function(flag){
        this.$el.toggle(flag);
    },
    show = function(){
        this.$el.show();
    },
    hide = function(time){
        var that = this;
        if(!time){
            this.$el.hide();
        }else{
            this.$el.data("hideTimeoutId",setTimeout(function(){
                                            that.$el.hide();
                                        },time));
        }
    };
    return {
        init: init,
        css2nobody: css2nobody,
        render: render,
        renderContent: renderContent,
        toggle: toggle,
        show: show,
        hide: hide
    }
})();