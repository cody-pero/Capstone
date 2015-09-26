// Standard stuff for three.js
var camera, scene, renderer,
	geometry, material, mesh,
	container, containerWidth, containerHeight,
	raycaster, mouseVector;

// key value pair of shape names holding reference to the meshes
var meshes;
var grid;
// current available id number for mesh
var id = 0;
// Used to tell the time from the last render call, for smoother supposedly smoother animation but thats not working yet to test
var clock = new THREE.Clock();
// The controls for the camera
var trackballControls;
var objects;
// Gets stuff going
init();
render();

// Initializes the scene world variables
function init() {
	scene = new THREE.Scene();
	meshes = {};
	objects = [];
	container = document.getElementById("WebGLCanvas");
	containerWidth = container.clientWidth;
	containerHeight = container.clientHeight;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(containerWidth, containerHeight );
	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;

	trackballControls = new THREE.TrackballControls( camera , container);
	trackballControls.rotateSpeed = 1.0;
	trackballControls.zoomSpeed = 1.2;
	trackballControls.panSpeed = 0.8;

	addGrid();
	raycaster = new THREE.Raycaster();
	mouseVector = new THREE.Vector2();
//	container.addEventListener( 'mousedown', onMouseClick, false );
}
/*
function onMouseClick( event ) {
	event.preventDefault();
	mouseVector.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
	mouseVector.y = -( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
	alert("here");
	raycaster.setFromCamera( mouseVector, camera );

	var intersects = raycaster.intersectObjects( scene.children );
	if(intersects.length > 0 ) {
		alert("x = " + mouseVector.x  + "\ny = " + mouseVector.y );
	} else {
		alert("miss");
	}



}
*/
function render() {
	// Returns the amount of time since the last call to getDelta();
	var delta = clock.getDelta();
	// Keeps calling render at a steady rate
	requestAnimationFrame(render);
	// Updates the camera controls
	trackballControls.update(delta);
	//renders the scene
	renderer.render( scene, camera );

}
// Adds the grid to the scene
function addGrid() {
	material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	geometry = new THREE.Geometry();
	var maxCameraLength = 10000;
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( maxCameraLength, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( -maxCameraLength, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, maxCameraLength, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, -maxCameraLength, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, maxCameraLength ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, -maxCameraLength ) );
	grid = new THREE.Line( geometry, material );
	scene.add( grid );
}

function hideGrid() {
	grid.visible = false;
}

function showGrid() {
	grid.visible = true;
}
// Function for displaying the scene elements in the drop down
function rebuildDropDown() {
	var selectBox = document.getElementById('meshSelector');
	selectBox.options.length = 0;
	for (var key in meshes) {
		var option = document.createElement("option");
		option.text = key;
		option.value = key;
		selectBox.add(option);
	}
}
//******************************Stuff that makes the buttons work****************************************************//

// Handles adding a new mesh to the scene by reading in the selected drop down item and creating the proper geometry
document.getElementById('place_butt').onclick = function() {
	if ( document.getElementById('shapeSelector').value == 'Cube') {
		geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
	} else if ( document.getElementById('shapeSelector').value == 'Plane') {
		geometry = new THREE.PlaneGeometry(200, 200, 1);
	} else if ( document.getElementById('shapeSelector').value == 'Sphere') {
		geometry = new THREE.SphereGeometry( 200, 8, 6);
	} else if ( document.getElementById('shapeSelector').value == 'Cylinder') {
		geometry = new THREE.CylinderGeometry(200, 200, 200, 8);
	}
	// Material for the new mesh
	material = new THREE.MeshBasicMaterial( { color: 0x00ff00 , wireframe: true} );
	// Creating the new mesh
	mesh = new THREE.Mesh( geometry, material );
	// Associates a name with the mesh, not sure if name was a part of a mesh object so named it name2 for now
	mesh.name2 = document.getElementById('shapeSelector').value + id;
	// Adds to the list of meshes in the scene for future reference
	meshes[ mesh.name2 ] = mesh;
	objects.push( mesh );
	id++;
	scene.add( mesh );
	// Repopulates the selectMesh dropdown list with the new mesh name
	rebuildDropDown();
};
document.getElementById('show_grid').onclick = function() {

	showGrid();
};
document.getElementById('hide_grid').onclick = function() {
	hideGrid();
};
document.getElementById('meshSelector').onchange = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	$(document).ready(function() {
		displayCubeToolbar();
	})
};


