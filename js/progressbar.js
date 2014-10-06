/**
 * Created by Viet Nguyen on 6/10/2014.
 */
/*global $:false, Backbone:false, Raphael:false, jQuery:false, document:false, window:false,console:false, clearTimeout:false, setTimeout:false */
/*jslint plusplus: true */
//Jquery plugin - smartresize to prevent resize fires twice
(function ($, sr) {
    "use strict";
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap) {
                    func.apply(obj, args);
                }
                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }

            timeout = setTimeout(delayed, threshold || 100);
        };
    };
    // smartresize
    jQuery.fn[sr] = function (fn) { return fn ? this.bind("resize", debounce(fn)) : this.trigger(sr); };

})(jQuery, "smartresize");

//$(function () {
var ProgressBarModel = Backbone.Model.extend({
    url: "progress",
    defaults: function () {
        "use strict";
        return {
            progress: 50,
            elementId: ""
        };
    },
    change: function (value) {
        "use strict";
        var progress = this.get("progress");
        progress = progress + value;
        this.save({
            progress: Math.max(0, this.progress)
        });
    }
}), ProgressBarView = Backbone.View.extend({    //Progress Bar View
    tagName: 'div',
    render: function () {
        "use strict";
        var elementId = this.model.get("elementId");
        this.$el.attr({id: elementId, class: "progressBars"});
        return this;
    }
}), AppView = Backbone.View.extend({
    pbs: {},
    drawBar: function (elementId) {
        "use strict";
        var pbs = this.pbs[elementId],
            progress = pbs.model.get("progress"),
            width = progress * pbs.r.width / 100,
            color = progress > 100 ? "red" : "lightblue";
        pbs.bar = pbs.r.rect(0, 1, width, 40).attr({fill: color, "stroke-width": 0});
        pbs.txt = pbs.r.text("50%", "60%", progress + "%").attr({"font-size": "12px"});
    },
    showProgress: function (elementId, changeValue) {
        "use strict";
        var width, color, animateTime, widthNewProgress,
            selectProgressBar = this.pbs[elementId],
            currProgress = selectProgressBar.model.get("progress"),
            newProgress = currProgress + changeValue;
        newProgress = Math.max(newProgress, 0);
        if (newProgress !== currProgress) {
            selectProgressBar.model.set({"progress": newProgress});
            color = newProgress > 100 ? "red" : "lightblue";
            widthNewProgress = Math.min(100, newProgress);   //Limit the bar to max 100% width
            width = widthNewProgress * selectProgressBar.r.width / 100;

            animateTime = Math.abs(changeValue) * 10;
            selectProgressBar.bar.animate({width: width, fill: color}, animateTime, "linear");
            selectProgressBar.txt.attr({"text": newProgress + "%"});
        }
    },
    initialize: function () {
        "use strict";
        var i, elementId, model, newPBV, r;
        for (i = 1; i < 4; i++) {
            elementId = "progress" + i;
            if (this.pbs.hasOwnProperty(elementId)) {
                r = this.pbs[elementId].r;
                r.clear();
                r.remove();
                this.pbs[elementId].r = new Raphael(document.getElementById(elementId), $("#" + elementId).width(), 40);
                r = this.pbs[elementId].r;
                r.rect(0, 0, r.width, 40).attr({"stroke": "#CCC", "stroke-width": 1});
                this.drawBar(elementId);
            } else {
                model = new ProgressBarModel({
                    elementId: elementId
                });
                newPBV = new ProgressBarView({
                    model: model
                });
                $("#progressBarsHolder").append(newPBV.render().el);
                this.r = new Raphael(document.getElementById(elementId), $("#" + elementId).width(), 42);
                this.r.rect(0, 0, this.r.width, 40).attr({"stroke": "#CCC", "stroke-width": 1});
                //init progress bar
                this.pbs[elementId] = {
                    model: model,
                    bar: null,
                    txt: null,
                    r: this.r
                };
                this.drawBar(elementId);
            }
        }
    }

}), app = new AppView(), ControlView = Backbone.View.extend({    //Button view - defined click event
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

$(window).smartresize(function () {
    "use strict";
    app.initialize();
});
//});