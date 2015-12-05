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
var editor, faceEditor, mode, selectedFace;

// used for getting keyboard commands
var keyboard = new KeyboardState();
// next available id ******************* check out a way to carry over the id value to avoid
// duplicates when saving/loading
var id = 0;
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
    camera.position.set(100, 100, 100);

    // Sets up Camera Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Add Default Lights
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-200, 200, 200);
    light.name = "Default Point Light";
    var light2 = new THREE.AmbientLight(0x333333);
    light2.position.set(light.position);
    light2.name = "Default Ambient Light";
    scene.add(light2);
    scene.add(light);

    // Adds the event listener for the mesh picking event
    container.addEventListener('mouseup', onMouseClick, false);

    // Adds the grid to the scene
    addGrid();
    // Creates the list in the drop down of scene elements
    rebuildDropDown();
    addEventListeners();
}

// Renderer function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    update();

}
// Update function used to update camera controls and trigger on keyboard input events
function update() {
    // Updates any key flags in the keyboard object
    keyboard.update();
    // Checks for various keyboard input
    if (keyboard.up("e")) {
        mode = "explode";
    } else if (keyboard.up("p")) {
        mode = "picking";
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
            selectBox.add(option);
        }
    }
}
// Function for updating the mesh editor div based off the mesh being selected
function changeEditorDiv() {
    // hides the highlighter
    cleanupHighlighter();
    // The currently selected mesh
    mesh = scene.getObjectByName(document.getElementById('meshSelector').value);
    // If the selection is a mesh highlight and display editor if not (cameras, lights, etc)
    // do not highlight it
    if (mesh instanceof THREE.Mesh) {
        createHighlighter();
        showHighlighter();
        editor.empty();
        displayGeometryToolbar();
    } else {
        hideHighlighter();
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
        if (mode == "explode") {
            selectedFace = intersects[0].face;
            displayFaceEditor(selectedFace);
        }
        // Updates the mesh editor div
        changeEditorDiv();
    } else {
        // Nothing was intersected so the editors are cleared
        cleanupHighlighter();
        // De-selects the previously selected mesh in the ddl
        document.getElementById("meshSelector").selectedIndex = -1;
        editor.empty();
        faceEditor.empty();
    }
}
//**************************************************************************************************
//******************************Stuff that makes the buttons work***********************************


function addEventListeners() {
    // Handles adding a new mesh to the scene by reading in the selected drop down item and creating
    // the proper geometry
    document.getElementById('place_butt').onclick = function () {
        var geometry, mesh, material;
        if (document.getElementById('shapeSelector').value == 'Point Light') {
            alert("does nothing yet");
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
            mesh = new THREE.Mesh(geometry, material);
            mesh.geometry.dynamic = true;
            mesh.name = document.getElementById('shapeSelector').value + id;

            id++;
            scene.add(mesh);
            // Repopulates the selectMesh dropdown list with the new mesh name
            rebuildDropDown();
        }
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
        /*
         var retval = prompt("Please enter a filename: ");
         var filename = retval;
         */
        var exporter = new THREE.SceneExporter();
        var sceneJson = JSON.stringify(exporter.parse(scene));
        localStorage.setItem('scene', sceneJson);
        /*
         //TODO DO NOT DELETE ANYTHING BELOW
         var pom = document.createElement('a');
         pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(sceneJson));
         pom.setAttribute('download', filename);
         if (document.createEvent) {
         var event = document.createEvent('MouseEvents');
         event.initEvent('click', true, true);
         pom.dispatchEvent(event);
         }
         else {
         pom.click();
         }
         */
    };
// Load scene
    document.getElementById("load_butt").onclick = function () {
        var json = (localStorage.getItem('scene'));
        var sceneLoader = new THREE.SceneLoader();
        sceneLoader.parse(JSON.parse(json), function (e) {
            scene = e.scene;
        }, '.');
        rebuildDropDown();
        addGrid();
        var SCREEN_WIDTH = container.clientWidth, SCREEN_HEIGHT = container.clientHeight;
        var VIEW_ANGLE = 2, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.name = "Camera";
        scene.add(camera);
        camera.position.set(100, 100, 100);

        // Camera Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }
}
