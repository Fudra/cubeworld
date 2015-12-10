function init(element){
    'use strict' ;

    var config = {
        ASPECT : window.innerWidth / window.innerHeight,
        FAR : 1000,
        NEAR : 0.1,
        FOV: 75
    };

    var $el = element;

    var scene = new THREE.Scene();
    var camara = new THREE.PerspectiveCamera(config.FOV, config.ASPECT, config.NEAR, config.FAR);

    return {
        renderer: null,
        camera: null,
        scene: null

    }
}