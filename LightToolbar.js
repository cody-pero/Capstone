/**
 * Created by Charlie on 3/5/2016.
 */
/**
 * Functions for adjusting values of the geometric meshes, Cube, cylinder, plane, sphere
 */
// The List of values being tracked.
var lightParam;
// User interface for interacting with tracked javascript variables
var lightGui;

var lightHelper;
// Builds the dat.gui dom element for the selected mesh
function displayLightToolbar() {
    var sphereSize = 1;

    // GUI object displaying the tracked variables
    lightGui = new dat.GUI();
    // The width of the GUI
    lightGui.width = container.clientWidth * .23;
    // List of different values dat.gui will keep track of
    // Displays the objects name at the top of the dat.gui window
    var obj = {Name: mesh.name};
    lightGui.add(obj, 'Name');
    generateLightParamList();
    obj = {
        Delete_Mesh: function () {
            scene.remove(mesh);
            editor.empty();
            faceEditor.empty();
            rebuildDropDown();
        }
    };
    lightGui.add(obj, 'Delete_Mesh');
    // Opens the gui clears the editor div and appends the gui to the div
    lightGui.open();
    editor.append(lightGui.domElement);
}
function generateLightParamList() {
    lightParam = {
        light_color : mesh.color,
    };

    if(mesh instanceof THREE.AmbientLight) {
        buildBaseToolbar();
    }
    else if(mesh instanceof THREE.SpotLight) {
        lightParam.X_Position = mesh.position.x;
        lightParam.Y_Position = mesh.position.y;
        lightParam.Z_Position = mesh.position.z;
        lightParam.intensityValue = mesh.intensity;
        lightParam.distanceValue = mesh.distance;
        lightParam.angleValue = mesh.angle;
        lightParam.exponentValue = mesh.exponent;
        lightParam.decayValue = mesh.decay;
        lightParam.shadowEnabled = mesh.castShadow;
        lightParam.shadowMapWidth = mesh.shadowMapWidth;
        lightParam.shadowMapHeight = mesh.shadowMapHeight;
        lightHelper = new THREE.SpotLightHelper( mesh );
        lightHelper.name = "default";
        scene.add( lightHelper );
        buildBaseToolbar();
        folderPos();
        folderLightAttributes();
        folderShadowAttributes();

    } else if(mesh instanceof THREE.PointLight) {
        lightParam.X_Position = mesh.position.x;
        lightParam.Y_Position = mesh.position.y;
        lightParam.Z_Position = mesh.position.z;
        lightParam.intensityValue = mesh.intensity;
        lightParam.distanceValue = mesh.distance;
        lightParam.decayValue = mesh.decay;
        lightHelper = new THREE.PointLightHelper(mesh, 10);
        lightHelper.name = "default";
        scene.add(lightHelper);
        buildBaseToolbar();
        folderPos();
        folderLightAttributes();
     }
}
function buildBaseToolbar() {
    var meshColor = lightGui.addColor(lightParam, 'light_color')
        .name('Light color').listen();
    meshColor.onChange(function (value) {
        mesh.color.setRGB(value.r, value.g, value.b);
        updateMaterials();
    });
}

function folderShadowAttributes() {
    var folder1 = lightGui.addFolder("Shadow Attributes");
    var shadowEnabled = folder1.add(lightParam, 'shadowEnabled').name('Enable Shadows').listen();
    shadowEnabled.onChange(function(value) {
        mesh.castShadow = value;
        updateMaterials
    });
    var shadowWidth = folder1.add(lightParam, 'shadowMapWidth').name('Shadow Map Width')
        .min(0.0).max(1024).listen();
    shadowWidth.onChange(function(value) {
        mesh.shadowMapWidth = value;
        updateMaterials
    });
    var shadowHeight = folder1.add(lightParam, 'shadowMapHeight').name('Shadow Map Height')
        .min(0.0).max(1024).listen();
    shadowHeight.onChange(function(value) {
        mesh.shadowMapHeight = value;
        updateMaterials
    });

}
function folderLightAttributes() {
    var folder1 = lightGui.addFolder("Light Attributes");
    var lightIntensity = folder1.add(lightParam, 'intensityValue')
        .min(0.0).max(1.0).step(.1).listen();
    lightIntensity.onChange(function(value) {
        mesh.intensity = value;
        updateMaterials
    });
    var lightDistance = folder1.add(lightParam, 'distanceValue')
        .min(0.0).max(1000).step(1).listen();
    lightDistance.onChange(function(value) {
        mesh.distance = value;
        updateMaterials
    });
    var lightDecay = folder1.add(lightParam, 'decayValue')
        .min(0.0).max(1.0).step(.1).listen();
    lightDecay.onChange(function(value) {
        mesh.decay = value;
        updateMaterials
    });
}

function folderPos() {
    var folder1 = lightGui.addFolder('Position');
    var meshX_Pos = folder1.add(lightParam, 'X_Position')
        .min(-200).max(200).step(1).listen();
    meshX_Pos.onChange(function (value) {
        mesh.position.x = value;
    });
    var meshY_Pos = folder1.add(lightParam, 'Y_Position')
        .min(-200).max(200).step(1).listen();
    meshY_Pos.onChange(function (value) {
        mesh.position.y = value;
    });
    var meshZ_Pos = folder1.add(lightParam, 'Z_Position')
        .min(-200).max(200).step(1).listen();
    meshZ_Pos.onChange(function (value) {
        mesh.position.z = value;
    });

}
function updateMaterials() {
    var count = 0;
    for (var i = 0; i < scene.children.length; i++) {
        var node = scene.children[i];

        if (node.material) {

            node.material.needsUpdate = true;

            if (node.material instanceof THREE.MeshFaceMaterial) {

                for (var i = 0; i < node.material.materials.length; i++) {

                    node.material.materials[i].needsUpdate = true;


                }

            }

        }
    };
}
