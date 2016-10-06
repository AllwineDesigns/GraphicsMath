var MatrixDemo = function() {
    var id = "#matrixDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.scrollWidget = $(id + " .scrollWidget");
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.xspan = $(id + " .x");
    this.html.yspan = $(id + " .y");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.html.eq4 = $(id + " .eq4");
    this.html.eq5 = $(id + " .eq5");
    this.init();
};

MatrixDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup({ scrollWidget: this.html.scrollWidget[0] });

        this.A = new VectorObject(new THREE.Vector3(1,3,0));
        this.x = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.y = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });

        this.transform = new THREE.Object3D();
        this.transform.matrixAutoUpdate = false;
        this.transform.matrix.set(1,0,0,0,
                                  0,1,0,0,
                                  0,0,1,0,
                                  0,0,0,1);

        this.B = new VectorObject(new THREE.Vector3(1,3,0), { color: "#ff00ff" });

        this.Alabel = new Label("A");
        this.Blabel = new Label("B", { color: "#ff00ff" });
        this.xlabel = new Label("x", { color: "#ff0000" });
        this.ylabel = new Label("y", { color: "#00dd00" });

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        this.html.Bspan.html(v.x.toFixed(3) + ", " + v.y.toFixed(3));

        this.Alabel.position.copy(this.A.vector);
        var mag = this.Alabel.position.length();
        this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/12/mag);

        this.Blabel.position.copy(this.A.vector);
        mag = this.Blabel.position.length();
        this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12/mag);

        this.xlabel.position.set(1,0,0);
        this.xlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
        this.ylabel.position.set(0,1,0);
        this.ylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);

        this.transform.add(this.B);
        this.transform.add(this.Blabel);
        this.transform.add(new Axes2D({color: "#ffbbff" }));
        this.transform.add(new AxesLabels({color: "#ffbbff" }));
        this.transform.add(this.xlabel);
        this.transform.add(this.ylabel);

        this.scene.add(this.Alabel);
        this.scene.add(this.A);
        this.scene.add(this.x);
        this.scene.add(this.y);
        this.scene.add(this.transform);

        this.renderer.render( this.scene, this.camera );
    },

    touchBegan: function(i,v) {
        var alen = v.clone().sub(this.A.vector).lengthSq();
        var xlen = v.clone().sub(this.x.vector).lengthSq();
        var ylen = v.clone().sub(this.y.vector).lengthSq();

        this.draggingA = false;
        this.draggingX = false;
        this.draggingY = false;

        if(alen < xlen && alen < ylen) {
            this.draggingA = true;
        } else if(xlen < alen && xlen < ylen) {
            this.draggingX = true;
        } else {
            this.draggingY = true;
        }
    },
    touchMoved: function(i,v) {
        if(this.draggingA || this.draggingX || this.draggingY) {
            v.x = Math.round(v.x*10)/10;
            v.y = Math.round(v.y*10)/10;

            if(this.draggingA) {
                this.A.updateVector(v);
                this.B.updateVector(v);
                var magnitude = v.length();
                this.Alabel.position.copy(v);
                this.Blabel.position.copy(v);
                if(magnitude > 0) {
                    this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/12/magnitude);
                    this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12/magnitude);
                }
                this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else if(this.draggingX) {
                this.x.updateVector(v);
                this.html.xspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else {
                this.y.updateVector(v);
                this.html.yspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            }

            this.transform.matrix.set(this.x.vector.x, this.y.vector.x, 0, 0,
                                      this.x.vector.y, this.y.vector.y, 0, 0,
                                                    0,               0, 1, 0,
                                                    0,               0, 0, 1);
            this.transform.matrixWorldNeedsUpdate = true;

            var B = this.A.vector.clone().applyMatrix4(this.transform.matrix);

            var xx = this.x.vector.x.toFixed(1);
            var xy = this.x.vector.y.toFixed(1);

            var yx = this.y.vector.x.toFixed(1);
            var yy = this.y.vector.y.toFixed(1);

            var Ax = this.A.vector.x.toFixed(1);
            var Ay = this.A.vector.y.toFixed(1);

            var Bx = B.x.toFixed(3);
            var By = B.y.toFixed(3);

            this.html.Bspan.html(Bx + ", " + By);
            this.html.eq1.html("\\[\\begin{bmatrix}" + xx + " & " + xy + " \\\\ " + yx + " & " + yy + " \\end{bmatrix}\\]");
            this.html.eq2.html("\\[=" + Ax + " \\cdot (" + xx + "," + xy + ") + " + Ay + " \\cdot (" + yx + "," + yy + ")\\]");
            this.html.eq3.html("\\[=\\underline{\\underline{(" + Bx + "," + By + ")}}\\]");

            this.html.eq4.html("\\[=(" + Ax + "," + Ay + ") \\cdot \\begin{bmatrix}" + xx + " & " + xy + " \\\\ " + yx + " & " + yy + "\\end{bmatrix}=(" + Ax + " \\cdot " + xx + " + " + Ay + " \\cdot " + yx + ", " + Ax + " \\cdot " + xy + " + " + Ay + " \\cdot " + yy + ")\\]");
            this.html.eq5.html("\\[=\\underline{\\underline{(" + Bx + "," + By + ")}}\\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingX = false;
        this.draggingY = false;
    }
});
