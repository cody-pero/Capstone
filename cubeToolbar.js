function displayCubeToolbar() {
    var editorDiv = $("#editorDiv");
    editorDiv.empty();
    editorDiv.append(
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
        '<input  id = "x_input" class = "toolbar_input" type = "text" name = "x_coordinate" value = "x"><br />' +
        '<label class = "toolbar_label">Y position</label>' +
        '<input  id = "y_input" class = "toolbar_input" type = "text" name = "y_coordinate" value = "y"><br />' +
        '<label class = "toolbar_label">Z position</label>' +
        '<input  id = "z_input" class = "toolbar_input" type = "text" name = "z_coordinate" value = "z"><br />' +
        '<label class = "toolbar_label">X rotation</label>' +
        '<input  id = "x_rot_input" class = "toolbar_input" type = "text" name = "x_rotation" value = "x"><br />' +
        '<label class = "toolbar_label">Y rotation</label>' +
        '<input  id = "y_rot_input" class = "toolbar_input" type = "text" name = "y_rotation" value = "y"><br />' +
        '<label class = "toolbar_label">Z rotation</label>' +
        '<input  id = "z_rot_input" class = "toolbar_input" type = "text" name = "z_rotation" value = "z"><br />' +
        '<label class = "toolbar_label">Width :</label>' +
        '<input id = "geo_Width_Input" class = "toolbar_input" type = "text" name = "geo_Width" value = "w"><br />' +
        '<label class = "toolbar_label">Height:</label>' +
        '<input id = "geo_Height_Input" class = "toolbar_input" type = "text" name = "geo_Height" value = "h"><br />' +
        '<label class = "toolbar_label">Depth :</label>' +
        '<input id = "geo_Depth_Input" class = "toolbar_input" type = "text" name = "geo_Depth" value = "d"><br />' +
        '<label class = "toolbar_label">Width Segments :</label>' +
        '<input id = "geo_WidSeg_Input" class = "toolbar_input" type = "text" name = "wid_Seg" value = "ws"><br />' +
        '<label class = "toolbar_label">Height Segments :</label>' +
        '<input id = "geo_HeiSeg_Input" class = "toolbar_input" type = "text" name = "hei_Seg" value = "hs"><br />' +
        '<label class = "toolbar_label">Depth Segments :</label>' +
        '<input id = "geo_DepSeg_Input" class = "toolbar_input" type = "text" name = "Dep_Seg" value = "ds"><br />' +
        '<button id = "change_geometry_butt">Change Geometry Settings</button>'

    );
    // Setting the initial values in the input fields for position and rotation
    var element = document.getElementById("x_input");
    element.value = mesh.position.x;
    element = document.getElementById("y_input");
    element.value = mesh.position.y;
    element = document.getElementById("z_input");
    element.value = mesh.position.z;
    element = document.getElementById("x_rot_input");
    element.value = mesh.rotation.x;
    element = document.getElementById("y_rot_input");
    element.value = mesh.rotation.y;
    element = document.getElementById("z_rot_input");
    element.value = mesh.rotation.z;

    element = document.getElementById("geo_Height_Input");
    element.value = mesh.scale.y * mesh.geometry.parameters.height;
    element = document.getElementById("geo_Width_Input");
    element.value = mesh.scale.x * mesh.geometry.parameters.width;
    element = document.getElementById("geo_Depth_Input");
    element.value = mesh.scale.z * mesh.geometry.parameters.depth;
    element = document.getElementById("geo_HeiSeg_Input");
    element.value = mesh.geometry.parameters.heightSegments;
    element = document.getElementById("geo_WidSeg_Input");
    element.value = mesh.geometry.parameters.widthSegments;
    element = document.getElementById("geo_DepSeg_Input");
    element.value = mesh.geometry.parameters.depthSegments;

    //**********************************place button code in here*********************************************//
    // Left Rotation button code
    document.getElementById('left_rot_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.rotation.y -= .1;
        document.getElementById("y_rot_input").value = mesh.rotation.y;

    };
    // Right Rotation button code
    document.getElementById('right_rot_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.rotation.y += .1;
        document.getElementById("y_rot_input").value = mesh.rotation.y;

    };
    // Up Rotation button code
    document.getElementById('up_rot_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.rotation.x -= .1;
        document.getElementById("x_rot_input").value = mesh.rotation.x;

    };
    // Down Rotation button code
    document.getElementById('down_rot_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.rotation.x += .1;
        document.getElementById("x_rot_input").value = mesh.rotation.x;

    };
    //Move forward button code
    document.getElementById('move_forward_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.z += 5;
        document.getElementById("z_input").value = mesh.position.z;

    };
//Move backward button code
    document.getElementById('move_back_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.z -= 5;
        document.getElementById("z_input").value = mesh.position.z;

    };
//Move down button code
    document.getElementById('move_down_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.y -= 5;
        document.getElementById("y_input").value = mesh.position.y;

    };
//Move up button code
    document.getElementById('move_up_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.y += 5;
        document.getElementById("y_input").value = mesh.position.y;

    };
//Move left button code
    document.getElementById('move_left_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.x -= 5;
        document.getElementById("x_input").value = mesh.position.x;

    };
//Move right button code
    document.getElementById('move_right_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.position.x += 5;
        document.getElementById("x_input").value = mesh.position.x;

    };
//Scale up button code
    document.getElementById('scale_up_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.scale.set(mesh.scale.x + .1, mesh.scale.y + .1, mesh.scale.z + .1);
        document.getElementById("geo_Width_Input").value = (mesh.scale.x * mesh.geometry.parameters.width);
        document.getElementById("geo_Height_Input").value = (mesh.scale.y * mesh.geometry.parameters.height);
        document.getElementById("geo_Depth_Input").value = (mesh.scale.z * mesh.geometry.parameters.height);

    };
//Scale down button code
    document.getElementById('scale_down_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        mesh.scale.set(mesh.scale.x - .1, mesh.scale.y - .1, mesh.scale.z - .1);
        document.getElementById("geo_Width_Input").value = (mesh.scale.x * mesh.geometry.parameters.width);
        document.getElementById("geo_Height_Input").value = (mesh.scale.y * mesh.geometry.parameters.height);
        document.getElementById("geo_Depth_Input").value = (mesh.scale.z * mesh.geometry.parameters.height);

    };
// Delete button code
    document.getElementById('delete_butt').onclick = function () {
        var selectedMesh = meshes[document.getElementById('meshSelector').value];
        scene.remove(selectedMesh);
        delete meshes[selectedMesh.name2];
        rebuildDropDown();
        editorDiv.empty();

    };
    document.getElementById('change_geometry_butt').onclick = function () {
        mesh = meshes[document.getElementById('meshSelector').value];
        var newGeo = new THREE.BoxGeometry( document.getElementById("geo_Width_Input").value,
                                            document.getElementById("geo_Height_Input").value,
                                            document.getElementById("geo_Depth_Input").value,
                                            document.getElementById("geo_WidSeg_Input").value,
                                            document.getElementById("geo_HeiSeg_Input").value,
                                            document.getElementById("geo_DepSeg_Input").value);
        var newMesh = new THREE.Mesh( newGeo, mesh.material );
        newMesh.position.x = mesh.position.x;
        newMesh.position.y = mesh.position.y;
        newMesh.position.z = mesh.position.z;
        newMesh.rotation.x = mesh.rotation.x;
        newMesh.rotation.y = mesh.rotation.y;
        newMesh.rotation.z = mesh.rotation.z;

        newMesh.name2 = mesh.name2;
        scene.remove(mesh);
        delete meshes[mesh.name2];
        scene.add(newMesh);
        meshes[newMesh.name2] = newMesh;


    };
}