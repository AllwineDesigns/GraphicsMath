var VectorObject = function(v,params) {
    THREE.Object3D.call(this);
    
    this.vector = v.clone();
    this.params = params || {};

    if(typeof(this.params.up) == "undefined") {
        this.params.up = new THREE.Vector3(0,0,1);
    }

    this.initializeVector();
};

VectorObject.prototype = Object.create(THREE.Object3D.prototype);
VectorObject.prototype.initializeVector = function() {
    var material = new THREE.LineBasicMaterial({ color: this.params.color || "#000000", linewidth: 2 });
    this.geometry = new THREE.Geometry();
    this.geometry.dynamic = true;

    this.geometry.vertices.push(new THREE.Vector3(0,0,0));
    this.geometry.vertices.push(this.vector);

    this.geometry.vertices.push(this.vector);

    var arrowPt1 = this.vector.clone().normalize();
    arrowPt1.multiplyScalar(.25);
    arrowPt1.applyAxisAngle(this.params.up,150*Math.PI/180);
    arrowPt1.add(this.vector);
    this.geometry.vertices.push(arrowPt1);

    this.geometry.vertices.push(this.vector);

    var arrowPt2 = this.vector.clone().normalize();
    arrowPt2.multiplyScalar(.25);
    arrowPt2.applyAxisAngle(this.params.up,-150*Math.PI/180);
    arrowPt2.add(this.vector);
    this.geometry.vertices.push(arrowPt2);

    this.line = new THREE.Line(this.geometry,material,THREE.LinePieces);
    this.line.position = this.vector.clone().multiplyScalar(-1); 

    this.add(this.line);
    this.position = this.vector;
}

VectorObject.prototype.updateVector = function(v) {
    this.vector.copy(v);

    var arrowPt1 = this.vector.clone().normalize();
    arrowPt1.multiplyScalar(.25);
    arrowPt1.applyAxisAngle(this.params.up,150*Math.PI/180);
    arrowPt1.add(this.vector);
    this.geometry.vertices[3] = arrowPt1;

    var arrowPt2 = this.vector.clone().normalize();
    arrowPt2.multiplyScalar(.25);
    arrowPt2.applyAxisAngle(this.params.up,-150*Math.PI/180);
    arrowPt2.add(this.vector);
    this.geometry.vertices[5] = arrowPt2;

    this.line.position = this.vector.clone().multiplyScalar(-1);
    this.geometry.verticesNeedUpdate = true;
}
