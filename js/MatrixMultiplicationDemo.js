var MatrixMultiplicationDemo = function() {
    var id = "#matrixMultiplicationDemo";
    this.canvas = $(id + " canvas")[0];
    this.order = "SR";
    this.html = {};
    this.html.scrollWidget = $(id + " .scrollWidget");

    this.html.container = $(id);
    this.html.Sspan = $(id + " .S");
    this.html.thetaspan = $(id + " .theta");
    this.html.flipOrder = $(id + " .flipOrder");
    this.html.flipOrder.click(function() {
        this.order = this.order == "RS" ? "SR" : "RS";
        this.updateMatrix();
        this.render();
    }.bind(this));

    this.html.eq1 = $(id + " .eq1");
    this.html.eq2 = $(id + " .eq2");
    this.html.eq3 = $(id + " .eq3");
    this.html.eq4 = $(id + " .eq4");

    this.init();
};

MatrixMultiplicationDemo.prototype = $.extend(Object.create(VectorMatrixMathDemo), {
    init: function() {
        this.setup({ scrollWidget: this.html.scrollWidget[0] });

        this.Rx = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.Ry = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });
        this.Sx = new VectorObject(new THREE.Vector3(1,0,0), { color: "#ff0000" });
        this.Sy = new VectorObject(new THREE.Vector3(0,1,0), { color: "#00dd00" });

        this.Rmatrix = new THREE.Matrix4();
        this.Smatrix = new THREE.Matrix4();

        this.transform = new THREE.Object3D();
        this.transform.matrixAutoUpdate = false;
        this.transform.matrix.set(1,0,0,0,
                                  0,1,0,0,
                                  0,0,1,0,
                                  0,0,0,1);

        this.Rxlabel = new Label("Rx", { color: "#ff0000" });
        this.Rylabel = new Label("Ry", { color: "#00dd00" });
        this.Sxlabel = new Label("Sx", { color: "#ff0000" });
        this.Sylabel = new Label("Sy", { color: "#00dd00" });

        this.Rxlabel.position.copy(this.Rx.vector);
        this.Rxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
        this.Rylabel.position.copy(this.Ry.vector);
        this.Rylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), 2*Math.PI/12);

        this.Sxlabel.position.copy(this.Sx.vector);
        this.Sxlabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -2*Math.PI/12/2);
        this.Sylabel.position.copy(this.Sy.vector);
        this.Sylabel.position.applyAxisAngle(new THREE.Vector3(0,0,1), -4*Math.PI/12/2);

        this.transform.add(new Axes2D({color: "#ffbbff" }));
        this.transform.add(new AxesLabels({color: "#ffbbff" }));

        this.scene.add(this.Rxlabel);
        this.scene.add(this.Rylabel);
        this.scene.add(this.Sxlabel);
        this.scene.add(this.Sylabel);

        this.scene.add(this.Rx);
        this.scene.add(this.Ry);
        this.scene.add(this.Sx);
        this.scene.add(this.Sy);
        this.scene.add(this.transform);

        this.render();
    },
    render: function() {
        this.renderer.render( this.scene, this.camera );
    },

    touchBegan: function(i,v) {
        var vec = v.clone();
        var points = [];

        points.push({ sqDist: vec.copy(v).sub(this.Rx.vector).lengthSq(), label: "Rx" });
        points.push({ sqDist: vec.copy(v).sub(this.Ry.vector).lengthSq(), label: "Ry" });
        points.push({ sqDist: vec.copy(v).sub(this.Sx.vector).lengthSq(), label: "Sx" });
        points.push({ sqDist: vec.copy(v).sub(this.Sy.vector).lengthSq(), label: "Sy" });

        points.sort(function(a,b) { return a.sqDist-b.sqDist });

        this.dragging = points[0];
    },
    updateMatrix: function() {
        var combined = this.transform.matrix;
        combined.identity();

        var slatex = "\\textbf{S}";
        var rlatex = "\\textbf{R}";

        var svectorslatex = "\\begin{bmatrix} \\textbf{S}_{\\textbf{x}} \\\\ \\textbf{S}_{\\textbf{y}} \\\\ \\textbf{S}_{\\textbf{T}} \\end{bmatrix}";
        var rvectorslatex = "\\begin{bmatrix} \\textbf{R}_{\\textbf{x}} \\\\ \\textbf{R}_{\\textbf{y}} \\\\ \\textbf{R}_{\\textbf{T}} \\end{bmatrix}";

        var rs = "";
        var vrs = "";
        var xrs = "";
        var yrs = "";
        var trs = "";
        
        var order = this.order;
        for(var i = 0; i < order.length; i++) {
            switch(order[i]) {
                case "S":
                    combined.multiply(this.Smatrix);
                    rs += slatex;
                    vrs += svectorslatex;
                    if(i == 0) {
                        xrs += slatex + "_{\\textbf{x}}";
                        yrs += slatex + "_{\\textbf{y}}";
                        trs += slatex + "_{\\textbf{T}}";
                    } else {
                        xrs += slatex;
                        yrs += slatex;
                        trs += slatex;
                    }
                    break;
                case "R":
                    combined.multiply(this.Rmatrix);
                    rs += rlatex;
                    vrs += rvectorslatex;
                    if(i == 0) {
                        xrs += rlatex + "_{\\textbf{x}}";
                        yrs += rlatex + "_{\\textbf{y}}";
                        trs += rlatex + "_{\\textbf{T}}";
                    } else {
                        xrs += rlatex;
                        yrs += rlatex;
                        trs += rlatex;
                    }
                    break;
            }
        }

        this.html.eq4.html("\\[=\\begin(bmatrix}" + "\\]");

        combined.transpose();

        this.html.eq3.html("\\[" + rs + "=" + vrs + "=\\begin{bmatrix}" + xrs + "\\\\" + yrs + "\\\\" + trs + "\\end{bmatrix}\\]");

        var elements = combined.elements;
        var mxx = elements[0].toFixed(3);
        var mxy = elements[1].toFixed(3);
        var mxw = elements[3].toFixed(1);

        var myx = elements[4].toFixed(3);
        var myy = elements[5].toFixed(3);
        var myw = elements[7].toFixed(1);

        this.html.eq4.html("\\[=\\underline{\\underline{\\begin{bmatrix} " + mxx + " & " + mxy + " & " + mxw + " \\\\ " + myx + " & " + myy + " & " + myw + " \\\\ " + "0.0 & 0.0 & 1.0 \\end{bmatrix}}} \\]");

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

        this.transform.matrixWorldNeedsUpdate = true;
    },
    touchMoved: function(i,v) {
        if(this.dragging) {
            v.x = Math.round(v.x*10)/10;
            v.y = Math.round(v.y*10)/10;

            switch(this.dragging.label) {
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
            }

            this.Rmatrix.set(this.Rx.vector.x, this.Rx.vector.y, 0, 0,
                             this.Ry.vector.x, this.Ry.vector.y, 0, 0,
                                            0,                0, 1, 0,
                                            0,                0, 0, 1);

            this.Smatrix.set(this.Sx.vector.x, this.Sx.vector.y, 0, 0,
                             this.Sy.vector.x, this.Sy.vector.y, 0, 0,
                                            0,                0, 1, 0,
                                            0,                0, 0, 1);

            this.updateMatrix();

            var Sx = this.Sx.vector.x.toFixed(1);
            var Sy = this.Sy.vector.y.toFixed(1);

            var Rxx = this.Rx.vector.x.toFixed(3);
            var Rxy = this.Rx.vector.y.toFixed(3);
            var Ryx = this.Ry.vector.x.toFixed(3);
            var Ryy = this.Ry.vector.y.toFixed(3);

            var theta = Math.atan2(this.Rx.vector.y, this.Rx.vector.x)*180/Math.PI
            if(theta < 0) {
                theta += 360;
            }

            this.html.Sspan.html(Sx + ", " + Sy);
            this.html.thetaspan.html(theta.toFixed(3));

            var slatex = "\\begin{bmatrix} " + Sx + " & 0.0 & 0.0 \\\\ " 
                                            + "0.0 & " + Sy + " & 0.0 \\\\ " 
                                            + "0.0 & 0.0 & 1.0 \\end{bmatrix}";
            var rlatex = "\\begin{bmatrix} " + Rxx + " & " + Rxy + " & 0.0 \\\\" 
                                            + Ryx + " & " + Ryy + " & 0.0 \\\\"
                                            + "0.0 & 0.0 & 1.0\\end{bmatrix}";
                                  

            this.html.eq1.html("\\[\\textbf{S}=" + slatex + " = \\begin{bmatrix} \\textbf{S}_{\\textbf{x}} \\\\ \\textbf{S}_{\\textbf{y}} \\\\ \\textbf{S}_{\\textbf{T}} \\end{bmatrix} \\]");
            this.html.eq2.html("\\[\\textbf{R}=" + rlatex + " = \\begin{bmatrix} \\textbf{R}_{\\textbf{x}} \\\\ \\textbf{R}_{\\textbf{y}} \\\\ \\textbf{R}_{\\textbf{T}} \\end{bmatrix} \\]");

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.html.container[0]]);

            this.render();
        }
    },
    touchEnded: function(i,v) {
        this.dragging = false;
    }
});
