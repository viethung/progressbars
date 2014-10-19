describe("Testing Progress Bars", function() {
    beforeEach(function(done){
        setTimeout(function() {
            done();
        }, 100);
    });

    it("app to be defined", function(){
        expect(app).toBeDefined();
    });

    it("collection to be defined and has 4 elements", function() {
        expect(app.collection).toBeDefined();
        expect(app.collection.length).toEqual(4);
    });

    it("init models values 125, 45, 50 and 15", function() {
        expect(app.collection.models[0].get("progress")).toEqual(125);
        expect(app.collection.models[1].get("progress")).toEqual(45);
        expect(app.collection.models[2].get("progress")).toEqual(50);
        expect(app.collection.models[3].get("progress")).toEqual(15);
    });

    describe("Can't go under 0 - last model progress is 15, subtract 25, the result is 0", function() {
        it("decrease all by 25, expect results will be 100, 20, 25 and 0", function() {
            app.collection.each(function(model) {
                app.showProgress(model.get("id"), -25);
            });
            expect(app.collection.models[0].get("progress")).toEqual(100);
            expect(app.collection.models[1].get("progress")).toEqual(20);
            expect(app.collection.models[2].get("progress")).toEqual(25);
            expect(app.collection.models[3].get("progress")).toEqual(0);
        });
    });

    it("decrease all models by 10, expect results now will be 90, 10, 15 and 0", function() {
        app.collection.each(function(model) {
            app.showProgress(model.get("id"), -10);
        });
        expect(app.collection.models[0].get("progress")).toEqual(90);
        expect(app.collection.models[1].get("progress")).toEqual(10);
        expect(app.collection.models[2].get("progress")).toEqual(15);
        expect(app.collection.models[3].get("progress")).toEqual(0);
    });

    it("decrease all models by 25, expect results now will be 65, 0, 0 and 0", function() {
        app.collection.each(function(model) {
            app.showProgress(model.get("id"), -25);
        });
        expect(app.collection.models[0].get("progress")).toEqual(65);
        expect(app.collection.models[1].get("progress")).toEqual(0);
        expect(app.collection.models[2].get("progress")).toEqual(0);
        expect(app.collection.models[3].get("progress")).toEqual(0);
    });

    it("increase all models by 25, expect results now will be 90, 25, 25 and 25", function() {
        app.collection.each(function(model) {
            app.showProgress(model.get("id"), 25);
        });
        expect(app.collection.models[0].get("progress")).toEqual(90);
        expect(app.collection.models[1].get("progress")).toEqual(25);
        expect(app.collection.models[2].get("progress")).toEqual(25);
        expect(app.collection.models[3].get("progress")).toEqual(25);
    });

    it("increase all models by 25 again, expect results now will be 115, 50, 50 and 50", function() {
        app.collection.each(function(model) {
            app.showProgress(model.get("id"), 25);
        });
        expect(app.collection.models[0].get("progress")).toEqual(115);
        expect(app.collection.models[1].get("progress")).toEqual(50);
        expect(app.collection.models[2].get("progress")).toEqual(50);
        expect(app.collection.models[3].get("progress")).toEqual(50);
    });

    it("Can go over 100, but limit the bar itself and change its colour", function(){
        app.collection.each(function(model) {
            var currProgress = model.get("progress");
            if (currProgress > 100) {
                var newBar = new ProgressBarView({model: model});
                expect(newBar.render().el.innerHTML).toContain("red");
                expect(newBar.render().el.innerHTML).toContain("left:0%");
            }
        });
    })

    it("Progress less than 100 and css left has to be 100 - progress", function(){
        app.collection.each(function(model) {
            var currProgress = model.get("progress");
            if(currProgress > 0 && currProgress <= 100) {
                var newBar = new ProgressBarView({model: model});
                expect(newBar.render().el.innerHTML).toContain("left:-"+(100 - currProgress)+"%");
            }
        });
    });

    describe("Make progress 3 to 0", function() {
        it("decrease by 75, expect result is 0", function() {
            var model = app.collection.models[2];
            var id = model.get("id")
            app.showProgress(id, -75);
            expect(model.get("progress")).toEqual(0);
        });

        it("Progress 3 is 0, so it does not has red and has left:-100%", function(){
            var model = app.collection.models[2];
            var newBar = new ProgressBarView({model: model});
            expect(newBar.render().el.innerHTML).not.toContain("red");
            expect(newBar.render().el.innerHTML).toContain("left:-100%");
        });
    });

    describe("Make progress 4 larger than 100", function() {
        it("increase last model by 25 3 times, expect result is 125", function() {
            var model = app.collection.models[3];
            var id = model.get("id")
            app.showProgress(id, 25);
            app.showProgress(id, 25);
            app.showProgress(id, 25);
            expect(model.get("progress")).toEqual(125);
        });

        it("Last model progress is 125, so it has red and left:0%", function(){
            var model = app.collection.models[3];
            var newBar = new ProgressBarView({model: model});
            expect(newBar.render().el.innerHTML).toContain("red");
            expect(newBar.render().el.innerHTML).toContain("left:0%");
        });
    });

    describe("Spy On btnClickFunc", function() {
        it("#selectBar exist and has a value progress1", function() {
            expect($("#selectBar")).toBeDefined();
            expect($("#selectBar").val()).toContain("progress1");
        });
        it("First button click, expect first bar progress is 90%", function(){
            $("button:first").click();
            expect(app.collection.models[0].get("progress")).toEqual(90);
        });
    });

    describe("Test windows resize", function() {
        it("Call smart resize, expect first model progress still 90", function() {
            $(window).smartresize(app.render());
            expect(app.collection.models[0].get("progress")).toEqual(90);
        })
    });
});