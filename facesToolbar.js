/**
 * Functions for manipulating the faces of an object via a gui
 */

// The selected face being edited
var selectedFace;
// The gui for editing faces
var faceGui;
// Variables being tracked in the gui
var faceParameters;

// adds the gui to the html
function displayFaceEditor(selectedFace) {
    faceEditor.empty();
    this.selectedFace = selectedFace;

    if (this.selectedFace != null) {
        faceGui = new dat.GUI({"width": document.getElementById('editorDiv').clientWidth});
        generateFaceParameterList();
        generateVertexFolder();
        faceGui.open();
        faceEditor.append(faceGui.domElement);
    }
}


// establishes the starting value for the parameters being tracked
function generateFaceParameterList() {
    faceParameters =
    {
        vertexA: this.selectedFace.a,
        vertexAXPos: mesh.geometry.vertices[this.selectedFace.a].x,
        vertexAYPos: mesh.geometry.vertices[this.selectedFace.a].y,
        vertexAZPos: mesh.geometry.vertices[this.selectedFace.a].z,
        vertexB: this.selectedFace.b,
        vertexBXPos: mesh.geometry.vertices[this.selectedFace.b].x,
        vertexBYPos: mesh.geometry.vertices[this.selectedFace.b].y,
        vertexBZPos: mesh.geometry.vertices[this.selectedFace.b].z,
        vertexC: selectedFace.c,
        vertexCXPos: mesh.geometry.vertices[this.selectedFace.c].x,
        vertexCYPos: mesh.geometry.vertices[this.selectedFace.c].y,
        vertexCZPos: mesh.geometry.vertices[this.selectedFace.c].z,
        extrudeAmount: 0,
        normal: selectedFace.normal,
        color: selectedFace.color,
        vertexColors: selectedFace.vertexColors,
        vertexNorm: selectedFace.vertexNormals,
        matIndex: selectedFace.materialIndex
    };
}

// builds the folders for the gui
function generateVertexFolder() {
    var folder1 = faceGui.addFolder('Vertex A');
    var aXValue = folder1.add(faceParameters, "vertexAXPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    aXValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].x = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.colorsNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var aYValue = folder1.add(faceParameters, "vertexAYPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    aYValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].y = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.colorsNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var aZValue = folder1.add(faceParameters, "vertexAZPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    aZValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].z = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.verticesNeedUpdate = true;
        geometry.__dirtyColors = true;
        mesh.geometry.colorsNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });

    var folder2 = faceGui.addFolder('Vertex B');
    var bXValue = folder2.add(faceParameters, "vertexBXPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    bXValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].x = value;
        mesh.geometry.__dirtyVertices = true;
        geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var bYValue = folder2.add(faceParameters, "vertexBYPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    bYValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].y = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var bZValue = folder2.add(faceParameters, "vertexBZPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    bZValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].z = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });

    var folder3 = faceGui.addFolder('Vertex C');
    var cXValue = folder3.add(faceParameters, "vertexCXPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    cXValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].x = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var cYValue = folder3.add(faceParameters, "vertexCYPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    cYValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].y = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var cZValue = folder3.add(faceParameters, "vertexCZPos").min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(.1).listen();
    cZValue.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].z = value;
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.material.needsUpdate = true;
    });
    var folder4 = faceGui.addFolder('Extrude Face');
    var extrudeLength = folder4.add(faceParameters,
        "extrudeAmount").min(0).max(parseInt(sceneSize)).step(.1).listen();
    extrudeLength.onChange(function (value) {
        mesh.geometry.vertices[selectedFace.a].x = mesh.geometry.vertices[selectedFace.a].x +
            (value * selectedFace.normal.x);
        mesh.geometry.vertices[selectedFace.a].y = mesh.geometry.vertices[selectedFace.a].y +
            (value * selectedFace.normal.y);
        mesh.geometry.vertices[selectedFace.a].z = mesh.geometry.vertices[selectedFace.a].z +
            (value * selectedFace.normal.z);

        mesh.geometry.vertices[selectedFace.b].x = mesh.geometry.vertices[selectedFace.b].x +
            (value * selectedFace.normal.x);
        mesh.geometry.vertices[selectedFace.b].y = mesh.geometry.vertices[selectedFace.b].y +
            (value * selectedFace.normal.y);
        mesh.geometry.vertices[selectedFace.b].z = mesh.geometry.vertices[selectedFace.b].z +
            (value * selectedFace.normal.z);

        mesh.geometry.vertices[selectedFace.c].x = mesh.geometry.vertices[selectedFace.c].x +
            (value * selectedFace.normal.x);
        mesh.geometry.vertices[selectedFace.c].y = mesh.geometry.vertices[selectedFace.c].y +
            (value * selectedFace.normal.y);
        mesh.geometry.vertices[selectedFace.c].z = mesh.geometry.vertices[selectedFace.c].z +
            (value * selectedFace.normal.z);
        mesh.geometry.__dirtyVertices = true;
        mesh.geometry.__dirtyColors = true;
        mesh.geometry.verticesNeedUpdate = true;

    });

}