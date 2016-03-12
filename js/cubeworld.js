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
    minHeight = 10;

var worldWidth = 16,
    worldDepth = 50,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2,
    data = generateHeight(worldWidth, worldDepth);

var clock = new THREE.Clock();


init();
animate();

function init() {


    var width = window.innerWidth,
        height = window.innerHeight;

    container = document.getElementById('container');


    // camera
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 20000);
    camera.position.y = getY(worldHalfWidth, worldHalfDepth); //* 100 + 100;


    // controls
    controls = new THREE.FirstPersonControls(camera);

    controls.movementSpeed = 100;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;


    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.0015);


    // lights

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xcccccc, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    scene.add(directionalLight);


    // terrain

    generateTerrainData();
    generateTerrain();
    console.log(data);

    // renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    container.innerHTML = "";

    container.appendChild(renderer.domElement);


    // stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    window.addEventListener('resize', onWindowResize, false);

}


/**
 *
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
 *
 */
function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

/**
 *
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
            data[i] += Math.abs( perlin.noise(x / quality, y / quality, z) * quality ) + minHeight;

        }

        quality *= 4

    }

    return data;

}


function generateTerrainData() {
    // space out main route

    // x -> worldWidth;
    // z -> worldDepth

    for (var z = 0; z < worldDepth; z++) {

        setY(worldHalfWidth, z, 0);
        setY(worldHalfWidth + 1, z, 0);
        setY(worldHalfWidth - 1, z, 0);

    }
}

function generateTerrain() {

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

            var box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(x * (boxWidth + boxWidth / 4), h/2 , z * (boxDepth + boxDepth / 4));

            scene.add(box);

        }

    }
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

    controls.update(clock.getDelta());
    renderer.render(scene, camera);


    var time = Date.now() * 0.005;

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
