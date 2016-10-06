var DotProductDemo = function() {
    var id = "#dotProductDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.init();
};

DotProductDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new VectorObject(new THREE.Vector3(1,1,0));
        this.B = new VectorObject(new THREE.Vector3(-2,3,0));

        this.Alabel = new Label("A");
        this.Blabel = new Label("B");

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.B.vector;
        this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        this.Alabel.position.set(1,1,0);
        var mag = this.Alabel.position.length();
        this.Alabel.position.multiplyScalar((mag+.4)/mag);

        this.Blabel.position.set(-2,3,0);
        mag = this.Blabel.position.length();
        this.Blabel.position.multiplyScalar((mag+.4)/mag);

        this.scene.add(this.Alabel);
        this.scene.add(this.Blabel);

        this.scene.add(this.A);
        this.scene.add(this.B);

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
                var magnitude = v.length();
                this.Alabel.position.copy(v);
                this.Alabel.position.multiplyScalar((magnitude+.4)/magnitude);
                this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else {
                this.B.updateVector(v);
                var magnitude = v.length();
                this.Blabel.position.copy(v);
                this.Blabel.position.multiplyScalar((magnitude+.4)/magnitude);
                this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            }

            var Ax = this.A.vector.x.toFixed(1);
            var Ay = this.A.vector.y.toFixed(1);
            var Bx = this.B.vector.x.toFixed(1);
            var By = this.B.vector.y.toFixed(1);

            this.html.eq1.html("\\[=(" + Ax + ") \\cdot (" + Bx + ")+(" + Ay + ") \\cdot (" + By + ")\\]");
            this.html.eq2.html("\\[=\\underline{\\underline{" + this.A.vector.dot(this.B.vector).toFixed(3) + "}}\\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingB = false;
    }
});
