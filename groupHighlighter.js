/**
 * Created by Charlie on 4/10/2016.
 */
/**
 * Functions for manipulating the mesh highlight feature
 */

// the out line mesh object
var selectedGroupOutlineMeshes = [];
// the out line objects material

// creates a new highlighter based off the mesh selected
function createGroupHighlighter() {
    outLineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
    for(var i = 0; i < selectedGroup.children.length; i++) {
        var newOutline = new THREE.Mesh(selectedGroup.children[i].geometry, outLineMaterial);
        newOutline.name = "default";
        newOutline.position.x = selectedGroup.children[i].position.x;
        newOutline.position.y = selectedGroup.children[i].position.y;
        newOutline.position.z = selectedGroup.children[i].position.z;
        var addX = selectedGroup.children[i].scale.x * .1;
        var addY = selectedGroup.children[i].scale.y * .1;
        var addZ = selectedGroup.children[i].scale.z * .1;
        newOutline.scale.x = selectedGroup.children[i].scale.x + addX;
        newOutline.scale.y = selectedGroup.children[i].scale.y + addY;
        newOutline.scale.z = selectedGroup.children[i].scale.z + addZ;
        newOutline.rotation.x = selectedGroup.children[i].rotation.x;
        newOutline.rotation.y = selectedGroup.children[i].rotation.y;
        newOutline.rotation.z = selectedGroup.children[i].rotation.z;
        selectedGroupOutlineMeshes.push(newOutline);
        scene.add(newOutline);

    }
}
// deletes the highlighter from the scene
function cleanupGroupHighlighter() {
    for(var i = 0; i < selectedGroupOutlineMeshes.length; i++) {
        scene.remove(selectedGroupOutlineMeshes[i]);
    }
}

