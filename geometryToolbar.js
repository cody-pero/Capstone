/**
 * Functions for adjusting values of the geometric meshes, Cube, cylinder, plane, sphere
 */
// The List of values being tracked.
var parameters;
// User interface for interacting with tracked javascript variables
var gui;

// Builds the dat.gui dom element for the selected mesh
function displayGeometryToolbar() {
    // GUI object displaying the tracked variables
    gui = new dat.GUI({"width": document.getElementById('editorDiv').clientWidth});
    // The width of the GUI
    gui.domElement.id = 'gui';
    // List of different values dat.gui will keep track of
    generateParameterList();
    // Displays the objects name at the top of the dat.gui window
    var obj = {Name: mesh.name};
    gui.add(obj, 'Name');
    // Creates a folder editing position values
    setupPositionFolder();
    // Creates a folder editing rotation values
    setupRotationFolder();
    // Creates a folder editing scaling values
    setupScalingFolder();
    // Creates a folder editing material values
    setupMaterialsFolder();
    // Creates a folder editing geometry values
    setupGeometryFolder();

    obj = {
        Delete_Mesh: function () {
            scene.remove(mesh);
            cleanupHighlighter();
            editor.empty();
            faceEditor.empty();
            rebuildDropDown();
        }
    };
    gui.add(obj, 'Delete_Mesh');
    // Opens the gui clears the editor div and appends the gui to the div
    gui.open();
    editor.append(gui.domElement);
}
// A list of values that we are tracking for this mesh object
function generateParameterList() {
    parameters =
    {
        X_Position: mesh.position.x,
        Y_Position: mesh.position.y,
        Z_Position: mesh.position.z,
        X_Rotation: mesh.rotation.x,
        Y_Rotation: mesh.rotation.y,
        Z_Rotation: mesh.rotation.z,
        X_Scale: mesh.scale.x,
        Y_Scale: mesh.scale.y,
        Z_Scale: mesh.scale.z,
        cast_Shad: mesh.castShadow,
        rec_Shad: mesh.receiveShadow,
        Full_Scale: 1,
        Color_Diffuse: mesh.material.color.getHex(),
        Color_Emissive: '#000000',
        Color_Specular: '#000000',
        Shininess: 30,
        Opacity: mesh.material.opacity,
        material: "Wireframe"
    };
    // Only certain materials have these values so check if they exist first
    if (mesh.material.emissive) {
        parameters.Color_Emissive = mesh.material.emissive.getHex();
    }
    if (mesh.material.specular) {
        parameters.Color_Specular = mesh.material.specular.getHex();
    }
    if (mesh.material.shininess) {
        parameters.Shininess = mesh.material.shininess;
    }
    // The following variables are mesh specific so based off what type of mesh
    // is being worked with collects the
    // proper variables to be tracked
    if (mesh.geometry instanceof THREE.BoxGeometry) {
        parameters['Width'] = mesh.geometry.parameters.width;
        parameters['Height'] = mesh.geometry.parameters.height;
        parameters['Depth'] = mesh.geometry.parameters.depth;
        parameters['Depth_Segments'] = mesh.geometry.parameters.depthSegments;
        parameters['Height_Segments'] = mesh.geometry.parameters.heightSegments;
        parameters['Width_Segments'] = mesh.geometry.parameters.widthSegments;
    } else if (mesh.geometry instanceof THREE.SphereGeometry) {
        parameters['Radius'] = mesh.geometry.parameters.radius;
        parameters['Height_Segments'] = mesh.geometry.parameters.heightSegments;
        parameters['Width_Segments'] = mesh.geometry.parameters.widthSegments;
        parameters['Phi_Start'] = mesh.geometry.parameters.phiStart;
        parameters['Phi_Length'] = mesh.geometry.parameters.phiLength;
        parameters['Theta_Start'] = mesh.geometry.parameters.thetaStart;
        parameters['Theta_Length'] = mesh.geometry.parameters.thetaLength;
    } else if (mesh.geometry instanceof THREE.CylinderGeometry) {
        parameters['Radius_Top'] = mesh.geometry.parameters.radiusTop;
        parameters['Radius_Bot'] = mesh.geometry.parameters.radiusBottom;
        parameters['Height'] = mesh.geometry.parameters.height;
        parameters['Radial_Segments'] = mesh.geometry.parameters.radialSegments;
        parameters['Height_Segments'] = mesh.geometry.parameters.heightSegments;
        parameters['Open_Ended'] = mesh.geometry.parameters.openEnded;
        parameters['Theta_Start'] = mesh.geometry.parameters.thetaStart;
        parameters['Theta_Length'] = mesh.geometry.parameters.thetaLength;
    } else if (mesh.geometry instanceof THREE.PlaneGeometry) {
        parameters['Width'] = mesh.geometry.parameters.width;
        parameters['Height'] = mesh.geometry.parameters.height;
        parameters['Height_Segments'] = mesh.geometry.parameters.heightSegments;
        parameters['Width_Segments'] = mesh.geometry.parameters.widthSegments;
    } else {
        alert("Some weird geometry is being checked. DANGER");
    }

    // Determines which type of material is on the mesh
    if (mesh.material instanceof THREE.MeshBasicMaterial && mesh.material.wireframe == true) {
        parameters.material = "Wireframe";
    } else if (mesh.material instanceof THREE.MeshLambertMaterial) {
        parameters.material = "Lambert";
    } else if (mesh.material instanceof THREE.MeshPhongMaterial) {
        parameters.material = "Phong";
    } else if (mesh.material instanceof THREE.MeshBasicMaterial) {
        parameters.material = "Basic";
    } else {
        alert("Some weird material is being checked DANGER!");
    }
}

// Handles adding the tracked variables for position to the GUI and manipulation events
// of those tracked variables
function setupPositionFolder() {
    var folder1 = gui.addFolder('Position');
    var meshX_Pos = folder1.add(parameters, 'X_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    meshX_Pos.onChange(function (value) {
        mesh.position.x = value;
        moveHighlighter();
    });
    var meshY_Pos = folder1.add(parameters, 'Y_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    meshY_Pos.onChange(function (value) {
        mesh.position.y = value;
        moveHighlighter();
    });
    var meshZ_Pos = folder1.add(parameters, 'Z_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    meshZ_Pos.onChange(function (value) {
        mesh.position.z = value;
        moveHighlighter();
    });

}

// Handles adding the tracked variables for rotation to the GUI and manipulation
// events of those tracked variables
function setupRotationFolder() {
    var folder2 = gui.addFolder('Rotation');
    var meshX_Rot = folder2.add(parameters, 'X_Rotation')
        .min(-6.2).max(6.2).step(.1).listen();
    meshX_Rot.onChange(function (value) {
        mesh.rotation.x = value;
        moveHighlighter();
    });
    var meshY_Rot = folder2.add(parameters, 'Y_Rotation')
        .min(-6.2).max(6.2).step(.1).listen();
    meshY_Rot.onChange(function (value) {
        mesh.rotation.y = value;
        moveHighlighter();
    });
    var meshZ_Rot = folder2.add(parameters, 'Z_Rotation')
        .min(-6.2).max(6.2).step(.1).listen();
    meshZ_Rot.onChange(function (value) {
        mesh.rotation.z = value;
        moveHighlighter();
    });

}

// Handles adding the tracked variables for scaling to the GUI and manipulation
// events of those tracked variables
function setupScalingFolder() {
    var folder3 = gui.addFolder('Scaling');
    var meshX_Sca = folder3.add(parameters, 'X_Scale').min(1).max(parseInt(sceneSize)).step(1).listen();
    meshX_Sca.onChange(function (value) {
        mesh.scale.x = value;
        rescaleHighlighter();
    });
    var meshY_Sca = folder3.add(parameters, 'Y_Scale').min(1).max(parseInt(sceneSize)).step(1).listen();
    meshY_Sca.onChange(function (value) {
        mesh.scale.y = value;
        rescaleHighlighter();
    });
    var meshZ_Sca = folder3.add(parameters, 'Z_Scale').min(1).max(parseInt(sceneSize)).step(1).listen();
    meshZ_Sca.onChange(function (value) {
        mesh.scale.z = value;
        rescaleHighlighter();
    });
    var mesh_Sca = folder3.add(parameters, 'Full_Scale').min(1).max(parseInt(sceneSize)).step(1).listen();
    mesh_Sca.onChange(function (value) {
        mesh.scale.set(value, value, value);
        rescaleHighlighter();
    });
}

// Handles adding the tracked variables for geometry to the GUI and manipulation
// events of those tracked variables
function setupGeometryFolder() {
    var folder4 = gui.addFolder('Geometry');
    if (mesh.geometry instanceof THREE.BoxGeometry) {
        var meshWidth = folder4.add(parameters, 'Width').min(1).max(parseInt(sceneSize)).step(1).listen();
        var meshHeight = folder4.add(parameters, 'Height').min(1).max(parseInt(sceneSize)).step(1).listen();
        var meshDepth = folder4.add(parameters, 'Depth').min(1).max(parseInt(sceneSize)).step(1).listen();
        var meshWid_Seg = folder4.add(parameters, 'Width_Segments').min(1).max(32).step(1).listen();
        var meshHei_Seg = folder4.add(parameters, 'Height_Segments').min(1).max(32).step(1).listen();
        var meshDep_Seg = folder4.add(parameters, 'Depth_Segments').min(1).max(32).step(1).listen();
    } else if (mesh.geometry instanceof THREE.SphereGeometry) {
        var meshRadius = folder4.add(parameters, 'Radius').min(1).max(parseInt(sceneSize)).step(1).listen();
        meshHeiSeg = folder4.add(parameters, 'Height_Segments').min(1).max(100).step(1).listen();
        var meshWidSeg = folder4.add(parameters, 'Width_Segments').min(1).max(100).step(1).listen();
        var meshPhiStart = folder4.add(parameters, 'Phi_Start').min(0).max(32).step(1).listen();
        var meshPhiLength = folder4.add(parameters, 'Phi_Length').min(0).max(32).step(1).listen();
        meshThetaStart = folder4.add(parameters, 'Theta_Start').min(0).max(32).step(1).listen();
        meshThetaLength = folder4.add(parameters, 'Theta_Length').min(1).max(32).step(1).listen();
    } else if (mesh.geometry instanceof THREE.CylinderGeometry) {
        var meshRadiusT = folder4.add(parameters, 'Radius_Top').min(1).max(parseInt(sceneSize)).step(1).listen();
        var meshRadiusB = folder4.add(parameters, 'Radius_Bot').min(1).max(parseInt(sceneSize)).step(1).listen();
        meshHeight = folder4.add(parameters, 'Height').min(1).max(parseInt(sceneSize)).step(1).listen();
        var meshRadSeg = folder4.add(parameters, 'Radial_Segments').min(1).max(100).step(1).listen();
        var meshHeiSeg = folder4.add(parameters, 'Height_Segments').min(1).max(100).step(1).listen();
        var meshOpenEnded = folder4.add(parameters, 'Open_Ended').listen();
        var meshThetaStart = folder4.add(parameters, 'Theta_Start').min(1).max(100).step(1).listen();
        var meshThetaLength = folder4.add(parameters, 'Theta_Length').min(1).max(100).step(1).listen();
    } else if (mesh.geometry instanceof THREE.PlaneGeometry) {
        meshWidth = folder4.add(parameters, 'Width').min(1).max(parseInt(sceneSize)).step(1).listen();
        meshHeight = folder4.add(parameters, 'Height').min(1).max(parseInt(sceneSize)).step(1).listen();
        meshWid_Seg = folder4.add(parameters, 'Width_Segments').min(1).max(32).step(1).listen();
        meshHei_Seg = folder4.add(parameters, 'Height_Segments').min(1).max(32).step(1).listen();
    } else {
        alert("Some weird geometry is being checked. DANGER WILL ROBINSON");
    }

    var obj = {
        Confirm_Settings: function () {
            updateMesh();
        }
    };
    folder4.add(obj, 'Confirm_Settings');
}
// Handles adding the tracked variables for material to the GUI and manipulation
// events of those tracked variables
function setupMaterialsFolder() {
    var folder5 = gui.addFolder('Materials');

    var meshRecvShad = folder5.add(parameters, 'rec_Shad').name('Recieve Shadow').listen();
    meshRecvShad.onChange(function (value) {
        mesh.receiveShadow = value;
    });

    var meshCastShad = folder5.add(parameters, 'cast_Shad').name('Cast Shadow').listen();
    meshCastShad.onChange(function (value) {
        mesh.castShadow = value;
    });

    var meshColor = folder5.addColor(parameters, 'Color_Diffuse').name('Color (Diffuse)').listen();
    meshColor.onChange(function (value) {
        mesh.material.color.setHex(value);
    });
    var meshEmiColor = folder5.addColor(parameters, 'Color_Emissive')
        .name('Color (Emissive)').listen();
    meshEmiColor.onChange(function (value) {
        mesh.material.emissive.setHex(value);
    });
    var meshSpeColor = folder5.addColor(parameters, 'Color_Specular')
        .name('Color (Specular)').listen();
    meshSpeColor.onChange(function (value) {
        mesh.material.specular.setHex(value);
    });
    var meshShininess = folder5.add(parameters, 'Shininess').name('Shininess')
        .min(1).max(100).step(1).listen();
    meshShininess.onChange(function (value) {
        mesh.material.shininess = value;
    });
    var meshOpacity = folder5.add(parameters, 'Opacity').name('Opacity')
        .min(.01).max(1).step(.01).listen();
    meshOpacity.onChange(function (value) {
        mesh.material.opacity = value;
    });

    var meshMaterial = folder5.add(parameters,
        'material', ["Basic", "Lambert", "Phong", "Wireframe"]).name('Material Type').listen();
    meshMaterial.onChange(function () {
        updateMesh()
    });
}

// Handles when a mesh must be recreated not just manipulated
function updateMesh() {
    // Sets up the new geometry based on the parameters values
    if (mesh.geometry instanceof THREE.BoxGeometry) {
        var newGeo = new THREE.BoxGeometry(parameters.Width, parameters.Height, parameters.Depth,
            parameters.Width_Segments, parameters.Height_Segments,
            parameters.Depth_Segments);
    } else if (mesh.geometry instanceof THREE.SphereGeometry) {
        newGeo = new THREE.SphereGeometry(parameters.Radius, parameters.Width_Segments,
            parameters.Height_Segments, parameters.Phi_Start, parameters.Phi_Length,
            parameters.Theta_Start, parameters.Theta_Length);
    } else if (mesh.geometry instanceof THREE.CylinderGeometry) {
        newGeo = new THREE.CylinderGeometry(parameters.Radius_Top, parameters.Radius_Bot,
            parameters.Height, parameters.Radial_Segments, parameters.Height_Segments,
            parameters.Open_Ended, parameters.Theta_Start, parameters.Theta_Length);
    } else if (mesh.geometry instanceof THREE.PlaneGeometry) {
        newGeo = new THREE.PlaneGeometry(parameters.Width, parameters.Height,
            parameters.Width_Segments, parameters.Height_Segments);
    } else {
        alert("Some weird geometry is being checked. DANGER");
    }
    // Sets up the new material based on the parameters values
    var meshType = parameters.material;
    var newMaterial;
    if (meshType == "Lambert") {
        newMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
        newMaterial.emissive.setHex(parameters.Color_Emissive);
    } else if (meshType == "Wireframe") {
        newMaterial = new THREE.MeshBasicMaterial({wireframe: true});
    } else if (meshType == "Basic") {
        newMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    } else if (meshType == "Phong") {
        newMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
        newMaterial.emissive.setHex(parameters.Color_Emissive);
        newMaterial.specular.setHex(parameters.Color_Specular);
        newMaterial.shininess = parameters.Shininess;
    } else {
        alert("Some weird material is being checked, DANGER!");
    }

    newMaterial.color.setHex(parameters.Color_Diffuse);
    newMaterial.opacity = parameters.Opacity;
    newMaterial.transparent = true;

    // Creates the new mesh and transforms it to the old meshes position
    var newMesh = new THREE.Mesh(newGeo, newMaterial);
    newMesh.scale.x = mesh.scale.x;
    newMesh.scale.y = mesh.scale.y;
    newMesh.scale.z = mesh.scale.z;
    newMesh.position.x = mesh.position.x;
    newMesh.position.y = mesh.position.y;
    newMesh.position.z = mesh.position.z;
    newMesh.rotation.x = mesh.rotation.x;
    newMesh.rotation.y = mesh.rotation.y;
    newMesh.rotation.z = mesh.rotation.z;
    newMesh.name = mesh.name;
    newMesh.castShadow = mesh.castShadow;
    newMesh.recieveShadow = mesh.recieveShadow;
    //removes old mesh
    scene.remove(mesh);
    // adds new mesh
    scene.add(newMesh);
    // sets the selected mesh to the new mesh
    mesh = newMesh;
    // reassociates the highlighter with the new mesh
    cleanupHighlighter();
    createHighlighter();
}