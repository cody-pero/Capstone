// Standard stuff for three.js
var camera, scene, renderer,
	geometry, material, mesh;

//key value pair of shape names holding reference to the meshes
var meshes;
//current available id number for mesh
var id = 0;

init();
render();

function rebuildDropDown() {
	var selectBox = document.getElementById('meshSelector');
	var option = document.createElement("option");
	option.text = mesh.name2;
	option.value = mesh.name2;
	selectBox.add(option);
}

function init() {
	scene = new THREE.Scene();
	mouse = new THREE.Vector3();
	projector = new THREE.Projector();
	meshes = {};

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.getElementById("WebGLCanvas").appendChild(renderer.domElement);
}

function render() {
	renderer.render( scene, camera );
}

//******************************Stuff that makes the buttons work****************************************************//

// Handles adding a new mesh to the scene by reading in the selected drop down item and creating the proper geometry
document.getElementById('place_butt').onclick = function() {
	if ( document.getElementById('shapeSelector').value == 'Cube') {
		geometry = new THREE.BoxGeometry(200, 200, 200);
	} else if ( document.getElementById('shapeSelector').value == 'Plane') {
		geometry = new THREE.PlaneGeometry(200, 200, 1);
	} else if ( document.getElementById('shapeSelector').value == 'Sphere') {
		geometry = new THREE.SphereGeometry( 200, 8, 6);
	} else if ( document.getElementById('shapeSelector').value == 'Cylinder') {
		geometry = new THREE.CylinderGeometry(200, 200, 200, 8);
	}
	// Material for the new mesh
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	// Creating the new mesh
	mesh = new THREE.Mesh( geometry, material );
	// Associates a name with the mesh, not sure if name was a part of a mesh object so named it name2 for now
	mesh.name2 = document.getElementById('shapeSelector').value + id;
	// Adds to the list of meshes in the scene for future reference
	meshes[ mesh.name2 ] = mesh;
	id++;
	scene.add( mesh );
	// Repopulates the selectMesh dropdown list with the new mesh name
	rebuildDropDown();
	render();
}
// Rotates the currently selected mesh left
document.getElementById('left_rot_butt').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	mesh.rotation.y += 0.1;
	render();
}
// Rotates the currently selected mesh right
document.getElementById('right_rot_butt').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	mesh.rotation.y -= 0.1;
	render();
}
// Moves the currently selected mesh to the coordinates in the input fields
document.getElementById('move_shape_butt').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
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
// Scales the currently selected mesh down
document.getElementById('down_butt').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	mesh.scale.set(mesh.scale.x - .1, mesh.scale.y - .1, mesh.scale.z - .1);
	render();
}
// Scales the currently selected mesh up
document.getElementById('up_butt').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	mesh.scale.set(mesh.scale.x + .1, mesh.scale.y + .1, mesh.scale.z + .1);
	render();
}

//**************************************************Listeners********************************************************//
// totally not working right now
window.addEventListener('onclick', onMouseClick, false);