

$(function() {
'use strict' ;

    var scene;
    var camera;
    var renderer;
    var controls;

    var cube;

   function init() {

       /* create Scene */
       scene = new THREE.Scene();

       /* create camera */
       var WIDTH = window.innerWidth,
           HEIGHT = window.innerHeight;

       camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 );
       camera.position.set(0,6,0);
       scene.add(camera);

       /* create renderer*/
       renderer = new THREE.WebGLRenderer();
       renderer.setSize( WIDTH, HEIGHT );

       document.body.appendChild( renderer.domElement );


       // Create an event listener that resizes the renderer with the browser window.
       window.addEventListener('resize', function() {
           var WIDTH = window.innerWidth,
               HEIGHT = window.innerHeight;
           renderer.setSize(WIDTH, HEIGHT);
           camera.aspect = WIDTH / HEIGHT;
           camera.updateProjectionMatrix();
           console.log('resize');
       });


       // Set the background color of the scene.
       //
       //var color = new THREE.Color(0, 20, 30);
       //renderer.setClearColor(color,1);


       // Create a light, set its position, and add it to the scene.
       var light = new THREE.PointLight(0xffffff);
       light.position.set(-100,200,100);
       scene.add(light);


       var geometry = new THREE.BoxGeometry(10, 10, 10);
       //var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
       var material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
        cube = new THREE.Mesh(geometry, material);
       scene.add(cube);
       console.log(scene);

       camera.position.z = 15;

       //controls = new THREE.OrbitControls(camera, renderer.domElement);
   }

    function animate() {

        // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimationFrame(animate);

        // Render the scene.
        renderer.render(scene, camera);
        //console.lgo('animate');
        //controls.update();
        cube.rotation.z += .05;
        cube.rotation.x += .05;
    }
    init();
    animate();

    console.log(renderer);


});




