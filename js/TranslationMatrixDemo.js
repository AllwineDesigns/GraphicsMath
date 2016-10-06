var TranslationMatrixDemo = function() {
    var id = "#translationMatrixDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.Cspan = $(id + " .C");
    this.html.Dspan = $(id + " .D");
    this.html.xspan = $(id + " .x");
    this.html.yspan = $(id + " .y");
    this.html.Tspan = $(id + " .T");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.html.eq4 = $(id + " .eq4");
    this.html.eq5 = $(id + " .eq5");
    this.init();
};

TranslationMatrixDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup();

        this.A = new PointObject(new THREE.Vector3(-3,1,0));
        this.B = new VectorObject(new THREE.Vector3(1,1,0));
        this.Bgray = new VectorObject(new THREE.Vector3(1,1,0), {color: "#bbbbbb"});
        this.C = new PointObject(new THREE.Vector3(-3,1,0), { color: "#ff00ff" });
        this.D = new VectorObject(new THREE.Vector3(1,1,0), { color: "#ff00ff" });
        this.Dgray = new VectorObject(new THREE.Vector3(1,1,0), {color: "#bbbbbb"});

        this.x = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.y = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });
        this.T = new PointObject(new THREE.Vector3(0,0,0));

        this.transform = new THREE.Object3D();
        this.transform.matrixAutoUpdate = false;
        this.transform.matrix.set(1,0,0,0,
                                  0,1,0,0,
                                  0,0,1,0,
                                  0,0,0,1);

        this.Alabel = new Label("A");
        this.Blabel = new Label("B");
        this.Bgraylabel = new Label("B", {color: "#bbbbbb"});
        this.Clabel = new Label("C", { color: "#ff00ff" });
        this.Dlabel = new Label("D", { color: "#ff00ff" });
        this.Dgraylabel = new Label("D", {color: "#bbbbbb"});

        this.Alabel.position.copy(this.B.vector);
        this.Alabel.position.normalize();
        this.Alabel.position.multiplyScalar(.25);
        this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

        this.Bgraylabel.position.copy(this.B.vector);
        this.Bgraylabel.position.normalize();
        this.Bgraylabel.position.multiplyScalar(.25);
        this.Bgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

        this.Blabel.position.copy(this.B.vector);
        this.Blabel.position.normalize();
        this.Blabel.position.multiplyScalar(.25);
        this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

        this.Clabel.position.copy(this.D.vector);
        this.Clabel.position.normalize();
        this.Clabel.position.multiplyScalar(.25);
        this.Clabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

        this.Dlabel.position.copy(this.D.vector);
        this.Dlabel.position.normalize();
        this.Dlabel.position.multiplyScalar(.25);
        this.Dlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

        this.Dgraylabel.position.copy(this.D.vector);
        this.Dgraylabel.position.normalize();
        this.Dgraylabel.position.multiplyScalar(.25);
        this.Dgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

        this.A.add(this.Alabel);
        this.B.add(this.Blabel);
        this.Bgray.add(this.Bgraylabel);
        this.C.add(this.Clabel);
        this.D.add(this.Dlabel);
        this.Dgray.add(this.Dgraylabel);

        this.xlabel = new Label("x", { color: "#ff0000" });
        this.ylabel = new Label("y", { color: "#00dd00" });
        this.Tlabel = new Label("T");

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        v = this.B.vector;
        this.html.Bspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        v = this.C.vector;
        this.html.Cspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        v = this.D.vector;
        this.html.Dspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));

        this.xlabel.position.set(1,0,0);
        this.xlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
        this.ylabel.position.set(0,1,0);
        this.ylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);

        this.Tlabel.position.set(-.25,-.25,0);

        this.transform.add(this.x);
        this.transform.add(this.y);
        this.transform.add(this.C);
        this.C.add(this.D);
        this.transform.add(new Axes2D({color: "#ffbbff" }));
        this.transform.add(new AxesLabels({color: "#ffbbff" }));
        this.transform.add(this.xlabel);
        this.transform.add(this.ylabel);
        this.transform.add(this.Tlabel);

        this.A.add(this.B);

        this.scene.add(this.A);

        this.scene.add(this.Bgray);
        this.scene.add(this.Dgray);

        this.scene.add(this.T);
        this.scene.add(this.transform);

        this.renderer.render( this.scene, this.camera );
    },

    touchBegan: function(i,v) {
        var alen = v.clone().sub(this.A.vector).lengthSq();
        var blen = v.clone().sub(this.B.vector.clone().add(this.A.vector)).lengthSq();
        var tlen = v.clone().sub(this.T.vector).lengthSq();

        if(alen < tlen && alen < blen) {
            this.draggingA = true;
        } else if(blen < tlen) {
            this.draggingB = true;
        } else {
            this.draggingT = true;
        }
    },
    touchMoved: function(i,v) {
        if(this.draggingA || this.draggingB || this.draggingT) {
            v.x = Math.round(v.x*10)/10;
            v.y = Math.round(v.y*10)/10;

            if(this.draggingA) {
                this.A.updateVector(v);
                this.C.updateVector(v);
                var magnitude = v.length();
                this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            } else if(this.draggingB) {
                this.B.updateVector(v.clone().sub(this.A.vector));
                this.D.updateVector(this.B.vector);
                this.Bgray.updateVector(this.B.vector);
                this.Dgray.updateVector(this.B.vector);
                this.html.Bspan.html(this.B.vector.x.toFixed(1) + ", " + this.B.vector.y.toFixed(1));
                this.html.Dspan.html(this.B.vector.x.toFixed(1) + ", " + this.B.vector.y.toFixed(1));
            } else if(this.draggingT) {
                this.T.updateVector(v);
                this.html.Tspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
            }

            this.Alabel.position.copy(this.B.vector);
            this.Alabel.position.normalize();
            this.Alabel.position.multiplyScalar(.25);
            this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

            this.Bgraylabel.position.copy(this.B.vector);
            this.Bgraylabel.position.normalize();
            this.Bgraylabel.position.multiplyScalar(.25);
            this.Bgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

            this.Blabel.position.copy(this.B.vector);
            this.Blabel.position.normalize();
            this.Blabel.position.multiplyScalar(.25);
            this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

            this.Clabel.position.copy(this.D.vector);
            this.Clabel.position.normalize();
            this.Clabel.position.multiplyScalar(.25);
            this.Clabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

            this.Dlabel.position.copy(this.D.vector);
            this.Dlabel.position.normalize();
            this.Dlabel.position.multiplyScalar(.25);
            this.Dlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

            this.Dgraylabel.position.copy(this.D.vector);
            this.Dgraylabel.position.normalize();
            this.Dgraylabel.position.multiplyScalar(.25);
            this.Dgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

            this.transform.matrix.set(this.x.vector.x, this.y.vector.x, 0, this.T.vector.x,
                                      this.x.vector.y, this.y.vector.y, 0, this.T.vector.y,
                                                    0,               0, 1, 0,
                                                    0,               0, 0, 1);
            this.transform.matrixWorldNeedsUpdate = true;

            var xx = this.x.vector.x.toFixed(1);
            var xy = this.x.vector.y.toFixed(1);

            var yx = this.y.vector.x.toFixed(1);
            var yy = this.y.vector.y.toFixed(1);

            var Ax = this.A.vector.x.toFixed(1);
            var Ay = this.A.vector.y.toFixed(1);

            var Bx = this.B.vector.x.toFixed(1);
            var By = this.B.vector.y.toFixed(1);

            var C = this.T.vector.clone().add(this.A.vector);

            var Cx = C.x.toFixed(1);
            var Cy = C.y.toFixed(1);

            var Tx = this.T.vector.x.toFixed(1);
            var Ty = this.T.vector.y.toFixed(1);

            this.html.Cspan.html(Cx + ", " + Cy);

            this.html.eq1.html("\\[=" + Ax + " \\cdot (" + xx + "," + xy + ",0.0) + " + Ay + " \\cdot (" + yx + "," + yy + ",0.0) + 1.0 \\cdot (" + Tx + ", " + Ty + ", 1.0)\\]");
            this.html.eq2.html("\\[=\\underline{\\underline{(" + Cx + ", " + Cy + ",1.0)}}\\]");

            this.html.eq3.html("\\[=" + Bx + " \\cdot (" + xx + "," + xy + ",0.0) + " + By + " \\cdot (" + yx + "," + yy + ",0.0) + 0.0 \\cdot (" + Tx + ", " + Ty + ", 1.0)\\]");
            this.html.eq4.html("\\[=\\underline{\\underline{(" + Bx + ", " + By + ",0.0)}}\\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.renderer.render( this.scene, this.camera );
        }
    },
    touchEnded: function(i,v) {
        this.draggingA = false;
        this.draggingB = false;
        this.draggingT = false;
    }
});
