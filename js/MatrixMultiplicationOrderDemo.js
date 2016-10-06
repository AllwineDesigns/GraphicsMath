var MatrixMultiplicationOrderDemo = function() {
    var id = "#matrixMultiplicationOrderDemo";
    this.canvas = $(id + " canvas")[0];
    this.html = {};
    this.html.matrixOrder = $(id + " .matrixOrder");
    this.html.scrollWidget = $(id + " .scrollWidget");
    this.html.show = $(id + " .showControl");
    this.html.show.change(function() {
        this.scene.remove(this.A);
        this.transform.remove(this.C);
        this.scene.remove(this.Bgray);
        this.scene.remove(this.Dgray);
        this.scene.remove(this.Rx);
        this.scene.remove(this.Ry);
        this.scene.remove(this.Sx);
        this.scene.remove(this.Sy);
        this.scene.remove(this.T);
        this.scene.remove(this.Rxlabel);
        this.scene.remove(this.Rylabel);
        this.scene.remove(this.Sxlabel);
        this.scene.remove(this.Sylabel);
        this.scene.remove(this.Tlabel);
        if(this.html.showVectors.is(':checked')) {
            this.scene.add(this.A);
            this.transform.add(this.C);
            this.scene.add(this.Bgray);
            this.scene.add(this.Dgray);
        }
        if(this.html.showR.is(':checked')) {
            this.scene.add(this.Rx);
            this.scene.add(this.Ry);
            this.scene.add(this.Rxlabel);
            this.scene.add(this.Rylabel);
        }
        if(this.html.showS.is(':checked')) {
            this.scene.add(this.Sx);
            this.scene.add(this.Sy);
            this.scene.add(this.Sxlabel);
            this.scene.add(this.Sylabel);
        }
        if(this.html.showT.is(':checked')) {
            this.scene.add(this.T);
            this.scene.add(this.Tlabel);
        }
        this.render();
    }.bind(this));
    this.html.showVectors = $(id + " .showVectors");
    this.html.showR = $(id + " .showR");
    this.html.showS = $(id + " .showS");
    this.html.showT = $(id + " .showT");
    this.html.matrixOrder.keyup(function() {
        this.updateMatrix();
        this.render();
    }.bind(this));
    this.html.container = $(id);
    this.html.Aspan = $(id + " .A");
    this.html.Bspan = $(id + " .B");
    this.html.Cspan = $(id + " .C");
    this.html.Dspan = $(id + " .D");
    this.html.Tspan = $(id + " .T");
    this.html.Sspan = $(id + " .S");
    this.html.thetaspan = $(id + " .theta");
    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.html.eq4 = $(id + " .eq4");
    this.html.eq5 = $(id + " .eq5");
    this.init();
};

MatrixMultiplicationOrderDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
//        this.setup(-2.5, 2.5, -2.5,2.5);
        this.setup({ scrollWidget: this.html.scrollWidget[0] });

        this.A = new PointObject(new THREE.Vector3(-3,1,0));
        this.B = new VectorObject(new THREE.Vector3(1,1,0));
        this.Bgray = new VectorObject(new THREE.Vector3(1,1,0), {color: "#bbbbbb"});
        this.C = new PointObject(new THREE.Vector3(-3,1,0), { color: "#ff00ff" });
        this.D = new VectorObject(new THREE.Vector3(1,1,0), { color: "#ff00ff" });
        this.Dgray = new VectorObject(new THREE.Vector3(1,1,0), {color: "#bbbbbb"});

        this.Rx = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.Ry = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });
        this.Sx = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.Sy = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });
        this.T = new PointObject(new  THREE.Vector3(0,0,0));
        this.x = new VectorObject(new  THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.y = new VectorObject(new  THREE.Vector3(0,1,0), { color: "#00dd00" });

        this.Rmatrix = new THREE.Matrix4();
        this.Smatrix = new THREE.Matrix4();
        this.Tmatrix = new THREE.Matrix4();

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
        this.Rxlabel = new Label("Rx", { color: "#ff0000" });
        this.Rylabel = new Label("Ry", { color: "#00dd00" });
        this.Sxlabel = new Label("Sx", { color: "#ff0000" });
        this.Sylabel = new Label("Sy", { color: "#00dd00" });
        this.Tlabel = new Label("T");

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

        var v = this.A.vector;
        this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
        this.html.Bspan.html(this.B.vector.x.toFixed(1) + ", " + this.B.vector.y.toFixed(1));

        this.Rxlabel.position.copy(this.Rx.vector);
        this.Rxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
        this.Rylabel.position.copy(this.Ry.vector);
        this.Rylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), 2*Math.PI/12);

        this.Sxlabel.position.copy(this.Sx.vector);
        this.Sxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -2*Math.PI/12/2);
        this.Sylabel.position.copy(this.Sy.vector);
        this.Sylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -4*Math.PI/12/2);

        this.Tlabel.position.copy(this.T.vector);
        this.Tlabel.position.add(new THREE.Vector3(-.25,-.25,0));

        this.transform.add(this.x);
        this.transform.add(this.y);
        this.transform.add(this.C);
        this.C.add(this.D);
        this.transform.add(new Axes2D({color: "#ffbbff" }));
        this.transform.add(new AxesLabels({color: "#ffbbff" }));

        this.scene.add(this.Bgray);
        this.scene.add(this.Dgray);
        this.scene.add(this.Rxlabel);
        this.scene.add(this.Rylabel);
        this.scene.add(this.Sxlabel);
        this.scene.add(this.Sylabel);

        this.scene.add(this.Tlabel);

        this.A.add(this.B);

        this.A.add(this.Alabel);
        this.B.add(this.Blabel);
        this.Bgray.add(this.Bgraylabel);
        this.C.add(this.Clabel);
        this.D.add(this.Dlabel);
        this.Dgray.add(this.Dgraylabel);

        this.scene.add(this.A);
        this.scene.add(this.Rx);
        this.scene.add(this.Ry);
        this.scene.add(this.Sx);
        this.scene.add(this.Sy);
        this.scene.add(this.T);
        this.scene.add(this.transform);

        this.render();
    },
    render: function() {
        this.renderer.render( this.scene, this.camera );
    },

    touchBegan: function(i,v) {
        var vec = v.clone();
        var points = [];

        if(this.html.showVectors.is(':checked')) {
            points.push({ sqDist: vec.copy(v).sub(this.A.vector).lengthSq(), label: "A" });
            points.push({ sqDist: vec.copy(v).sub(this.B.vector.clone().add(this.A.vector)).lengthSq(), label: "B" });
        }

        if(this.html.showR.is(':checked')) {
            points.push({ sqDist: vec.copy(v).sub(this.Rx.vector).lengthSq(), label: "Rx" });
            points.push({ sqDist: vec.copy(v).sub(this.Ry.vector).lengthSq(), label: "Ry" });
        }

        if(this.html.showS.is(':checked')) {
            points.push({ sqDist: vec.copy(v).sub(this.Sx.vector).lengthSq(), label: "Sx" });
            points.push({ sqDist: vec.copy(v).sub(this.Sy.vector).lengthSq(), label: "Sy" });
        }

        if(this.html.showT.is(':checked')) {
            points.push({ sqDist: vec.copy(v).sub(this.T.vector).lengthSq(), label: "T" });
        }

        points.sort(function(a,b) { return a.sqDist-b.sqDist });

        this.dragging = points[0];
    },
    updateMatrix: function() {
        var combined = this.transform.matrix;
        combined.identity();

        var slatex = "\\textbf{S}";
        var rlatex = "\\textbf{R}";
        var tlatex = "\\textbf{T}";

        var svectorslatex = "\\begin{bmatrix} \\textbf{S}_{\\textbf{x}} \\\\ \\textbf{S}_{\\textbf{y}} \\\\ \\textbf{S}_{\\textbf{T}} \\end{bmatrix}";
        var rvectorslatex = "\\begin{bmatrix} \\textbf{R}_{\\textbf{x}} \\\\ \\textbf{R}_{\\textbf{y}} \\\\ \\textbf{R}_{\\textbf{T}} \\end{bmatrix}";
        var tvectorslatex = "\\begin{bmatrix} \\textbf{T}_{\\textbf{x}} \\\\ \\textbf{T}_{\\textbf{y}} \\\\ \\textbf{T}_{\\textbf{T}} \\end{bmatrix}";

        var trs = "";
        var vtrs = "";
        
        var order = this.html.matrixOrder.val();
        for(var i = 0; i < order.length; i++) {
            switch(order[i]) {
                case "S":
                    combined.multiply(this.Smatrix);
                    trs += slatex;
                    vtrs += svectorslatex;
                    break;
                case "R":
                    combined.multiply(this.Rmatrix);
                    trs += rlatex;
                    vtrs += rvectorslatex;
                    break;
                case "T":
                    combined.multiply(this.Tmatrix);
                    trs += tlatex;
                    vtrs += tvectorslatex;
                    break;
            }
        }

        combined.transpose();

        this.html.eq4.html("\\[" + trs + "=" + vtrs + "\\]");

        var elements = combined.elements;
        var mxx = elements[0].toFixed(3);
        var mxy = elements[1].toFixed(3);
        var mxw = elements[3].toFixed(1);

        var myx = elements[4].toFixed(3);
        var myy = elements[5].toFixed(3);
        var myw = elements[7].toFixed(1);

        var mtx = elements[12].toFixed(3);
        var mty = elements[13].toFixed(3);
        var mtw = elements[15].toFixed(1);

        this.html.eq5.html("\\[=\\underline{\\underline{\\begin{bmatrix} " + mxx + " & " + mxy + " & " + mxw + " \\\\ " + myx + " & " + myy + " & " + myw + " \\\\ " + mtx + " & " + mty + " & " + mtw + " \\end{bmatrix}}} \\]");

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

        this.transform.matrixWorldNeedsUpdate = true;
    },
    touchMoved: function(i,v) {
        if(this.dragging) {
            v.x = Math.round(v.x*10)/10;
            v.y = Math.round(v.y*10)/10;

            switch(this.dragging.label) {
                case "A":
                    this.A.updateVector(v);
                    this.C.updateVector(v);
                    this.html.Aspan.html(v.x.toFixed(1) + ", " + v.y.toFixed(1));
                    break;
                case "B":
                    var vec = v.clone().sub(this.A.vector);
                    this.B.updateVector(vec);
                    this.D.updateVector(vec);
                    this.Bgray.updateVector(vec);
                    this.Dgray.updateVector(vec);
                    this.Alabel.position.copy(this.B.vector);
                    this.Alabel.position.normalize();
                    this.Alabel.position.multiplyScalar(.25);
                    this.Alabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

                    this.Blabel.position.copy(this.B.vector);
                    this.Blabel.position.normalize();
                    this.Blabel.position.multiplyScalar(.25);
                    this.Blabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

                    this.Bgraylabel.position.copy(this.Bgray.vector);
                    this.Bgraylabel.position.normalize();
                    this.Bgraylabel.position.multiplyScalar(.25);
                    this.Bgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);

                    this.Clabel.position.copy(this.D.vector);
                    this.Clabel.position.normalize();
                    this.Clabel.position.multiplyScalar(.25);
                    this.Clabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

                    this.Dlabel.position.copy(this.D.vector);
                    this.Dlabel.position.normalize();
                    this.Dlabel.position.multiplyScalar(.25);
                    this.Dlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

                    this.html.Bspan.html(this.B.vector.x.toFixed(1) + ", " + this.B.vector.y.toFixed(1));

                    break;
                case "Rx":
                    v.normalize();
                    this.Rx.updateVector(v);
                    this.Ry.updateVector(new THREE.Vector3(-v.y, v.x, 0));

                    this.Rxlabel.position.copy(this.Rx.vector);
                    this.Rxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
                    this.Rylabel.position.copy(this.Ry.vector);
                    this.Rylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), 2*Math.PI/12);
                    break;
                case "Ry":
                    v.normalize();
                    this.Ry.updateVector(v);
                    this.Rx.updateVector(new THREE.Vector3(v.y, -v.x, 0));

                    this.Rxlabel.position.copy(this.Rx.vector);
                    this.Rxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
                    this.Rylabel.position.copy(this.Ry.vector);
                    this.Rylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
                    break;
                case "Sx":
                    this.Sx.updateVector(new THREE.Vector3(v.x,0,0));

                    this.Sxlabel.position.copy(this.Sx.vector);
                    this.Sxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -2*Math.PI/12/this.Sx.vector.length());
                    break;
                case "Sy":
                    this.Sy.updateVector(new THREE.Vector3(0,v.y,0));
                    this.Sylabel.position.copy(this.Sy.vector);
                    this.Sylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -4*Math.PI/12/this.Sy.vector.length());

                    break;
                case "T":
                    this.T.updateVector(v);

                    this.Tlabel.position.copy(this.T.vector);
                    this.Tlabel.position.add(new THREE.Vector3(-.25,-.25,0));
                    break;
            }

            this.Rmatrix.set(this.Rx.vector.x, this.Rx.vector.y, 0, 0,
                             this.Ry.vector.x, this.Ry.vector.y, 0, 0,
                                            0,                0, 1, 0,
                                            0,                0, 0, 1);

            this.Smatrix.set(this.Sx.vector.x, this.Sx.vector.y, 0, 0,
                             this.Sy.vector.x, this.Sy.vector.y, 0, 0,
                                            0,                0, 1, 0,
                                            0,                0, 0, 1);

            this.Tmatrix.set(               1,                0, 0, 0,
                                            0,                1, 0, 0,
                                            0,                0, 1, 0,
                              this.T.vector.x,  this.T.vector.y, 0, 1);

            this.updateMatrix();

            var dgray = new THREE.Vector4(this.B.vector.x,this.B.vector.y,this.B.vector.z,0);
            dgray.applyMatrix4(this.transform.matrix);

            this.Dgray.updateVector(dgray);

            this.Dgraylabel.position.copy(this.Dgray.vector);
            this.Dgraylabel.position.normalize();
            this.Dgraylabel.position.multiplyScalar(.25);
            this.Dgraylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/2);

            var Ax = this.A.vector.x.toFixed(1);
            var Ay = this.A.vector.y.toFixed(1);

            var Bx = this.B.vector.x.toFixed(1);
            var By = this.B.vector.y.toFixed(1);

            var C = this.A.vector.clone().applyMatrix4(this.transform.matrix);
            var D = dgray;

            var Cx = C.x.toFixed(3);
            var Cy = C.y.toFixed(3);

            var Dx = D.x.toFixed(3);
            var Dy = D.y.toFixed(3);

            var Sx = this.Sx.vector.x.toFixed(1);
            var Sy = this.Sy.vector.y.toFixed(1);

            var Rxx = this.Rx.vector.x.toFixed(3);
            var Rxy = this.Rx.vector.y.toFixed(3);
            var Ryx = this.Ry.vector.x.toFixed(3);
            var Ryy = this.Ry.vector.y.toFixed(3);

            var Tx = this.T.vector.x.toFixed(1);
            var Ty = this.T.vector.y.toFixed(1);
            var theta = Math.atan2(this.Rx.vector.y, this.Rx.vector.x)*180/Math.PI
            if(theta < 0) {
                theta += 360;
            }

            this.html.Cspan.html(Cx + ", " + Cy);
            this.html.Dspan.html(Dx + ", " + Dy);
            this.html.Tspan.html(Tx + ", " + Ty);
            this.html.Sspan.html(Sx + ", " + Sy);
            this.html.thetaspan.html(theta.toFixed(3));

            var slatex = "\\begin{bmatrix} " + Sx + " & 0.0 & 0.0 \\\\ " 
                                            + "0.0 & " + Sy + " & 0.0 \\\\ " 
                                            + "0.0 & 0.0 & 1.0 \\end{bmatrix}";
            var rlatex = "\\begin{bmatrix} " + Rxx + " & " + Rxy + " & 0.0 \\\\" 
                                            + Ryx + " & " + Ryy + " & 0.0 \\\\"
                                            + "0.0 & 0.0 & 1.0\\end{bmatrix}";
            var tlatex = "\\begin{bmatrix} 1.0 & 0.0 & 0.0 \\\\" 
                                        + "0.0 & 1.0 & 0.0 \\\\"
                                        + Tx + " & " + Ty + " & 1.0\\end{bmatrix}";

            this.html.eq1.html("\\[\\textbf{S}=" + slatex + " = \\begin{bmatrix} \\textbf{S}_{\\textbf{x}} \\\\ \\textbf{S}_{\\textbf{y}} \\\\ \\textbf{S}_{\\textbf{T}} \\end{bmatrix} \\]");
            this.html.eq2.html("\\[\\textbf{R}=" + rlatex + " = \\begin{bmatrix} \\textbf{R}_{\\textbf{x}} \\\\ \\textbf{R}_{\\textbf{y}} \\\\ \\textbf{R}_{\\textbf{T}} \\end{bmatrix} \\]");
            this.html.eq3.html("\\[\\textbf{T}=" + tlatex + " = \\begin{bmatrix} \\textbf{T}_{\\textbf{x}} \\\\ \\textbf{T}_{\\textbf{y}} \\\\ \\textbf{T}_{\\textbf{T}} \\end{bmatrix} \\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.render();
        }
    },
    touchEnded: function(i,v) {
        this.dragging = false;
    }
});
