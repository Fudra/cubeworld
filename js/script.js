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

var worldWidth = 10,
    worldDepth = 10,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2,
    data = generateHeight(worldWidth, worldDepth);

var clock = new THREE.Clock();

var light1, light2, light3, light4;

init();
animate();

function init() {

    var width = window.innerWidth,
        height = window.innerHeight;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 20000);
    camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;

    controls = new THREE.FirstPersonControls(camera);

    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.1;
    controls.verticalMax = 2.2;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.00015);

    // sides

    var light = new THREE.Color(0x111111);
    var shadow = new THREE.Color(0x505050);


    var sides = generateSides(100, 100, light, shadow);

    var terrain = generateTerrain(sides, shadow, light);

    // light

    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xcccccc, 2);
    directionalLight.position.set(1, 1, 0.5).normalize();
    scene.add(directionalLight);


    //var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );


    var sgeometry = new THREE.SphereGeometry(10, 64, 64);
    var smaterial = new THREE.MeshBasicMaterial({color: 0xcccc00});
    var sphere = new THREE.Mesh(sgeometry, smaterial);
    sphere.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;
    sphere.position.x = 10;
    scene.add(sphere);



    //for(var i = 0; i < 100; i++ ) {
    //    var cGeometry = new THREE.BoxGeometry(Math.random() * 1000 + 100,Math.random() * 100 + 200,Math.random() * 1000 + 100);
    //    var cMaterial = new THREE.MeshPhongMaterial({color: 0xcc0000});
    //    var cube = new THREE.Mesh(cGeometry, cMaterial);
    //    cube.position.y = Math.random() * worldWidth  + worldHalfWidth;
    //    cube.position.x = Math.random() * worldDepth + worldHalfDepth;
    //    scene.add(cube);
    //}




    light1 = new THREE.PointLight(0xff0040, 2, 500);
    //light1.add( new THREE.Mesh( mesh, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );

    light1.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;
    scene.add(light1);

    light2 = new THREE.PointLight(0x0040ff, 2, 50);
    //light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    //scene.add( light2 );

    light3 = new THREE.PointLight(0x80ff80, 2, 50);
    //light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    //scene.add( light3 );

    light4 = new THREE.PointLight(0xffaa00, 2, 50);
    //light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    //scene.add( light4 );


    // material

    var materialColor = new THREE.Color();
    materialColor.setRGB(0.95, 0.95, 0.95);

    var phongMaterial = createShaderMaterial("phongDiffuse", directionalLight);
    phongMaterial.uniforms.uMaterialColor.value.copy(materialColor);
    phongMaterial.side = THREE.DoubleSide;



    var material = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        specular: 0x444444,
        shininess: 30,
        shading: THREE.SmoothShading
    });

    mesh = new THREE.Mesh(terrain, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    container.innerHTML = "";

    container.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);

    //

    console.log(data, data.length);

    window.addEventListener('resize', onWindowResize, false);

}


function generateTerrain2() {

    for (var z = 0; z < worldDepth; z++) {

        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);


        }
    }
}


/**sa
 *
 * @param width
 * @param height
 * @param light
 * @param shadow
 * @returns {{pxGeometry: THREE.PlaneGeometry, nxGeometry: THREE.PlaneGeometry, pyGeometry: THREE.PlaneGeometry, py2Geometry: THREE.PlaneGeometry, pzGeometry: THREE.PlaneGeometry, nzGeometry: THREE.PlaneGeometry}}
 */
function generateSides(width, height, light, shadow) {


    var pxGeometry = new THREE.PlaneGeometry(width, height);
    pxGeometry.faces[0].vertexColors = [light, shadow, light];
    pxGeometry.faces[1].vertexColors = [shadow, shadow, light];
    pxGeometry.faceVertexUvs[0][0][0].y = 0.5;
    pxGeometry.faceVertexUvs[0][0][2].y = 0.5;
    pxGeometry.faceVertexUvs[0][1][2].y = 0.5;
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(50, 0, 0);

    var nxGeometry = new THREE.PlaneGeometry(width, height);
    nxGeometry.faces[0].vertexColors = [light, shadow, light];
    nxGeometry.faces[1].vertexColors = [shadow, shadow, light];
    nxGeometry.faceVertexUvs[0][0][0].y = 0.5;
    nxGeometry.faceVertexUvs[0][0][2].y = 0.5;
    nxGeometry.faceVertexUvs[0][1][2].y = 0.5;
    nxGeometry.rotateY(-Math.PI / 2);
    nxGeometry.translate(-50, 0, 0);

    var pyGeometry = new THREE.PlaneGeometry(width, height);
    pyGeometry.faces[0].vertexColors = [light, light, light];
    pyGeometry.faces[1].vertexColors = [light, light, light];
    pyGeometry.faceVertexUvs[0][0][1].y = 0.5;
    pyGeometry.faceVertexUvs[0][1][0].y = 0.5;
    pyGeometry.faceVertexUvs[0][1][1].y = 0.5;
    pyGeometry.rotateX(-Math.PI / 2);
    pyGeometry.translate(0, 50, 0);

    var py2Geometry = new THREE.PlaneGeometry(width, height);
    py2Geometry.faces[0].vertexColors = [light, light, light];
    py2Geometry.faces[1].vertexColors = [light, light, light];
    py2Geometry.faceVertexUvs[0][0][1].y = 0.5;
    py2Geometry.faceVertexUvs[0][1][0].y = 0.5;
    py2Geometry.faceVertexUvs[0][1][1].y = 0.5;
    py2Geometry.rotateX(-Math.PI / 2);
    py2Geometry.rotateY(Math.PI / 2);
    py2Geometry.translate(0, 50, 0);

    var pzGeometry = new THREE.PlaneGeometry(width, height);
    pzGeometry.faces[0].vertexColors = [light, shadow, light];
    pzGeometry.faces[1].vertexColors = [shadow, shadow, light];
    pzGeometry.faceVertexUvs[0][0][0].y = 0.5;
    pzGeometry.faceVertexUvs[0][0][2].y = 0.5;
    pzGeometry.faceVertexUvs[0][1][2].y = 0.5;
    pzGeometry.translate(0, 0, 50);

    var nzGeometry = new THREE.PlaneGeometry(width, height);
    nzGeometry.faces[0].vertexColors = [light, shadow, light];
    nzGeometry.faces[1].vertexColors = [shadow, shadow, light];
    nzGeometry.faceVertexUvs[0][0][0].y = 0.5;
    nzGeometry.faceVertexUvs[0][0][2].y = 0.5;
    nzGeometry.faceVertexUvs[0][1][2].y = 0.5;
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, -50);

    return {
        pxGeometry: pxGeometry,
        nxGeometry: nxGeometry,
        pyGeometry: pyGeometry,
        py2Geometry: py2Geometry,
        pzGeometry: pzGeometry,
        nzGeometry: nzGeometry

    }
}

/**
 *
 * @param sides
 * @param shadow
 * @param light
 * @returns {THREE.Geometry}
 */
function generateTerrain(sides, shadow, light) {

    var geometry = new THREE.Geometry();
    var matrix = new THREE.Matrix4();


    for (var z = 0; z < worldDepth; z++) {

        for (var x = 0; x < worldWidth; x++) {

            var h = getY(x, z);

            matrix.makeTranslation(
                x * 100 - worldHalfWidth * 100,
                h * 100 ,
                z * 100 - worldHalfDepth * 100
            );

            var px = getY(x + 1, z);
            var nx = getY(x - 1, z);
            var pz = getY(x, z + 1);
            var nz = getY(x, z - 1);

            var pxpz = getY(x + 1, z + 1);
            var nxpz = getY(x - 1, z + 1);
            var pxnz = getY(x + 1, z - 1);
            var nxnz = getY(x - 1, z - 1);

            var a = nx > h || nz > h || nxnz > h ? 0 : 1;
            var b = nx > h || pz > h || nxpz > h ? 0 : 1;
            var c = px > h || pz > h || pxpz > h ? 0 : 1;
            var d = px > h || nz > h || pxnz > h ? 0 : 1;

            if (a + c > b + d) {

                var colors = sides.py2Geometry.faces[0].vertexColors;
                colors[0] = b === 0 ? shadow : light;
                colors[1] = c === 0 ? shadow : light;
                colors[2] = a === 0 ? shadow : light;

                var colors = sides.py2Geometry.faces[1].vertexColors;
                colors[0] = c === 0 ? shadow : light;
                colors[1] = d === 0 ? shadow : light;
                colors[2] = a === 0 ? shadow : light;

                geometry.merge(sides.py2Geometry, matrix);

            } else {

                var colors = sides.pyGeometry.faces[0].vertexColors;
                colors[0] = a === 0 ? shadow : light;
                colors[1] = b === 0 ? shadow : light;
                colors[2] = d === 0 ? shadow : light;

                var colors = sides.pyGeometry.faces[1].vertexColors;
                colors[0] = b === 0 ? shadow : light;
                colors[1] = c === 0 ? shadow : light;
                colors[2] = d === 0 ? shadow : light;

                geometry.merge(sides.pyGeometry, matrix);

            }

            if (( px != h && px != h + 1 ) || x == 0) {

                var colors = sides.pxGeometry.faces[0].vertexColors;
                colors[0] = pxpz > px && x > 0 ? shadow : light;
                colors[2] = pxnz > px && x > 0 ? shadow : light;

                var colors = sides.pxGeometry.faces[1].vertexColors;
                colors[2] = pxnz > px && x > 0 ? shadow : light;

                geometry.merge(sides.pxGeometry, matrix);

            }

            if (( nx != h && nx != h + 1 ) || x == worldWidth - 1) {

                var colors = sides.nxGeometry.faces[0].vertexColors;
                colors[0] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
                colors[2] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

                var colors = sides.nxGeometry.faces[1].vertexColors;
                colors[2] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

                geometry.merge(sides.nxGeometry, matrix);

            }

            if (( pz != h && pz != h + 1 ) || z == worldDepth - 1) {

                var colors = sides.pzGeometry.faces[0].vertexColors;
                colors[0] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
                colors[2] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

                var colors = sides.pzGeometry.faces[1].vertexColors;
                colors[2] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

                geometry.merge(sides.pzGeometry, matrix);

            }

            if (( nz != h && nz != h + 1 ) || z == 0) {

                var colors = sides.nzGeometry.faces[0].vertexColors;
                colors[0] = pxnz > nz && z > 0 ? shadow : light;
                colors[2] = nxnz > nz && z > 0 ? shadow : light;

                var colors = sides.nzGeometry.faces[1].vertexColors;
                colors[2] = nxnz > nz && z > 0 ? shadow : light;

                geometry.merge(sides.nzGeometry, matrix);

            }

        }

    }

    return geometry;
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

//function loadTexture( path, callback ) {
//
//    var image = new Image();
//
//    image.onload = function () { callback(); };
//    image.src = path;
//
//    return image;
//
//}

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
            data[i] += perlin.noise(x / quality, y / quality, z) * quality;

        }

        quality *= 3

    }

    return data;

}

/**
 *
 * @param x
 * @param z
 * @returns {number}
 */
function getY(x, z) {

    return ( data[x + z * worldWidth] * 0.2 ) | 0;

}

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
