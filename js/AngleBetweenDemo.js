var AngleBetweenDemo = function() {
    var id = "#angleBetweenDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.init();
};

AngleBetweenDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
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
            }

            var AdotB = this.A.vector.dot(this.B.vector);
            var Amag = this.A.vector.length();
            var Bmag = this.B.vector.length();

            // AdotB/(Amag*Bmag) yields slightly above 1 or slightly below -1
            // for certain vectors, when it really should be exactly 1 and -1.
            // the domain of acos is -1 to 1 so we need to clamp it so it doesn't
            // give us NaN
            //var theta = (Math.acos(AdotB/(Amag*Bmag))*180/Math.PI).toFixed(3);
            var theta = (Math.acos(Math.max(Math.min(AdotB/(Amag*Bmag),1),-1))*180/Math.PI).toFixed(3);

            this.html.eq1.html("\\[=cos^{-1} \\left(\\frac{" + AdotB.toFixed(3) + "}{(" + Amag.toFixed(3) + ")(" + Bmag.toFixed(3) + ")}\\right)\\]");
            if(Amag != 0 && Bmag != 0) {
                this.html.eq2.html("\\[=\\underline{\\underline{" + theta + "^{\\circ}}}\\]");
            } else {
                this.html.eq2.html("\\[=\\underline{\\underline{undefined}}\\]");
            }

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingB = false;
    }
});
