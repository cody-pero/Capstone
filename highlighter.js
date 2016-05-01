/**
 * Functions for manipulating the mesh highlight feature
 * @author Charles Hreha
 */

// the out line mesh object
var outlineMesh;
// the out line objects material
var outLineMaterial;



// returns the state of the highlighter
function returnState() {
    return highlighted;
}

// creates a new highlighter based off the mesh selected
function createHighlighter() {
    outLineMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.BackSide});
    outlineMesh = new THREE.Mesh(mesh.geometry, outLineMaterial);
    outlineMesh.name = "default";
    outlineMesh.position.x = mesh.position.x;
    outlineMesh.position.y = mesh.position.y;
    outlineMesh.position.z = mesh.position.z;
    outlineMesh.scale.x = mesh.scale.x + (mesh.scale.x * .1);
    outlineMesh.scale.y = mesh.scale.y + (mesh.scale.y * .1);
    outlineMesh.scale.z = mesh.scale.z + (mesh.scale.z * .1);
    outlineMesh.rotation.x = mesh.rotation.x;
    outlineMesh.rotation.y = mesh.rotation.y;
    outlineMesh.rotation.z = mesh.rotation.z;
    scene.add(outlineMesh);

}

// moves the highlighter to the new position of the mesh
function moveHighlighter() {
    outlineMesh.position.x = mesh.position.x;
    outlineMesh.position.y = mesh.position.y;
    outlineMesh.position.z = mesh.position.z;

    outlineMesh.rotation.x = mesh.rotation.x;
    outlineMesh.rotation.y = mesh.rotation.y;
    outlineMesh.rotation.z = mesh.rotation.z;
}

// rescales the highlighter to the new size of the mesh
function rescaleHighlighter() {
    outlineMesh.scale.x = mesh.scale.x + (mesh.scale.x * .1);
    outlineMesh.scale.y = mesh.scale.y + (mesh.scale.y * .1);
    outlineMesh.scale.z = mesh.scale.z + (mesh.scale.z * .1);
}

// deletes the highlighter from the scene
function cleanupHighlighter() {
    scene.remove(outlineMesh);
}

