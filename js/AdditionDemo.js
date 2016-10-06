var AdditionDemo = function() {
    var id = "#additionDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.Cspan = $(id + " .C");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.init();
};

AdditionDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new VectorObject(new THREE.Vector3(1,1,0));
        this.B = new VectorObject(new THREE.Vector3(-2,3,0));
        this.C = new VectorObject(this.A.vector.clone().add(this.B.vector), { color: "#ff00ff" });

        this.Agray = new VectorObject(this.A.vector, { color: "#bbbbbb" });
        this.Bgray = new VectorObject(this.B.vector, { color: "#bbbbbb" });

        this.A.add(this.Bgray);

        this.Alabel = new Label("A");
        this.Blabel = new Label("B");
        this.Clabel = new Label("C");

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.B.vector;
        this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.C.vector;
        this.html.Cspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        this.Alabel.position.set(1,1,0);
        var mag = this.Alabel.position.length();
        this.Alabel.position.multiplyScalar((mag+.4)/mag);

        this.Blabel.position.set(-2,3,0);
        mag = this.Blabel.position.length();
        this.Blabel.position.multiplyScalar((mag+.4)/mag);

        this.Clabel.position.set(-1,4,0);
        mag = this.Clabel.position.length();
        this.Clabel.position.multiplyScalar((mag+.4)/mag);

        this.scene.add(this.Alabel);
        this.scene.add(this.Blabel);
        this.scene.add(this.Clabel);

        this.scene.add(this.A);
        this.scene.add(this.B);
        this.scene.add(this.C);

        this.renderer.render( this.scene, this.camera );
    },

    touchBegan: function(i,v) {
        var sqlen1 = v.clone().sub(this.A.vector).lengthSq();
        var sqlen2 = v.clone().sub(this.B.vector).lengthSq();

        if(sqlen1 < sqlen2) {
            this.draggingA = true;
        } else {
            this.draggingB = true;
        }
    },
    touchMoved: function(i,v) {
        if(this.draggingA || this.draggingB) {
            v.x = Math.round(v.x*10)/10;
            v.y = Math.round(v.y*10)/10;

            if(this.draggingA) {
                this.A.updateVector(v);
                this.Agray.updateVector(v);
                var magnitude = v.length();
                this.Alabel.position.copy(v);
                if(magnitude > 0) {
                    this.Alabel.position.multiplyScalar((magnitude+.4)/magnitude);
                }
                this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else {
                this.B.updateVector(v);
                this.Bgray.updateVector(v);
                var magnitude = v.length();
                this.Blabel.position.copy(v);
                if(magnitude > 0) {
                    this.Blabel.position.multiplyScalar((magnitude+.4)/magnitude);
                }
                this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            }

            this.C.updateVector(this.A.vector.clone().add(this.B.vector));
            v = this.C.vector;
            this.html.Cspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            this.Clabel.position.copy(this.C.vector);
            mag = this.Clabel.position.length();
            if(mag > 0) {
                this.Clabel.position.multiplyScalar((mag+.4)/mag);
            }


            var Ax = this.A.vector.x.toFixed(1);
            var Ay = this.A.vector.y.toFixed(1);
            var Bx = this.B.vector.x.toFixed(1);
            var By = this.B.vector.y.toFixed(1);
            var Cx = this.C.vector.x.toFixed(1);
            var Cy = this.C.vector.y.toFixed(1);

            this.html.eq1.html("\\[=((" + Ax + ")+(" + Bx + "),(" + Ay + ")+(" + By + "))\\]");
            this.html.eq2.html("\\[=\\underline{\\underline{(" + Cx + "," + Cy + ")}}\\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingB = false;
    }
});
