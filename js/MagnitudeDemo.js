var MagnitudeDemo = function() {
    var id = "#magnitudeDemo"
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Avector = $(id + " .A");
    this.html.Ax = $(id + " .Ax");
    this.html.Ay = $(id + " .Ay");
    this.html.Amag = $(id + " .Amag");
    this.html.eq1 = $(id + " .eq1");
    this.html.answer = $(id + " .answer");
    this.init();
};

MagnitudeDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new VectorObject(new THREE.Vector3(1,1,0));

        this.Alabel = new Label("A");

        var v = this.A.vector;
        this.html.Avector.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        this.html.Ax.html(v.x.toFixed(1));
        this.html.Ay.html(v.y.toFixed(1));
        this.html.Amag.html(v.length().toFixed(3));

        this.Alabel.position.set(1,1,0);
        var mag = this.Alabel.position.length();
        this.Alabel.position.multiplyScalar((mag+.4)/mag);

        this.scene.add(this.Alabel);

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
        this.html.Avector.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        this.html.Ax.html(v.x.toFixed(1));
        this.html.Ay.html(v.y.toFixed(1));
        this.html.Amag.html(v.length().toFixed(3));

        this.html.eq1.html("\\[=\\sqrt{(" + v.x.toFixed(1) + ")^2+(" + v.y.toFixed(1) + ")^2}\\]");
        this.html.answer.html("\\[=\\underline{\\underline{" + v.length().toFixed(3) + "}}\\]");

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);


        this.renderer.render( this.scene, this.camera );
    },
});
