/**
 * Creates the starting scene and listens for user input and changes to manipulate the scene
 **/
// Makes sure to call the init / render functions before ANY other functions on the page. Safety
$(function () {
    init();
    render();
});

//*********************************************Fields**********************************************
// Three.js common variables -
// Container the dom tree element that holds the renderer, scene - holds relevent three.js data,
// camera- viewer, renderer - object used to render three.js code to the screen, controls- camera
// controls used for moving, mesh - stores the mesh we are currently working with
var container, scene, camera, renderer, controls, mesh;

// editor - div element containing the mesh editor functionality
// faceEditor - div element containing the face editor functionality
// selectedFace - currently selected face
var editor, faceEditor, mode, selectedFace, partParameters;

// used for getting keyboard commands
var keyboard = new KeyboardState();
// next available id ******************* check out a way to carry over the id value to avoid
// duplicates when saving/loading
var id = 0;

var listOfSystems = [];

var clock = new THREE.Clock();
//*************************************************************************************************
//***************************************Required Three.js functions*******************************
// Initializes all the starting three.js stuff
function init() {
    // New blank Scene
    scene = new THREE.Scene();
    // Sets the mode to "picking" which allows mesh selection
    mode = "picking";
    // connects the editor div to the variable
    editor = $("#editorDiv");
    // connects the face editor div to the variable
    faceEditor = $("#editor2Div");
    // Camera / container / renderer settings
    container = document.getElementById("WebGLCanvas");
    var SCREEN_WIDTH = container.clientWidth, SCREEN_HEIGHT = container.clientHeight;
    var VIEW_ANGLE = 2, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;
    if (Detector.webgl) {
        renderer = new THREE.WebGLRenderer({antialias: true});
    }
    else {
        renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.name = "Camera";
    scene.add(camera);
    camera.position.set(400, 400, 400);

    // Sets up Camera Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Add Default Lights
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-20, 20, 20);
    light.name = "Default Point Light";
    light.userData = {TYPE: "light"};
    var light2 = new THREE.AmbientLight(0x333333);
    light2.position.set(light.position);
    light2.name = "Default Ambient Light";
    light2.userData = {TYPE: "light"};
    scene.add(light2);
    scene.add(light);

    // Adds the event listener for the mesh picking event
    container.addEventListener('mouseup', onMouseClick, false);
    /*
     // FLOOR
     scene.add(createFloor());
     var skyBoxGeometry = new THREE.BoxGeometry(4000, 4000, 4000);
     var skyBoxMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BackSide});
     var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
     skyBox.name = "Skybox";
     scene.add(skyBox);
     ////////////
     // CUSTOM //
     ////////////
     */

    // Adds the grid to the scene
    addGrid();
    // Creates the list in the drop down of scene elements
    rebuildDropDown();
    addEventListeners();
    THREEx.WindowResize(renderer, camera);
}


function createFloor() {
    var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    var floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        map: floorTexture,
        side: THREE.DoubleSide
    });
    var floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -10.5;
    floor.name = "Floor";
    floor.userData = "floor";
    floor.rotation.x = Math.PI / 2;
    return floor;
}

// Renderer function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    update();
}
// Update function used to update camera controls and trigger on keyboard input events
function update() {
    for (var index = 0; index < listOfSystems.length; index++) {
        listOfSystems[index].updateParticles();
    }
    // Updates any key flags in the keyboard object
    keyboard.update();
    // Checks for various keyboard input
    if (keyboard.up("c")) {
        document.getElementById('shapeSelector').value = "Cube";
        generateMesh();
        cleanupHighlighter();
        createHighlighter();
        editor.empty();
        displayGeometryToolbar();
    } else if (keyboard.up("s")) {
        document.getElementById('shapeSelector').value = "Sphere";
        generateMesh();
        cleanupHighlighter();
        createHighlighter();
        editor.empty();
        displayGeometryToolbar();
    } else if (keyboard.up("y")) {
        document.getElementById('shapeSelector').value = "Cylinder";
        generateMesh();
        cleanupHighlighter();
        createHighlighter();
        editor.empty();
        displayGeometryToolbar();
    } else if (keyboard.up("l")) {
        document.getElementById('shapeSelector').value = "Plane";
        generateMesh();
        cleanupHighlighter();
        createHighlighter();
        editor.empty();
        displayGeometryToolbar();
    }
    if (keyboard.up("e")) {
        mode = "explode";
        alert("exploded");
    } else if (keyboard.up("up")) {
        mesh.position.y += 1;
        moveHighlighter();
    } else if (keyboard.up("down")) {
        mesh.position.y -= 1;
        moveHighlighter();
    } else if (keyboard.up("left")) {
        mesh.position.x -= 1;
        moveHighlighter();
    } else if (keyboard.up("right")) {
        mesh.position.x += 1;
        moveHighlighter();
    } else if (keyboard.up("pageup")) {
        mesh.position.z += 1;
        moveHighlighter();
    } else if (keyboard.up("pagedown")) {
        mesh.position.z -= 1;
        moveHighlighter();
    }
    if (keyboard.up("p")) {
        mode = "picking";
        faceEditor.empty();
        alert("picking");
    }
    // Updates the camera controls
    controls.update();
}
//**************************************************************************************************
//****************************************Editor manipulating functions*****************************
// Function for displaying the scene elements in the drop down
function rebuildDropDown() {
    // The Drop Down list
    var selectBox = document.getElementById('meshSelector');
    // Clears the Drop Down list
    selectBox.options.length = 0;
    // Adds the scene elements to the drop down list
    for (var i = 0; i < scene.children.length; i++) {
        // Checks if this scene element should be added or if its part of the grid or other
        // default element
        if (scene.children[i].name != "default" && scene.children[i].name != "defaultLight") {
            // Creates the new option for the ddl based off the objects name
            var option = document.createElement("option");
            option.text = scene.children[i].name;
            option.value = scene.children[i].name;
            if (mesh != undefined && option.text == mesh.name) {
                option.selected = true;
            }
            selectBox.add(option);
        }
    }
}
// Function for updating the mesh editor div based off the mesh being selected
function changeEditorDiv() {
    if (lightHelper != undefined) {
        scene.remove(lightHelper);
    }
    // hides the highlighter
    cleanupHighlighter();
    // The currently selected mesh
    mesh = scene.getObjectByName(document.getElementById('meshSelector').value);
    // If the selection is a mesh highlight and display editor if not (cameras, lights, etc)
    // do not highlight it
    if (mesh.name == "Skybox") {
    } else if (mesh instanceof THREE.PointCloud) {
        for (var index = 0; index < listOfSystems.length; index++) {
            if (listOfSystems[index].particleGroup == mesh) {
                editor.empty();
                listOfSystems[index].displayGUI();
            }
        }
    } else if (mesh instanceof THREE.Light) {
        editor.empty();
        displayLightToolbar();
    } else if (mesh.geometry instanceof THREE.Geometry) {
        createHighlighter();
        showHighlighter();
        editor.empty();
        displayGeometryToolbar();
    } else if (mesh instanceof THREE.Camera) {
        editor.empty();
    }
}
//**************************************************************************************************
//************************************* Picking event handler **************************************
function onMouseClick(event) {
    // Object used to trace rays through the scene
    var raycaster = new THREE.Raycaster();
    // The vector for the mouse coordinates
    var mouseVector = new THREE.Vector2();
    // Prevents the normal browser clicking event from being processed
    event.preventDefault();
    // Calculates the mouse position on the canvas
    mouseVector.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
    mouseVector.y = -( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
    // Based off of the mouse location and camera traces a ray through the scene
    raycaster.setFromCamera(mouseVector, camera);
    // Searches the scene objects for an intersection, if intersections are found selects the drop
    // down list entry, and updates the editor panel for the selected scene element, if no
    // intersections found clears the editor
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // Selects the first intersection
        for (var i = 0; i < document.getElementById("meshSelector").length; i++) {
            if (document.getElementById("meshSelector").options[i].value == intersects[0].object.name) {
                document.getElementById("meshSelector").options[i].selected = true;
                break;
            }
        }
        // If explode is enabled the first intersected face is also selected and the face editor
        // is displayed
        // Updates the mesh editor div
        changeEditorDiv();
        if (mode == "explode") {
            selectedFace = intersects[0].face;
            displayFaceEditor(selectedFace);
        }

    }
    /*else {
     // Nothing was intersected so the editors are cleared
     cleanupHighlighter();
     // De-selects the previously selected mesh in the ddl
     document.getElementById("meshSelector").selectedIndex = -1;
     editor.empty();
     faceEditor.empty();
     }
     */
}
//**************************************************************************************************
//******************************Stuff that makes the buttons work***********************************

function generateMesh() {
    var geometry, localMesh, material;
    if (document.getElementById('shapeSelector').value == 'Point Light') {
        var light = new THREE.PointLight(0xffffff);
        light.userData = {TYPE: "light"};
        light.position.set(-200, 200, 200);
        light.name = "Point Light" + id;
        scene.add(light);
        mesh = light;
        rebuildDropDown();
        changeEditorDiv();
    } else if (document.getElementById('shapeSelector').value == 'Ambient Light') {
        var light = new THREE.AmbientLight(0x666666);
        light.name = "Ambient Light" + id;
        light.userData = {TYPE: "light"};
        scene.add(light);
        mesh = light;
        rebuildDropDown();
        changeEditorDiv();
    } else if (document.getElementById('shapeSelector').value == 'Spot Light') {
        var light = new THREE.SpotLight(0xffffff, 1.0, 0.0, Math.PI / 3, 10.0, 1);
        light.name = "Spot Light" + id;
        light.userData = {TYPE: "light"};
        scene.add(light);
        mesh = light;
        rebuildDropDown();
        changeEditorDiv();
    } else if (document.getElementById('shapeSelector').value == 'Particle System') {
        var particleGroup = new makeParticleSystem();
        particleGroup.particleGroup.name = "Particle System " + id;
        particleGroup.userData = {TYPE: "particle"};
        id++;
        listOfSystems.push(particleGroup);
        scene.add(particleGroup.particleGroup);
        mesh = particleGroup.particleGroup;
        rebuildDropDown();
        changeEditorDiv();

    } else {
        if (document.getElementById('shapeSelector').value == 'Cube') {
            geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        } else if (document.getElementById('shapeSelector').value == 'Plane') {
            geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        } else if (document.getElementById('shapeSelector').value == 'Sphere') {
            geometry = new THREE.SphereGeometry(1, 8, 6, 0, 6.3, 0, 3.14);
        } else if (document.getElementById('shapeSelector').value == 'Cylinder') {
            geometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false, 0, 6.3);
        }
        // Material for the new mesh
        material = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            vertexColors: THREE.FaceColors
        });
        material.vertexColors = THREE.FaceColors;
        material.transparent = true;
        localMesh = new THREE.Mesh(geometry, material);
        localMesh.geometry.dynamic = true;
        localMesh.name = document.getElementById('shapeSelector').value + id;

        id++;
        scene.add(localMesh);
        mesh = localMesh;
        // Repopulates the selectMesh dropdown list with the new mesh name
        rebuildDropDown();
        editor.empty();
        displayGeometryToolbar();
    }
}
function addEventListeners() {
    // Handles adding a new mesh to the scene by reading in the selected drop down item and creating
    // the proper geometry
    document.getElementById('place_butt').onclick = function () {
        generateMesh();
    };// Shows grid
    document.getElementById('show_grid').onclick = function () {
        showGrid();
    };
// Hides grid
    document.getElementById('hide_grid').onclick = function () {
        hideGrid();
    };
// Updates the editor div when a new mesh is selected in the ddl
    document.getElementById('meshSelector').onchange = function () {
        changeEditorDiv();
    };
// Save scene
    document.getElementById('save_butt').onclick = function () {
        var r = window.confirm("SketchCad currently does not support saving of particle systems. These " +
            "items will cause issues when saving. Continue?")
        if(r){
            var retval = prompt("Please enter a filename: ");
            var filename = retval;
            var exporter = new THREE.SceneExporter();
            var sceneJson = JSON.stringify(exporter.parse(scene));
            localStorage.setItem('scene', sceneJson);
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sceneJson));
            pom.setAttribute('download', filename);
            //create_default_lights();
            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
    };

    function readSingleFile(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0];

        if (f) {
            var r = new FileReader();
            r.onload = function(e) {
                var contents = e.target.result;
                var sceneLoader = new THREE.SceneLoader();
                sceneLoader.parse(JSON.parse(contents), function (e) {
                    scene = e.scene;
                }, '.');
                rebuildDropDown();
                addGrid();
                var SCREEN_WIDTH = container.clientWidth, SCREEN_HEIGHT = container.clientHeight;
                var VIEW_ANGLE = 2, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;
                camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
                camera.name = "Camera";
                scene.add(camera);
                camera.position.set(400, 400, 400);

                // Camera Controls
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                addEventListeners();
                THREEx.WindowResize(renderer, camera);

            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }
    }

    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
}
