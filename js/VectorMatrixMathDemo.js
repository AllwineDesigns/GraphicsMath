var normalizeEvent = function(event) {
    if(!event.offsetX) {
        event.offsetX = (event.pageX - $(event.target).offset().left);
        event.offsetY = (event.pageY - $(event.target).offset().top);
    }
    return event;
};
var VectorMatrixMathDemo = {
    setup: function(opts) {
        $(window).resize(function() {
            var width = $(window).width();
            if(width > 1900) {
                this.renderer.setSize( 800, 800);
                MathJax.Hub.Config({
                      "HTML-CSS": {
                              preferredFont: "STIX",
                              scale: 150
                    }
                });
            } else if(width > 1300) {
                this.renderer.setSize( 600, 600);
                MathJax.Hub.Config({
                      "HTML-CSS": {
                              preferredFont: "STIX",
                              scale: 150
                    }
                });
            } else if(width > 900) {
                this.renderer.setSize( 400, 400);
                MathJax.Hub.Config({
                      "HTML-CSS": {
                              preferredFont: "STIX",
                              scale: 100
                    }
                });
            } else {
                this.renderer.setSize( 300, 300);
                MathJax.Hub.Config({
                      "HTML-CSS": {
                              preferredFont: "STIX",
                              scale: 100
                    }
                });
            }
            MathJax.Hub.Queue(["Typeset", MathJax.Hub ]);
            this.render();
        }.bind(this));

        this.projectVector1 = new THREE.Vector3(0,0,0);
        this.projectVector2 = new THREE.Vector3(0,0,1);
        this.projectRay = new THREE.Ray(this.projectVector1, this.projectVector2);
        this.projectPlane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
        this.intersectionVector = new THREE.Vector3(0,0,0);

        this.lastTouchPosition = new THREE.Vector3(0,0,0);
        this.touchPosition = new THREE.Vector3(0,0,0);

        opts = opts || {};

        if(!opts.hasOwnProperty('scrollWidget')) {
            opts.scrollWidget = this.canvas;
        }
        $(window).bind('scroll',function() {
            var containerPos = this.html.container.offset();
            var canvasPos = $(opts.scrollWidget).offset();
            var containerHeight = this.html.container.height();
            var canvasHeight = $(opts.scrollWidget).height();
            var scrollY = $(window).scrollTop();
            if($(window).width() > 1000) {
                if(scrollY+50 >= containerPos.top) {
                    if(scrollY+50+canvasHeight < containerPos.top+containerHeight) {
                        canvasPos.top = scrollY+50;
                        $(opts.scrollWidget).offset(canvasPos);
                    } else {
                        canvasPos.top = containerPos.top+containerHeight-canvasHeight;
                        $(opts.scrollWidget).offset(canvasPos);
                    }
                } else {
                    canvasPos.top = containerPos.top+1;
                    $(opts.scrollWidget).offset(canvasPos);
                }
            } else {
                canvasPos.top = containerPos.top+1;
                $(opts.scrollWidget).offset(canvasPos);
            }
        }.bind(this));
        if(typeof(opts.xmin) == 'undefined') xmin = -5.5;
        if(typeof(opts.xmax) == 'undefined') xmax = 5.5;
        if(typeof(opts.ymin) == 'undefined') ymin = -5.5;
        if(typeof(opts.ymax) == 'undefined') ymax = 5.5;
        if(typeof(opts.zmin) == 'undefined') zmin = -100;
        if(typeof(opts.zmax) == 'undefined') zmax = 100;

        this.allowCameraRotations = false;

        if(typeof(opts.camera) != 'undefined') {
            this.allowCameraRotations = opts.camera.allowRotations;
            if(opts.camera.type == "perspective") {
                this.camera = new THREE.PerspectiveCamera(opts.camera.fov || 60, opts.camera.aspect || 1, opts.camera.near || 1, opts.camera.far || 1000);
            } else {
                this.camera = new THREE.OrthographicCamera(xmin,xmax,ymax,ymin,zmin,zmax);
            }
            this.camera.position = opts.camera.position || new THREE.Vector3(0,0,10);
        } else {
            this.camera = new THREE.OrthographicCamera(xmin,xmax,ymax,ymin,zmin,zmax);
            this.camera.position = new THREE.Vector3(0,0,10);
        }
        this.cameraParent = new THREE.Object3D();
        this.cameraParent.rotation.order = "ZYX";
        this.cameraParent.rotation.x = 6.2;
        this.cameraParent.add(this.camera);
        this.scene = new THREE.Scene();
        this.scene.add(this.cameraParent);

        this.scene.add(new AxesLabels({ zDepth: -.01 }));
        this.scene.add(new Axes2D({ zDepth: -.01 }));
        this.scene.add(new Grid2D({ zDepth: -.01 }));

        this.renderer;
        if ( Detector.webgl )
            this.renderer = new THREE.WebGLRenderer( {antialias:true, canvas: this.canvas} );
        else
            this.renderer = new THREE.CanvasRenderer({ canvas: this.canvas }); 

//        this.renderer.setSize( this.canvas.width, this.canvas.height);
        var width = $(window).width();
        if(width > 1900) {
            this.renderer.setSize( 800, 800);
            MathJax.Hub.Config({
                  "HTML-CSS": {
                          preferredFont: "STIX",
                          scale: 150
                }
            });
        } else if(width > 1300) {
            this.renderer.setSize( 600, 600);
            MathJax.Hub.Config({
                  "HTML-CSS": {
                          preferredFont: "STIX",
                          scale: 150
                }
            });
        } else if(width > 992) {
            this.renderer.setSize( 400, 400);
            MathJax.Hub.Config({
                  "HTML-CSS": {
                          preferredFont: "STIX",
                          scale: 100
                }
            });
        } else {
            this.renderer.setSize( 300, 300);
            MathJax.Hub.Config({
                  "HTML-CSS": {
                          preferredFont: "STIX",
                          scale: 100
                }
            });
        }
        this.renderer.setClearColor( 0xffffff, 1 );

        this.initializeEvents();
    },

    projectToXYPlane: function(x,y) {
        this.projectVector1.x = (x / (this.canvas.width/this.renderer.devicePixelRatio))  * 2 - 1;
        this.projectVector1.y = - ( y / (this.canvas.height/this.renderer.devicePixelRatio) ) * 2 + 1;
        this.projectVector1.z = 0;

        this.projectVector2.x = this.projectVector1.x;
        this.projectVector2.y = this.projectVector1.y;
        this.projectVector2.z = .5;

        this.projector.unprojectVector( this.projectVector1, this.camera );
        this.projector.unprojectVector( this.projectVector2, this.camera );

        this.projectVector2.sub(this.projectVector1).normalize();

        if(this.projectRay.intersectPlane(this.projectPlane, this.intersectionVector)) {
            return this.intersectionVector;
        }

        return null;
    },
    initializeEvents: function() {
        this.projector = new THREE.Projector();
        this.canvas.oncontextmenu = function() { return false; };
        $(this.canvas).mousedown(function(e) {
            e = normalizeEvent(e);

            var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);

            if(this.allowCameraRotations && (e.shiftKey || e.which != 1)) {
                this.cameraDragging = true;
                this.touchPosition.x = e.offsetX;
                this.touchPosition.y = e.offsetY;
                this.lastTouchPosition.copy(this.touchPosition);
            } else if(intersection) {
                this.dragging = true;
                this.touchBegan(0,intersection);
            }
            e.preventDefault();
            e.stopPropagation();
        }.bind(this));
        $(this.canvas).mousemove(function(e) {
            e = normalizeEvent(e);
            if(this.dragging) {
                var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);

                if(intersection) {
                    this.touchMoved(0,intersection);
                }
            } else if(this.cameraDragging) {
                this.touchPosition.x = e.offsetX;
                this.touchPosition.y = e.offsetY;

                var dx = this.lastTouchPosition.x-this.touchPosition.x;
                var dy = this.lastTouchPosition.y-this.touchPosition.y;

                this.cameraParent.rotation.z += .02*dx;
                this.cameraParent.rotation.x += .02*dy;

                if(this.cameraParent.rotation.z < 0) {
                    this.cameraParent.rotation.z += 2*Math.PI;
                } else if(this.cameraParent.rotation.z > 2*Math.PI) {
                    this.cameraParent.rotation.z -= 2*Math.PI;
                }

                if(this.cameraParent.rotation.x < 0) {
                    this.cameraParent.rotation.x += 2*Math.PI;
                } else if(this.cameraParent.rotation.x > 2*Math.PI) {
                    this.cameraParent.rotation.x -= 2*Math.PI;
                }

                this.renderer.render(this.scene, this.camera);

                this.lastTouchPosition.copy(this.touchPosition);
            }
            e.preventDefault();
            e.stopPropagation();
        }.bind(this));
        var mouseupfunc = function(e) {
            e = normalizeEvent(e);

            if(this.dragging) {
                this.dragging = false;

                var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);

                if(intersection) {
                    this.touchEnded(0,intersection);
                }
            } else if(this.cameraDragging) {
                this.cameraDragging = false;
            }
            e.preventDefault();
            e.stopPropagation();
        }.bind(this);

        $(this.canvas).mouseup(mouseupfunc);
//        $(this.canvas).mouseout(mouseupfunc);

// very slow on mobile devices... maybe once webgl is supported
//        this.canvas.addEventListener('touchstart', function(evt) {
//            console.log("in touch start");
//            for(var i = 0; i < evt.changedTouches.length; i++) {
//                var e = normalizeEvent(evt.changedTouches[i]);
//
//                var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);
//
//                this.touchBegan(i,intersection);
//            }
//            e.preventDefault();
//        }.bind(this));
//
//        this.canvas.addEventListener('touchmove', function(evt) {
//            console.log("in touch move");
//            for(var i = 0; i < evt.changedTouches.length; i++) {
//                var e = normalizeEvent(evt.changedTouches[i]);
//                var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);
//
//                this.touchMoved(i,intersection);
//            }
//            e.preventDefault();
//            return false;
//        }.bind(this));
//
//        this.canvas.addEventListener('touchend', function(evt) {
//            console.log("in touch end");
//            for(var i = 0; i < evt.changedTouches.length; i++) {
//                var e = normalizeEvent(evt.changedTouches[i]);
//                var intersection = this.projectToXYPlane(e.offsetX,e.offsetY);
//
//                this.touchEnded(i,intersection);
//            }
//            e.preventDefault();
//        }.bind(this));
    },

    touchBegan: function(i,v) {
    },

    touchMoved: function(i,v) {
    },

    touchEnded: function(i,v) {
    }
};
