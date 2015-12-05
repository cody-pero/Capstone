/**
 * Created by Charlie on 10/20/2015.
 */
var outlineMesh;
var outLineMaterial;
/*
var yArrow, xArrow, zArrow;
var arrowArray;
var origin;
var arrowLength;
var xDir = new THREE.Vector3( 1, 0, 0 );
var yDir = new THREE.Vector3( 0, 1, 0 );
var zDir = new THREE.Vector3( 0, 0, 1 );
var xColor = 0x0000FF;
var yColor = 0x00FF00;
var zColor = 0xFF0000;
*/
var highlighted = false;
function returnState() {
    return highlighted;
}
function createHighlighter() {
    outLineMaterial =  new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.BackSide } );
    outlineMesh = new THREE.Mesh( mesh.geometry, outLineMaterial );
    outlineMesh.name = "default";
    outlineMesh.position.x = mesh.position.x;
    outlineMesh.position.y = mesh.position.y;
    outlineMesh.position.z = mesh.position.z;
    outlineMesh.scale.x = mesh.scale.x + .1;
    outlineMesh.scale.y = mesh.scale.y + .1;
    outlineMesh.scale.z = mesh.scale.z + .1;
    scene.add( outlineMesh );
    highlighted = true;
//    addArrows();
//    hideArrows();
}
/*
function addArrows() {
    origin = mesh.position;
    arrowLength = mesh.scale.x * 2;
    xArrow = new THREE.ArrowHelper( xDir, origin, arrowLength, xColor, .5, .3 );
    xArrow.name = 'default';
    scene.add( xArrow );
    arrowLength = mesh.scale.y * 2;
    yArrow = new THREE.ArrowHelper( yDir, origin, arrowLength, yColor, .5, .3 );
    yArrow.name = 'default';
    arrowLength = mesh.scale.z * 2;
    scene.add( yArrow );
    zArrow = new THREE.ArrowHelper( zDir, origin, arrowLength, zColor, .5, .3 );
    zArrow.name = 'default';
    scene.add( zArrow );
    arrowArray = [ yArrow, xArrow, zArrow ];
}
*/
function showHighlighter() {
    outlineMesh.visible = true;
    //showArrows();
}
function hideHighlighter() {
    outlineMesh.visible = false;
    //hideArrows();
}
function moveHighlighter() {
    outlineMesh.position.x = mesh.position.x;
    outlineMesh.position.y = mesh.position.y;
    outlineMesh.position.z = mesh.position.z;

    outlineMesh.rotation.x = mesh.rotation.x;
    outlineMesh.rotation.y = mesh.rotation.y;
    outlineMesh.rotation.z = mesh.rotation.z;
}
function rescaleHighlighter() {
    outlineMesh.scale.x = mesh.scale.x;
    outlineMesh.scale.y = mesh.scale.y;
    outlineMesh.scale.z = mesh.scale.z;
}
/*
function hideArrows() {
    yArrow.visible = false;
    xArrow.visible = false;
    zArrow.visible = false;
}
function showArrows() {
    xArrow.visible = true;
    yArrow.visible = true;
    zArrow.visible = true;
}
function newArrowOrigin() {
    xArrow.position.x = mesh.position.x;
    xArrow.position.y = mesh.position.y;
    xArrow.position.z = mesh.position.z;

    yArrow.position.x = mesh.position.x;
    yArrow.position.y = mesh.position.y;
    yArrow.position.z = mesh.position.z;

    zArrow.position.x = mesh.position.x;
    zArrow.position.y = mesh.position.y;
    zArrow.position.z = mesh.position.z;


}
function resizeArrows() {
    xArrow.setLength(mesh.scale.x);
    yArrow.setLength (mesh.scale.y);
    zArrow.setLength(mesh.scale.z);
}
function updateArrows() {
    newArrowOrigin();
    resizeArrows();
}
*/
function cleanupHighlighter() {
    highlighted = false;
//    scene.remove(xArrow);
    scene.remove(outlineMesh);
//    scene.remove(yArrow);
//    scene.remove(zArrow);
}

