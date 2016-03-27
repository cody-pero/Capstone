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
    lightGui = new dat.GUI({"width": document.getElementById('editorDiv').clientWidth});
    // The width of the GUI
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
        light_color : mesh.color.getHex()
    };

    if(mesh instanceof THREE.AmbientLight) {
        buildBaseToolbar();
    }
    else if(mesh instanceof THREE.DirectionalLight) {
        lightParam.X_Position = mesh.position.x;
        lightParam.Y_Position = mesh.position.y;
        lightParam.Z_Position = mesh.position.z;
        lightParam.intensityValue = mesh.intensity;
        lightParam.angleValue = mesh.angle;
        lightParam.exponentValue = mesh.exponent;
     //   lightParam.decayValue = mesh.decay;
        lightParam.shadowEnabled = mesh.castShadow;
        lightParam.shadowBiasValue = mesh.shadowBias;
        lightParam.shadowMapWidth = mesh.shadowMapWidth;
        lightParam.shadowMapHeight = mesh.shadowMapHeight;
        lightParam.shadowCameraFar = mesh.shadowCameraFar;
        lightParam.shadowCameraNear = mesh.shadowCameraNear;
       // lightParam.shadowCameraFov = mesh.shadowCameraFov;
        lightParam.shadowDarkness = mesh.shadowDarkness;
        lightParam.shadowCameraVisible = mesh.shadowCameraVisible;
        lightHelper = new THREE.DirectionalLightHelper( mesh );
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
        lightHelper = new THREE.PointLightHelper(mesh, 1);
        lightHelper.name = "default";
        scene.add(lightHelper);
        buildBaseToolbar();
        folderPos();
        folderLightAttributes();
     }
}
function updateShadows() {
    mesh.shadowCamera.updateProjectionMatrix();
    console.log(mesh);
    console.log(mesh.shadowCamera);
}
function buildBaseToolbar() {
    var meshColor = lightGui.addColor(lightParam, 'light_color')
        .name('Light color').listen();
    meshColor.onChange(function (value) {
        mesh.color.setHex( value );
        updateMaterials();
    });
}

function folderShadowAttributes() {
    var folder1 = lightGui.addFolder("Shadow Attributes");
    var shadowEnabled = folder1.add(lightParam, 'shadowEnabled').name('Enable Shadows').listen();
    shadowEnabled.onChange(function(value) {
        mesh.castShadow = value;
        mesh.shadowCamera.castShadow = value;
        updateShadows();
        updateMaterials();
    });
    var shadowBias = folder1.add(lightParam, 'shadowBiasValue').name('Shadow Bias ')
        .min(-1.0).max(1.0).step(.01);
    shadowBias.onChange(function(value) {
        mesh.shadowBias = value;
        updateShadows();
        updateMaterials();
    });
    var shadowCamNear = folder1.add(lightParam, 'shadowCameraNear').name('Shadow Camera Near')
        .min(1).max(1000).step(50);
    shadowCamNear.onChange(function(value) {
        mesh.shadowCameraNear = value;
        updateShadows();
        updateMaterials();
    });
    var shadowCamFar = folder1.add(lightParam, 'shadowCameraFar').name('Shadow Camera Far')
        .min(1).max(5000).step(100);
    shadowCamFar.onChange(function(value) {
        mesh.shadowCameraFar = value;
        updateShadows();
        updateMaterials();
    });
    /*
    var shadowCamFov = folder1.add(lightParam, 'shadowCameraFov')
        .min(0).max(90).step(15);
    shadowCamFov.onChange(function(value) {
        mesh.shadowCameraFov = value;
        updateMaterials();
    });
    */
    var shadowCamVis = folder1.add(lightParam, 'shadowCameraVisible').name('Shadow Camera');
    shadowCamVis.onChange(function(value) {
        mesh.shadowCameraVisible = value;
        mesh.shadowCamera.name="default";
    });
    var shadowDarkness = folder1.add(lightParam, 'shadowDarkness').name('Shadow darkness')
        .min(0).max(1.0).step(.1);
    shadowDarkness.onChange(function(value) {
        mesh.shadowDarkness = value;
        updateMaterials();
    });

    var shadowWidth = folder1.add(lightParam, 'shadowMapWidth').name('Shadow Map Width')
        .min(0.0).max(1024).listen();
    shadowWidth.onChange(function(value) {
        mesh.shadowMapWidth = value;
        updateMaterials();
    });
    var shadowHeight = folder1.add(lightParam, 'shadowMapHeight').name('Shadow Map Height')
        .min(0.0).max(1024).listen();
    shadowHeight.onChange(function(value) {
        mesh.shadowMapHeight = value;
        updateMaterials();
    });

}
function folderLightAttributes() {
    var folder1 = lightGui.addFolder("Light Attributes");
    var lightIntensity = folder1.add(lightParam, 'intensityValue')
        .min(0.0).max(1.0).step(.1).listen();
    lightIntensity.onChange(function(value) {
        mesh.intensity = value;
        updateMaterials();
    });
    /*
    var lightDistance = folder1.add(lightParam, 'distanceValue')
        .min(0.0).max(1000).step(1).listen();
    lightDistance.onChange(function(value) {
        mesh.distance = value;
        updateMaterials();
    });

    var lightDecay = folder1.add(lightParam, 'decayValue')
        .min(0.0).max(1.0).step(.1).listen();
    lightDecay.onChange(function(value) {
        mesh.decay = value;
        updateMaterials();
    });
     */
}

function folderPos() {
    var folder1 = lightGui.addFolder('Position');
    var meshX_Pos = folder1.add(lightParam, 'X_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    meshX_Pos.onChange(function (value) {
        mesh.position.x = value;
    });
    var meshY_Pos = folder1.add(lightParam, 'Y_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    meshY_Pos.onChange(function (value) {
        mesh.position.y = value;
    });
    var meshZ_Pos = folder1.add(lightParam, 'Z_Position')
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
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
