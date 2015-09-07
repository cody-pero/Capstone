    var camera, scene, renderer,
    geometry, material, mesh;
    
    document.getElementById('place_butt').onclick = function() {
    	init();
	    render();
	}
	document.getElementById('left_rot_butt').onclick = function() {
		mesh.rotation.y += 0.1;
		render();
	}
	document.getElementById('right_rot_butt').onclick = function() {
		mesh.rotation.y -= 0.1;
		render();
	}
	document.getElementById('move_shape_butt').onclick = function() {

		if(document.getElementById('x_input').value != "x")
		{
			mesh.translateX(document.getElementById('x_input').value);
		}
		if(document.getElementById('y_input').value != "y")
		{
			mesh.translateY(document.getElementById('y_input').value);
		}
		if(document.getElementById('z_input').value != "z")
		{
			mesh.translateZ(document.getElementById('z_input').value);
		}

		render();
	}	
	document.getElementById('down_butt').onclick = function() {
		mesh.scale.set(mesh.scale.x - .1, mesh.scale.y - .1, mesh.scale.z - .1);
		render();
	}
		document.getElementById('up_butt').onclick = function() {
		mesh.scale.set(mesh.scale.x + .1, mesh.scale.y + .1, mesh.scale.z + .1);
		render();
	}
	
    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
    }

    function render() {
        renderer.render( scene, camera );
    }