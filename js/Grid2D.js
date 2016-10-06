var Grid2D = function(params) {
    THREE.Object3D.call(this);

    this.params = params || {};
    if(typeof(this.params.zDepth) == "undefined") {
        this.params.zDepth = 0;
    }
    this.init();
}

Grid2D.prototype = Object.create(THREE.Object3D.prototype);
Grid2D.prototype.init = function() {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: "#eeeeee", linewidth: 1 });

    for(var x = -10; x <= 10; x += .5) {
        geometry.vertices.push(new THREE.Vector3(x,10,this.params.zDepth));
        geometry.vertices.push(new THREE.Vector3(x,-10,this.params.zDepth));
    }
    for(var y = -10; y <= 10; y += .5) {
        geometry.vertices.push(new THREE.Vector3(10,y,this.params.zDepth));
        geometry.vertices.push(new THREE.Vector3(-10,y,this.params.zDepth));
    }

    this.add(new THREE.Line(geometry,material,THREE.LinePieces));
}
