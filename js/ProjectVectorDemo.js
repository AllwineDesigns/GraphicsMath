var ProjectVectorDemo = function() {
    var id = "#projectVectorDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.Cspan = $(id + " .C");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.html.eq4 = $(id + " .eq4");
    this.init();
};

ProjectVectorDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new VectorObject(new THREE.Vector3(1,3,0));
        this.B = new VectorObject(new THREE.Vector3(-2,3,0));
        var Bunit = this.B.vector.clone().normalize();
        this.Bhat = new VectorObject(Bunit, { color: "#ff00ff" });
        this.C = new VectorObject(Bunit.multiplyScalar(this.A.vector.dot(Bunit)), { color: "#ff00ff" });

        this.Alabel = new Label("A");
        this.Blabel = new Label("B");
        this.Clabel = new Label("C", { color: "#ff00ff" });
        this.Bhatlabel = new Label("B", { color: "#ff00ff" });

        var hat = new Label("^", { color: "#ff00ff" });
        hat.position.x -= .05;
        this.Bhatlabel.add(hat);

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.B.vector;
        this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        v = this.C.vector;
        this.html.Cspan.html(v.x.toFixed(3) + ", " + v.y.toFixed(3));

        this.Alabel.position.copy(this.A.vector);
        var mag = this.Alabel.position.length();
        this.Alabel.position.multiplyScalar((mag+.4)/mag);

        this.Blabel.position.copy(this.B.vector);
        mag = this.Blabel.position.length();
        this.Blabel.position.multiplyScalar((mag+.4)/mag);

        this.Clabel.position.copy(this.C.vector);
        mag = this.C.vector.length();
        this.Clabel.position.applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/12/mag);

        this.Bhatlabel.position.copy(this.B.vector);
        this.Bhatlabel.position.normalize();
        this.Bhatlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/12);

        this.scene.add(this.Bhatlabel);
        this.scene.add(this.Clabel);
        this.scene.add(this.Alabel);
        this.scene.add(this.Blabel);

        this.scene.add(this.Bhat);
        this.scene.add(this.C);
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
                if(magnitude > 0) {
                    this.Alabel.position.multiplyScalar((magnitude+.4)/magnitude);
                }
                this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else {
                this.B.updateVector(v);
                var magnitude = v.length();
                this.Blabel.position.copy(v);
                if(magnitude > 0) {
                    this.Blabel.position.multiplyScalar((magnitude+.4)/magnitude);
                }
                this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

                this.Bhatlabel.position.copy(this.B.vector);
                this.Bhatlabel.position.normalize();
                this.Bhatlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/12);

                this.Bhat.updateVector(v.clone().normalize());
            }

            var Bunit = this.B.vector.clone().normalize();
            this.C.updateVector(Bunit.multiplyScalar(this.A.vector.dot(Bunit)));

            this.Clabel.position.copy(this.C.vector);
            mag = this.C.vector.length();
            this.Clabel.position.applyAxisAngle(new THREE.Vector3(0,0,1),Math.PI/12/mag);

            var C_str = this.C.vector.x.toFixed(3) + ", " + this.C.vector.y.toFixed(3);
            this.html.Cspan.html(C_str);

            var Bnorm = this.B.vector.clone().normalize();
            var Bnorm_str = "(" +  Bnorm.x.toFixed(3) + "," + Bnorm.y.toFixed(3) + ")";
            var dot_str = Bnorm.dot(this.A.vector).toFixed(3);

            this.html.eq1.html("\\[\\hat{\\textbf{B}}=" + Bnorm_str + "\\]");
            this.html.eq2.html("\\[\\textbf{A} \\cdot \\hat{\\textbf{B}}=" + dot_str + "\\]");
            this.html.eq3.html("\\[\\textbf{C}=" + dot_str + " \\cdot " + Bnorm_str + "\\]");
            this.html.eq4.html("\\[=\\underline{\\underline{(" + C_str + ")}}\\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingB = false;
    }
});
