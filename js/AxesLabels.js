var AxesLabels = function(params) {
    THREE.Object3D.call(this);

    this.params = params || {};
    if(typeof(this.params.zDepth) == "undefined") {
        this.params.zDepth = 0;
    }
    this.init();
}

AxesLabels.prototype = Object.create(THREE.Object3D.prototype);
AxesLabels.prototype.init = function() {
    var material = new THREE.MeshBasicMaterial({ color: this.params.color || "#bbbbbb" });
    for(var x = -10; x <= 10; x += 1) {
        if(x == 0) continue;
        var textGeom = new THREE.TextGeometry(x, { size: .2, height: .01, font: 'helvetiker' });
        var textMesh = new THREE.Mesh(textGeom, material);
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        textGeom.textHeight = textGeom.boundingBox.max.y - textGeom.boundingBox.min.y;
        textMesh.position = new THREE.Vector3(x-textGeom.textWidth*.5, -textGeom.textHeight-.25,this.params.zDepth);

        this.add(textMesh);
    }

    for(var y = -10; y <= 10; y += 1) {
        if(y == 0) continue;
        var textGeom = new THREE.TextGeometry(y, { size: .2, height: .01, font: 'helvetiker' });
        var textMesh = new THREE.Mesh(textGeom, material);
        textGeom.computeBoundingBox();
        textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        textGeom.textHeight = textGeom.boundingBox.max.y - textGeom.boundingBox.min.y;
        textMesh.position = new THREE.Vector3(textGeom.textWidth*.5+.25, y-textGeom.textHeight*.5,this.params.zDepth);

        this.add(textMesh);
    }
}
