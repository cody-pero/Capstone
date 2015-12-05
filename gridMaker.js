/**
 * Functions for adding a grid to the scene
 */
// holds the line objects for the grid for hiding/showing
var grid = [];

// adds the grid to the scene
function addGrid() {
    var gridOpacity = .4;
    var distance = new THREE.Vector3(camera.far, 0, 0);
    var distance2 = new THREE.Vector3(-camera.far, 0, 0);
    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: gridOpacity
    });
    addLine(distance, distance2, material);

    distance = new THREE.Vector3(0, camera.far, 0);
    distance2 = new THREE.Vector3(0, -camera.far, 0);
    material = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: gridOpacity
    });
    addLine(distance, distance2, material);

    distance = new THREE.Vector3(0, 0, camera.far);
    distance2 = new THREE.Vector3(0, 0, -camera.far);
    material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: gridOpacity
    });
    addLine(distance, distance2, material);
}

// adds individual lines to the scene
// @param distance vector for first line point
// @param distance2 vector for the second line point
// @param material the material for the line
function addLine(distance, distance2, material) {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(distance);
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(distance2);
    var line = new THREE.Line(geometry, material);
    line.name = "default";
    grid.push(line);
    scene.add(line);
}
// hides the grid
function hideGrid() {
    for (var line in grid) {
        grid[line].visible = false;
    }
}

// shows the grid
function showGrid() {
    for (var line in grid) {
        grid[line].visible = true;
    }
}