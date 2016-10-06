var ZAxis = function(params) {
    THREE.Object3D.call(this);

    this.params = params || {};
    this.init();
}

ZAxis.prototype = Object.create(THREE.Object3D.prototype);
ZAxis.prototype.init = function() {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: this.params.color || "#bbbbbb", linewidth: 2 });

    geometry.vertices.push(new THREE.Vector3(0,0,10));
    geometry.vertices.push(new THREE.Vector3(0,0,-10));

    for(var z = -10; z <= 10; z += .5) {
        var len = .1;
        if((z/.5)%2 == 0) {
            len *= 2;
        }
        geometry.vertices.push(new THREE.Vector3(len,0,z));
        geometry.vertices.push(new THREE.Vector3(-len,0,z));
    }

    this.add(new THREE.Line(geometry,material,THREE.LinePieces));
}
