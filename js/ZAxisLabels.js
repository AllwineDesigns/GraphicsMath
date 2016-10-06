var ZAxisLabels = function(params) {
    THREE.Object3D.call(this);

    this.params = params || {};

    this.init();
}

ZAxisLabels.prototype = Object.create(THREE.Object3D.prototype);
ZAxisLabels.prototype.init = function() {
    var material = new THREE.MeshBasicMaterial({ color: this.params.color || "#bbbbbb" });
    for(var z = -10; z <= 10; z += 1) {
        if(z == 0) continue;
        var textGeom = new THREE.TextGeometry(z, { size: .2, height: .01, font: 'helvetiker' });
        var textMesh = new THREE.Mesh(textGeom, material);
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        textGeom.textHeight = textGeom.boundingBox.max.y - textGeom.boundingBox.min.y;
        textMesh.position = new THREE.Vector3(textGeom.textWidth+.25, 0, z-textGeom.textHeight*.5);
        textMesh.rotation.x = Math.PI/2;

        this.add(textMesh);
    }
}
