var NormalizationDemo = function() {
    var id = "#normalizationDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.init();
};

NormalizationDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new VectorObject(new THREE.Vector3(1,1,0));
        this.B = new VectorObject(this.A.vector.clone().normalize(), { color: "#ff00ff" });

        this.Alabel = new Label("A");
        this.Blabel = new Label("B");

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.B.vector;
        this.html.Bspan.html("(" + this.B.vector.x.toFixed(3) + ", " + this.B.vector.y.toFixed(3) + ")");

        this.Alabel.position.set(1,1,0);
        var mag = this.Alabel.position.length();
        this.Alabel.position.multiplyScalar((mag+.4)/mag);

        this.Blabel.position.copy(this.B.vector);
        this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);

        this.scene.add(this.Alabel);
        this.scene.add(this.Blabel);

        this.scene.add(this.B);
        this.scene.add(this.A);

        this.renderer.render( this.scene, this.camera );
    },

    touchMoved: function(i,v) {
        v.x = Math.round(v.x*10)/10;
        v.y = Math.round(v.y*10)/10;

        this.A.updateVector(v);
        var magnitude = v.length();
        this.Alabel.position.copy(v);
        if(magnitude <= 1) {
            this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/6);
        } else {
            this.Alabel.position.multiplyScalar((magnitude+.4)/magnitude);
        }
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        this.B.updateVector(v.clone().normalize());
        this.Blabel.position.copy(this.B.vector);
        this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);

        var x = v.x.toFixed(1);
        var y = v.y.toFixed(1);
        var length = v.length().toFixed(3);

        var xnorm = this.B.vector.x.toFixed(3);
        var ynorm = this.B.vector.y.toFixed(3);

        if(length == 0) {
            this.html.Bspan.html("undefined");
            this.html.eq1.html("\\[=\\frac{(" + x + ", " + y + ")}{" + length + "}\\]");
            this.html.eq2.html("\\[=undefined\\]");
            this.html.eq3.html("\\[=\\underline{\\underline{undefined}}\\]");
        } else {
            this.html.Bspan.html("(" + this.B.vector.x.toFixed(3) + ", " + this.B.vector.y.toFixed(3) + ")");
            this.html.eq1.html("\\[=\\frac{(" + x + ", " + y + ")}{" + length + "}\\]");
            this.html.eq2.html("\\[=\\left(\\frac{" + x + "}{" + length + "},\\frac{" + y + "}{" + length + "}\\right)\\]");
            this.html.eq3.html("\\[=\\underline{\\underline{(" + xnorm + "," + ynorm + ")}}\\]");
        }

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

        this.renderer.render( this.scene, this.camera );
    },
});
