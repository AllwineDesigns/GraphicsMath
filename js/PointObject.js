var PointObject = function(v,params) {
    THREE.Object3D.call(this);
    
    this.vector = v.clone();
    this.params = params || {};

    this.initializePoint();
};

PointObject.prototype = Object.create(THREE.Object3D.prototype);
PointObject.prototype.initializePoint = function() {
    this.material = new THREE.MeshBasicMaterial({ color: this.params.color || "#000000" });
    this.geometry = new THREE.CircleGeometry(.1, 10);
    this.mesh = new THREE.Mesh(this.geometry,this.material);

    this.add(this.mesh);
    this.position = this.vector;
}

PointObject.prototype.updateVector = function(v) {
    this.vector.copy(v);
}
