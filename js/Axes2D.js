var Axes2D = function(params) {
    THREE.Object3D.call(this);

    this.params = params || {};
    if(typeof(this.params.zDepth) == "undefined") {
        this.params.zDepth = 0;
    }
    this.init();
}

Axes2D.prototype = Object.create(THREE.Object3D.prototype);
Axes2D.prototype.init = function() {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: this.params.color || "#bbbbbb", linewidth: 2 });

    geometry.vertices.push(new THREE.Vector3(0,10,this.params.zDepth));
    geometry.vertices.push(new THREE.Vector3(0,-10,this.params.zDepth));

    geometry.vertices.push(new THREE.Vector3(10,0,this.params.zDepth));
    geometry.vertices.push(new THREE.Vector3(-10,0,this.params.zDepth));

    for(var x = -10; x <= 10; x += .5) {
        var len = .1;
        if((x/.5)%2 == 0) {
            len *= 2;
        }
        geometry.vertices.push(new THREE.Vector3(x,len,this.params.zDepth));
        geometry.vertices.push(new THREE.Vector3(x,-len,this.params.zDepth));
    }
    for(var y = -10; y <= 10; y += .5) {
        var len = .1;
        if((y/.5)%2 == 0) {
            len *= 2;
        }
        geometry.vertices.push(new THREE.Vector3(len,y,this.params.zDepth));
        geometry.vertices.push(new THREE.Vector3(-len,y,this.params.zDepth));
    }

    this.add(new THREE.Line(geometry,material,THREE.LinePieces));
}
