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
	selectBox.options.length = 0;
	for (var key in meshes) {
		var option = document.createElement("option");
		option.text = key;
		option.value = key;
		selectBox.add(option);
	}
}

function init() {
	scene = new THREE.Scene();
	meshes = {};
	var width = window.innerWidth * .8;
	var height = window.innerHeight * .9;
	this.aspRatio = width / height;
	this.viewLength = 1000;
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize(window.innerWidth, window.innerHeight);

	// The origin of our scene starts at the center of the screen and goes
	// viewLength / 2 in all directions
	this.camera = new THREE.OrthographicCamera(
		-this.aspRatio * this.viewLength / 2,
		this.aspRatio * this.viewLength / 2,
		this.viewLength / 2, -this.viewLength / 2, -1000, 1000
	);
	this.camera.z = 1000;

	var element = document.getElementById("WebGLCanvas");

	// We use || in case the element with the id passed in doesn't exist
	(element || document.body).appendChild(this.renderer.domElement);

	this.renderScene = function() {
		requestAnimationFrame(self.renderScene);
		self.renderer.render(self.scene, self.camera);
	};
}

function render() {
	renderer.render( scene, camera );
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
	id++;
	scene.add( mesh );
	// Repopulates the selectMesh dropdown list with the new mesh name
	rebuildDropDown();
	render();
};
document.getElementById('meshSelector').onchange = function() {
	mesh = meshes[document.getElementById('meshSelector').value];
	$(document).ready(function() {
		displayCubeToolbar();
	})
};


//**************************************************Listeners********************************************************//
// totally not working right now
window.addEventListener('onclick', onMouseClick, false);