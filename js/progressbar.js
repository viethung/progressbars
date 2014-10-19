/**
 * Created by Viet Nguyen on 6/10/2014.
 */
/*global $:false, Backbone:false, Raphael:false, jQuery:false, document:false, window:false,console:false, clearTimeout:false, setTimeout:false */
/*jslint plusplus: true */
var ProgressBarModel = Backbone.Model.extend({
    defaults: function() {
        return {
            id: "",
            progress: 0
        };
    }
}), ProgressBarList = Backbone.Collection.extend({
    model:  ProgressBarModel,
    url:    "data.json"
}), ProgressBarView = Backbone.View.extend({    //Progress Bar View
    tagName: 'div',
    render: function () {
        "use strict";
        this.$el.attr({id: this.model.get("id")}).addClass("progressBars");
        var progress = this.model.get("progress");
        var red = (progress > 100) ? " red":"";
        this.$el.html('<div class="barTitle">'+progress+'%</div>');
        var cssLeft = Math.min(progress - 100, 0);
        var bg = '<div class="barBackground'+red+'" style="left:'+cssLeft+'%">&nbsp;</div>';
        this.$el.append(bg);
        return this;
    }
}), ProgressBarSelectView = Backbone.View.extend({
    tagName: 'option',
    render: function() {
        var elemId = this.model.get("id");
        this.$el.val(elemId).html("#"+elemId);
        return this;
    }
}), MainView = Backbone.View.extend({
    el: "body",
    collection: new ProgressBarList(),
    initialize: function() {
        this.collection.fetch({
            success: function () {
                app.render();
            }
        });
        return this;
    },
    render: function () {
        $("#progressBarsHolder").html("");  //Prepare the bars
        $("#selectBar").html("");           //Prepare select
        this.collection.each(function(model) {
            //Prepare the bars
            var newBarView = new ProgressBarView({model: model});
            $("#progressBarsHolder").append( newBarView.render().el );

            //Prepare select
            var newSelectView = new ProgressBarSelectView({model: model});
            $("#selectBar").append(newSelectView.render().el);
        });
        return this;
    },
    showProgress: function (progressBarSelected, changeValue) {
        this.collection.some(function(model) {
            if (model.get("id") === progressBarSelected) {
                var currProgress = model.get("progress");
                var newProgress = currProgress + changeValue;
                newProgress = Math.max(newProgress, 0); //Make sure it wont be lower than 0%
                model.set({"progress":newProgress});
                var cssLeft = Math.min(newProgress - 100, 0);
                $("#"+progressBarSelected+" > .barBackground").animate({
                    left: cssLeft + "%"
                }, Math.abs(changeValue)*10, "linear");
                if(newProgress > 100) {
                    $("#"+progressBarSelected+" > .barBackground").addClass("red");
                } else {
                    $("#"+progressBarSelected+" > .barBackground").removeClass("red");
                }
                $("#"+progressBarSelected+" > .barTitle").html(newProgress+"%");
                return true;
            }
        });
    }
}), app = new MainView(), ControlView = Backbone.View.extend({    //Button view - defined click event
    el: $("button"),
    events: {
        "click": "btnClickFunc"
    },
    btnClickFunc: function (event) {
        "use strict";
        var progressBarSelected = $("#selectBar").val(),
            changeValue = parseInt($(event.currentTarget).html(), 10);    //value on button face
        app.showProgress(progressBarSelected, changeValue);
    }
}), ctrlView = new ControlView();

$(window).smartresize(app.render());