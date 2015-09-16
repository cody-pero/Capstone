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
	this.renderer.setSize(width, height);

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
document.getElementById('meshSelector').onclick = function() {
	mesh = meshes[document.getElementById('meshSelector').value];

	// The html elements needed for the mesh toolbar
	$(document).ready(function() {
		$("#editorDiv").empty();
		$("#editorDiv").append(
			'<button id = "delete_butt" style="width: 100%">Delete</button>' +
			'<button id = "left_rot_butt" class = "toolbar_butt">Rotate Left</button>' +
			'<button id = "right_rot_butt" class = "toolbar_butt">Rotate Right</button>' +
			'<button id = "up_rot_butt" class = "toolbar_butt">Rotate Up</button>' +
			'<button id = "down_rot_butt" class = "toolbar_butt">Rotate Down</button>' +
			'<button id = "move_forward_butt" class = "toolbar_butt">Move Forward</button>' +
			'<button id = "move_back_butt" class = "toolbar_butt">Move Back</button>' +
			'<button id = "move_up_butt" class = "toolbar_butt">Move Up</button>' +
			'<button id = "move_down_butt" class = "toolbar_butt">Move Down</button>' +
			'<button id = "move_left_butt" class = "toolbar_butt">Move Left</button>' +
			'<button id = "move_right_butt" class = "toolbar_butt">Move Right</button>' +
			'<button id = "scale_up_butt" class = "toolbar_butt">Scale Up</button>' +
			'<button id = "scale_down_butt" class = "toolbar_butt">Scale Down</button>' +
			'<label class = "toolbar_label">X position</label>' +
			'<input  id = "x_input" class = "toolbar_input" type = "text" name = "x_coordinate" value = "x">' +
			'<label class = "toolbar_label">Y position</label>' +
			'<input  id = "y_input" class = "toolbar_input" type = "text" name = "y_coordinate" value = "y">' +
			'<label class = "toolbar_label">Z position</label>' +
			'<input  id = "z_input" class = "toolbar_input" type = "text" name = "z_coordinate" value = "z">' +
			'<label class = "toolbar_label">X rotation</label>' +
			'<input  id = "x_rot_input" class = "toolbar_input" type = "text" name = "x_rotation" value = "x">' +
			'<label class = "toolbar_label">Y rotation</label>' +
			'<input  id = "y_rot_input" class = "toolbar_input" type = "text" name = "y_rotation" value = "y">' +
			'<label class = "toolbar_label">Z rotation</label>' +
			'<input  id = "z_rot_input" class = "toolbar_input" type = "text" name = "z_rotation" value = "z">' +
			'<button id = "save_settings_butt">Change position settings</button>'
		);
		// Setting the initial values in the input fields for position and rotation
		var element = document.getElementById("x_input")
		element.value = mesh.position.x;
		element = document.getElementById("y_input")
		element.value = mesh.position.y;
		element = document.getElementById("z_input")
		element.value = mesh.position.z;
		element = document.getElementById("x_rot_input")
		element.value = mesh.rotation.x;
		element = document.getElementById("y_rot_input")
		element.value = mesh.rotation.y;
		element = document.getElementById("z_rot_input")
		element.value = mesh.rotation.z;

		//**********************************place button code in here*********************************************//
		// Left Rotation button code
		document.getElementById('left_rot_butt').onclick = function() {
			mesh = meshes[document.getElementById('meshSelector').value];
			mesh.rotation.y += 0.1;
			render();
		}
		// Right Rotation button code
		document.getElementById('right_rot_butt').onclick = function() {
			mesh = meshes[document.getElementById('meshSelector').value];
			mesh.rotation.y -= 0.1;
			render();
		}
		// Delete button code
		document.getElementById('delete_butt').onclick = function() {
			var selectedMesh = meshes[document.getElementById('meshSelector').value];
			scene.remove(selectedMesh);
			delete meshes[selectedMesh.name2];
			rebuildDropDown();
			render();
		}
		// Change position settings button code
		document.getElementById('save_settings_butt').onclick = function() {
			mesh = meshes[document.getElementById('meshSelector').value];
			mesh.rotation.x = document.getElementById("x_rot_input").value;
			mesh.rotation.y = document.getElementById("y_rot_input").value;
			mesh.rotation.z = document.getElementById("z_rot_input").value;
			mesh.position.x = document.getElementById("x_input").value;
			mesh.position.y = document.getElementById("y_input").value;
			mesh.position.z = document.getElementById("z_input").value;
			render();
		}
		//******************************no more button code*******************************************************//
	})
}


//**************************************************Listeners********************************************************//
// totally not working right now
window.addEventListener('onclick', onMouseClick, false);