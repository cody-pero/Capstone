$(function() { init(); render(); });
var container, scene, camera, renderer, controls, stats, editor, faceEditor;
var keyboard = new KeyboardState();
var clock = new THREE.Clock();

var mode;
var mesh;
var selectedFace;
var grid = [];
var id = 0;

function init() {
    // Scene
    scene = new THREE.Scene();
    mode = "picking";
    // Camera / container / renderer settings
    container = document.getElementById( "WebGLCanvas" );
    editor = $("#editorDiv");
    faceEditor = $("#editor2Div");
    var SCREEN_WIDTH = container.clientWidth, SCREEN_HEIGHT = container.clientHeight;
    var VIEW_ANGLE = 2, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;

    if ( Detector.webgl ) {
        renderer = new THREE.WebGLRenderer( { antialias:true } );
    }
    else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
    camera.name = "Camera";
    scene.add(camera);
    camera.position.set(100,100,100);

    // Camera Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // Default Lights
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-200,200,200);
    light.name = "Default Point Light";
    var light2 = new THREE.AmbientLight(0x333333);
    light2.position.set( light.position );
    light2.name = "Default Ambient Light";
    scene.add(light2);

    // Keyboard events here

    scene.add(light);
    addGrid();
    rebuildDropDown();
}

function render() {
    requestAnimationFrame(render);
    renderer.render( scene, camera );
    update();

}
function update() {
    keyboard.update();
    if( keyboard.up( "e" ) ) {
        mode = "explode";
    } else if( keyboard.up( "p" ) ) {
        mode = "picking";
    }
    controls.update();
}
// Adds the grid to the scene
function addGrid() {
    var gridOpacity = .4;
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( camera.far, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( -camera.far, 0, 0 ) );
    var material = new THREE.LineBasicMaterial( { color: 0x0000ff, transparent: true, opacity: gridOpacity } );
    var line = new THREE.Line( geometry, material );
    line.name = "default";
    grid.push( line );
    scene.add( line );

    geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0,camera.far, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, -camera.far, 0 ) );
    material = new THREE.LineBasicMaterial( { color: 0x00ff00, transparent: true, opacity: gridOpacity } );
    line = new THREE.Line( geometry, material );
    line.name = "default";
    grid.push( line );
    scene.add( line );

    geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, camera.far ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    geometry.vertices.push( new THREE.Vector3( 0, 0, -camera.far ) );
    material = new THREE.LineBasicMaterial( { color: 0xff0000, transparent: true, opacity: gridOpacity } );
    line = new THREE.Line( geometry, material );
    line.name = "default";
    grid.push( line );
    scene.add( line );
    // Using mouseup instead of mousedown allows the combination of both the camera controls and picking to happen,
    // not sure why mousedown was messing with the camera controls...
    container.addEventListener( 'mouseup', onMouseClick, false );
}
function hideGrid() {
    for (var line in grid) {
        grid[line].visible = false;
    }
}

function showGrid() {
    for ( var line in grid ) {
        grid[line].visible = true;
    }
}
// Function for displaying the scene elements in the drop down
function rebuildDropDown() {
    var selectBox = document.getElementById('meshSelector');
    selectBox.options.length = 0;
    for ( var i = 0; i < scene.children.length; i ++ ) {
        if( scene.children[i].name != "default" && scene.children[i].name != "defaultLight" ) {
            var option = document.createElement("option");
            option.text = scene.children[i].name;
            option.value = scene.children[i].name;
            selectBox.add(option);
        }
    }
}

function changeEditorDiv() {
    cleanupHighlighter();
    mesh = scene.getObjectByName( document.getElementById( 'meshSelector' ).value );
    if( mesh instanceof THREE.Mesh ) {
        createHighlighter();
        showHighlighter();
        showArrows();
    } else {
        hideArrows();
        hideHighlighter();
    }

    if ( mesh.geometry instanceof THREE.BoxGeometry ) {
        editor.empty();
        displayGeometryToolbar( );
    } else  if ( mesh.geometry instanceof THREE.SphereGeometry ) {
        editor.empty();
        displayGeometryToolbar();
    } else if ( mesh.geometry instanceof THREE.PlaneGeometry ) {
        editor.empty();
        displayGeometryToolbar();
    } else if ( mesh.geometry instanceof THREE.CylinderGeometry ) {
        editor.empty();
        displayGeometryToolbar();
    } else if (mesh instanceof THREE.PointLight ) {
        editor.empty();
    } else if (mesh instanceof THREE.PerspectiveCamera ) {
        editor.empty();
    }
}

// Picking event handler
function onMouseClick( event ) {
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2();
    // Prevents the normal browser clicking event from being processed
    event.preventDefault();
    // Calculates the mouse position on the canvas
    mouseVector.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
    mouseVector.y = -( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera);
    // Searches the scene objects for an intersection, if intersections are found selects the drop down list entry
    // and updates the editor panel for the selected scene element, if no intersections found clears the editor
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {

        for (var i = 0; i < document.getElementById("meshSelector").length; i++) {
            if (document.getElementById("meshSelector").options[i].value == intersects[0].object.name) {
                document.getElementById("meshSelector").options[i].selected = true;
                break;
            }
        }
        if ( mode == "explode" ) {
            selectedFace = intersects[ 0].face;
            displayFaceEditor( selectedFace );
            intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
            intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
        }
        changeEditorDiv();
    } else {
        cleanupHighlighter();
        var editorDiv = $("#editorDiv");
        var editor2Div = $("#editor2Div");
        document.getElementById("meshSelector").selectedIndex = -1;
        editorDiv.empty();
        editor2Div.empty();
    }
}
//******************************Stuff that makes the buttons work****************************************************//

// Handles adding a new mesh to the scene by reading in the selected drop down item and creating the proper geometry
document.getElementById('place_butt').onclick = function() {
    if ( document.getElementById('shapeSelector').value == 'Point Light' ) {
        alert("does nothing yet");
    } else {
        if (document.getElementById('shapeSelector').value == 'Cube') {
            geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        } else if (document.getElementById('shapeSelector').value == 'Plane') {
            geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        } else if (document.getElementById('shapeSelector').value == 'Sphere') {
            geometry = new THREE.SphereGeometry(1, 8, 6, 0, 3.14 * 2, 0, 3.14);
        } else if (document.getElementById('shapeSelector').value == 'Cylinder') {
            geometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1, false, 0, 2 * 3.14);
        }
        // Material for the new mesh
        material = new THREE.MeshLambertMaterial( { color: 0xff0000, vertexColors: THREE.FaceColors });
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
};
document.getElementById('show_grid').onclick = function() {
    showGrid();
};
document.getElementById('hide_grid').onclick = function() {
    hideGrid();
};
document.getElementById('save_butt').onclick = function() {
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

document.getElementById("load_butt").onclick = function() {
        var json = (localStorage.getItem('scene'));
        var sceneLoader = new THREE.SceneLoader();
        sceneLoader.parse(JSON.parse(json), function (e) {
            scene = e.scene;
        }, '.');
    rebuildDropDown();
    addGrid();
    var SCREEN_WIDTH = container.clientWidth, SCREEN_HEIGHT = container.clientHeight;
    var VIEW_ANGLE = 2, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
    camera.name = "Camera";
    scene.add(camera);
    camera.position.set(100,100,100);

    // Camera Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
}
document.getElementById('meshSelector').onchange = function() {
    changeEditorDiv();
};
