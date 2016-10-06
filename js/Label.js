var Label = function(str,params) {
    THREE.Object3D.call(this);

    this.str = str;
    this.params = params || {};
    if(typeof(this.params.zDepth) == "undefined") {
        this.params.zDepth = 0;
    }
    this.init();
}

Label.prototype = Object.create(THREE.Object3D.prototype);
Label.prototype.init = function() {
    var material = new THREE.MeshBasicMaterial({ color: this.params.color || "#000000" });
    var textGeom = new THREE.TextGeometry(this.str, { size: .2, height: .01, font: 'helvetiker' });
    var textMesh = new THREE.Mesh(textGeom, material);
    textGeom.computeBoundingBox();
    textGeom.textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
    textGeom.textHeight = textGeom.boundingBox.max.y - textGeom.boundingBox.min.y;

    textMesh.position = new THREE.Vector3(-textGeom.textWidth*.5, -textGeom.textHeight*.5,this.params.zDepth);
    this.add(textMesh);
}
