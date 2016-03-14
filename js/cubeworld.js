/**
 * @author Philipp Wahle
 * @description
 *
 * Computergrafik Beleg im SS/WS 1015/16
 *
 *
 * Controls:
 * m -> Toggle Map view
 * todo : i -> change or toggle state
 * w/a/s/d -> move Player
 * mouse -> look around
 */

if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
}


var container,
    stats;

var camera,
    controls,
    scene,
    renderer;

var mesh,
    mat;

var boxWidth = 10,
    boxDepth = 10,
    minHeight = 10,
    cellWidth = 10;

var worldWidth = 16,
    worldDepth = 50,
    totalWorldWidth = worldWidth * boxWidth,
    totalWorldDepth = worldDepth * boxDepth,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2,
    data = generateHeight(worldWidth, worldDepth);

var SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 1024;

var pointLightsCount = 30;
var directionalLight;

var clock = new THREE.Clock();

var stateMode = 0;

var prevTime = performance.now();

var player = null;

var mousePos = new THREE.Vector2();

var collidableMeshList = [];

init();
animate();

function init() {


    var width = window.innerWidth,
        height = window.innerHeight;

    container = document.getElementById('container');


    // x -> worldWidth;
    // z -> worldDepth

    // camera
    //camera = new THREE.PerspectiveCamera(50, width / height, 1, 20000);
    //camera.position.set(100, 14.6, 50);
    //camera.rotation.y = 0;
    //camera.rotation.z = -Math.PI;
    camera = new THREE.TargetCamera(50, width / height, 1, 20000);


    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);

    // player
    createPlayer();

    // randome events
    addRandomEvents();

    // controls
    controls = new THREE.FirstPersonControls(player);

    controls.movementSpeed = 100;
    controls.lookSpeed = 0.125;
    controls.lookVertical = false;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;

    //controls = new ObjectControls( {
    //    mousePos: mousePos,
    //    targetObject: player
    //});

    // lights

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xcccccc, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    //scene.add(directionalLight);

    // add lights to scene
    addPointLights();

    // terrain
    generateCitySkyline();
    addBuildingsToScene();

    // keyevent
    registerKeyEvents();

    // renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.innerHTML = "";

    container.appendChild(renderer.domElement);


    // stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    //stats.setMode(1);
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

}


/**
 *  resize event
 */
function onWindowResize() {

    var width = window.innerWidth,
        height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width / height);

    controls.handleResize();

}


/**
 *  animation function
 */
function animate() {

    requestAnimationFrame(animate);

    render();

}


/**
 * check for collision
 */
function checkCollision() {
    var originPoint = player.position.clone();

    for (var vertexIndex = 0; vertexIndex < player.geometry.vertices.length; vertexIndex++) {

        var localVertex = player.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(player.matrix);
        var directionalVector = globalVertex.sub(player.position);

        var ray = new THREE.Raycaster(originPoint, directionalVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);

        if (collisionResults.length > 0 && collisionResults[0].distance < directionalVector.length()) {
            console.log('hit', collisionResults[0].object.name);
        }
    }
}

/**
 *  create the height of the buildingsd
 * @param width
 * @param height
 * @returns {Array}
 */
function generateHeight(width, height) {

    var data = [],
        perlin = new ImprovedNoise(),
        size = width * height,
        quality = 2,
        z = Math.random() * 100;

    for (var j = 0; j < 4; j++) {

        if (j == 0) {

            for (var i = 0; i < size; i++) {
                data[i] = 0;
            }
        }

        for (var i = 0; i < size; i++) {

            var x = i % width, y = ( i / width ) | 0;
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality) + minHeight;
        }

        quality *= 6

    }

    return data;

}

/**
 *  generate the streets
 */
function generateCitySkyline() {


    for (var z = 0; z < worldDepth; z++) {

        setY(worldHalfWidth, z, 0);
        setY(worldHalfWidth + 1, z, 0);
        setY(worldHalfWidth - 1, z, 0);


        if (z % cellWidth == 0) {
            for (var x = 0; x < worldWidth; x++) {

                setY(x, z + 1, 0);
                setY(x, z, 0);
                setY(x, z - 1, 0);

            }
        }
    }


}

/**
 *
 * create the skyscraper look
 */
function addBuildingsToScene() {

    for (var z = 0; z < worldDepth; z++) {

        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            if (h === 0) continue;

            var boxGeometry = new THREE.BoxGeometry(boxWidth, h, boxDepth);
            var boxMaterial = new THREE.MeshPhongMaterial({
                color: 0xcccccc,
                specular: 0x444444,
                shininess: 30,
                shading: THREE.FlatShading
            });

            //boxMaterial.castShadow = true;
            //boxMaterial.receiveShadow = true;

            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(x * (boxWidth + boxWidth / 4), h / 2, z * (boxDepth + boxDepth / 4));

            scene.add(box);

        }

    }
}

/**
 *
 * add random point light to scene
 */
function addPointLights() {

    for (var i = 0; i < pointLightsCount; i++) {

        var light = new THREE.PointLight(Math.random() * 0xffffff, 1, Math.random() + 50);

        // light.position.set(Math.random() * worldWidth, Math.random() * 100, Math.random() * worldDepth);
        light.position.x = Math.random() * totalWorldWidth;
        light.position.y = 10;
        light.position.z = Math.random() * totalWorldDepth;

        //light.castShadow = true;
        //
        //light.shadowCameraNear = 1200;
        //light.shadowCameraFar = 2500;
        //light.shadowCameraFov = 50;
        //
        ////light.shadowCameraVisible = true;
        //
        //light.shadowBias = 0.0001;
        //
        //light.shadowMapWidth = SHADOW_MAP_WIDTH;
        //light.shadowMapHeight = SHADOW_MAP_HEIGHT;


        scene.add(light);
    }
}


/**
 * add player to scene
 */
function createPlayer() {


    // create Player

    // 100, 14.6, 50
    var geometry = new THREE.SphereGeometry(10, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        color: 0xcc0000,
        specular: 0x444444,
        shininess: -100, // 30
        diffuse: 100, // none
        shading: THREE.FlatShading
    });

    player = new THREE.Mesh(geometry, material);
    player.position.set(100, 16, 50);
    scene.add(player);

    // set camera perspective

    camera.addTarget({
        name: 'map',
        targetObject: player,
        cameraPosition: new THREE.Vector3(0, 200, 20),
        stiffness: 0.3,
        fixed: false
    });

    camera.addTarget({
        name: 'first',
        targetObject: player,
        cameraPosition: new THREE.Vector3(0, 0, 32),
        stiffness: 0.5,
        fixed: false
    });

    camera.setTarget('first');
}


function addRandomEvents() {

    // events

    var zPos = 125;
    for (var i = 0; i < 8; i++) {
        var geometry = new THREE.SphereGeometry(10, 20, 20);
        var material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xcccccc,
            specular: 0xc0c0c0,
            shininess: 30, // 30
            shading: THREE.FlatShading
        });

        var randomEvent = new THREE.Mesh(geometry, material);

        var xPos = i % 2 == 0 ? 30 : 160;

        randomEvent.position.set(xPos, 16, zPos);
        zPos += (xPos  === 160 ? 125 : 0);


        console.log(randomEvent.position);
        randomEvent.name = 'randomEvent-' + i;
        collidableMeshList.push(randomEvent);
        scene.add(randomEvent);
    }


}
/**
 *
 */
function registerKeyEvents() {
    var onKeyDown = function (event) {

        console.log(event, event.keyCode);

        switch (event.keyCode) {
            case 80:

                console.log(player.position);
                break;


            //case 73: // i
            //    if(++stateMode == 2) {
            //        stats.setMode(stateMode);
            //        console.lo^g(stats.);
            //    } else {
            //        stateMode = -1;
            //    }
            //    stats.update();
            //
            //
            //
            //break;

            case 77: // m


                if (camera.currentTargetName === 'first') {
                    // change camera
                    camera.setTarget('map');

                    // remove eventlistener
                    // document.removeEventListener('mousemove',  onMouseMove, false );
                    mousePos.set(0, 0);


                }
                else {
                    camera.setTarget('first');

                    // document.addEventListener( 'mousemove', onMouseMove, false );

                }

                break;

            //case 38: // up
            //case 87: // w
            //    moveForward = false;
            //    break;

            //case 37: // left
            //case 65: // a
            //    moveLeft = false;
            //    break;
            //
            //case 40: // down
            //case 83: // s
            //    moveBackward = false;
            //    break;
            //
            //case 39: // right
            //case 68: // d
            //    moveRight = false;
            //    break;

        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 87: // w
            case 38: // up
                //controls.setForward(false);
                break;
        }

    };

    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('mousemove', onMouseMove, false);

}

/**
 *
 * @param x
 * @param z
 * @returns {number}
 */
function getY(x, z) {

    return ( data[x + z * worldWidth] * 0.5 ) | 0;

}

/**
 *
 * @param x
 * @param z
 * @param v
 */
function setY(x, z, v) {

    data[x + z * worldWidth] = v;
}


/**
 *
 */
function render() {

    stats.update();
    controls.update(clock.getDelta());
    renderer.render(scene, camera);

    camera.update();


    //  var time = Date.now() * 0.005;

    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;

    animateCamera(delta);

    checkCollision();


    //console.log(camera.rotation);

    //
    //light1.position.x = Math.sin(time * 7) * 30;
    //light1.position.y = Math.cos(time * 5) * 40;
    //light1.position.z = Math.cos(time * 3) * 30;

    //console.log(light1.position);

    //light2.position.x = Math.cos( time * 0.3 ) * 30;
    //light2.position.y = Math.sin( time * 0.5 ) * 40;
    //light2.position.z = Math.sin( time * 0.7 ) * 30;
    //
    //light3.position.x = Math.sin( time * 0.7 ) * 30;
    //light3.position.y = Math.cos( time * 0.3 ) * 40;
    //light3.position.z = Math.sin( time * 0.5 ) * 30;
    //
    //light4.position.x = Math.sin( time * 0.3 ) * 30;
    //light4.position.y = Math.cos( time * 0.7 ) * 40;
    //light4.position.z = Math.sin( time * 0.5 ) * 30;

}


/**
 *
 * @param event
 */
function onMouseMove(event) {

    var x = event.pageX - (window.innerWidth / 2),
        y = event.pageY - (window.innerHeight / 2),
        threshold = 15;

    if ((x > 0 && x < threshold) || (x < 0 && x > -threshold)) {
        x = 0;
    }

    if ((y > 0 && y < threshold) || (y < 0 && y > -threshold)) {
        y = 0;
    }

    mousePos.set(x, y);
}
/**
 *
 * @param delta
 */
function animateCamera(delta) {

    camera.lookAt(player.position);
    // toggle camera
    //if(showMap) {
    //    camera.position.y = 500 ;
    //   // camera.rotation.y = -Math.PI/2;
    //
    //    camera.lookAt( player.position );
    //
    // //   console.log(camera.rotation.set(0, -Math.PI /2 , 0));
    //
    //}

    //console.log(camera.position, camera.rotation.x, camera.rotation.y, camera.rotation.z);

}

/**
 *
 * @param id
 * @param light
 * @returns {THREE.ShaderMaterial}
 */
function createShaderMaterial(id, light) {

    var shader = THREE.ShaderTypes[id];

    var u = THREE.UniformsUtils.clone(shader.uniforms);

    var vs = shader.vertexShader;
    var fs = shader.fragmentShader;

    var material = new THREE.ShaderMaterial({uniforms: u, vertexShader: vs, fragmentShader: fs});

    material.uniforms.uDirLightPos.value = light.position;
    material.uniforms.uDirLightColor.value = light.color;

    return material;
}
