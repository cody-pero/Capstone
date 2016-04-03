/**
 * Created by Charlie on 2/16/2016.
 */
// default settings for the particles mostly 0 for anything that causes it to move, and a small
// cube pattern to the randomization of vertices
var particleAttributes = {

};

function MakeParticleSystem( ) {
    this.savedParameters = undefined;
    this.particleGUI = undefined;
    this.particleGroup = initializeSystem();
    particleAttributes.currSystem = this;

}
MakeParticleSystem.prototype.saveParameters = function( otherSavedParams ) {
    this.savedParameters = otherSavedParams;
    this.savedParameters.currSystem = this;

}
/* Further Testing required but works with multiple systems */
MakeParticleSystem.prototype.updateParticles = function() {
    if(this.savedParameters != undefined) {
        var time = 4 * clock.getElapsedTime();
        var vertices = this.particleGroup.geometry.vertices;
        this.particleGroup.geometry.verticesNeedUpdate = true;
        this.particleGroup.material.colorsNeedUpdate = true;
        for (var i = 0; i < vertices.length; i++) {
            // Moves the vertices by there velocity
            var v = vertices[i];
            v.y = v.y - (this.savedParameters.pVelY/10);
            v.x = v.x - (this.savedParameters.pVelX/10);
            v.z = v.z - (this.savedParameters.pVelZ/10);

            // Keeps the vertices contained in user specified region
            if (v.y <= this.savedParameters.pPosYLower) {
                v.y = this.savedParameters.pPosYUpper;
            } else if (v.y >= this.savedParameters.pPosYUpper) {
                v.y = this.savedParameters.pPosYLower;
            }
            if (v.x <= this.savedParameters.pPosXLower) {
                v.x = this.savedParameters.pPosXUpper;
            } else if (v.x >= this.savedParameters.pPosXUpper) {
                v.x = this.savedParameters.pPosXLower;
            }
            if (v.z <= this.savedParameters.pPosZLower) {
                v.z = this.savedParameters.pPosZUpper;
            } else if (v.z >= this.savedParameters.pPosZUpper) {
                v.z = this.savedParameters.pPosZLower;
            }
        }
        this.particleGroup.rotation.x = time * (this.savedParameters.groupXrot/10);
        this.particleGroup.rotation.y = time * (this.savedParameters.groupYrot/10);
        this.particleGroup.rotation.z = time * (this.savedParameters.groupZrot/10);
    }
};

MakeParticleSystem.prototype.displayGUI = function() {
    this.particleGUI = new dat.GUI({"width": document.getElementById('editorDiv').clientWidth});
    this.makeGUI();
    this.particleGUI.open();
    editor.append(this.particleGUI.domElement);
};
MakeParticleSystem.prototype.makeGUI = function() {
    var obj = {Name: mesh.name};
    this.particleGUI.add(obj, 'Name');
    this.setupFolder1();
    this.setupFolder2();
    this.setupFolder3();
    var obj = {
        Redistribute: function () {
            var copyOfParams  = $.extend(true, {}, particleAttributes);
            var oldSystem = particleAttributes.currSystem;
            oldSystem.saveParameters(copyOfParams);

            var newSystem = new MakeParticleSystem();
            newSystem.saveParameters(oldSystem.savedParameters);
            addNewSystem(newSystem);
            removeOldSystem(oldSystem);
            changeEditorDiv();
        }
    };
    this.particleGUI.add(obj, 'Redistribute');
    obj = {
        Delete_System: function () {
            scene.remove(mesh);
            cleanupHighlighter();
            editor.empty();
            faceEditor.empty();
            rebuildDropDown();
        }
    };
    this.particleGUI.add(obj, 'Delete_System');

    // Opens the gui clears the editor div and appends the gui to the div
    this.particleGUI.open();
    editor.append(this.particleGUI.domElement);
};

MakeParticleSystem.prototype.setupFolder1 = function() {
    var folder1 = this.particleGUI.addFolder('Particle Settings');
//________________________________________Velocity
    // The speed in which the particle travels the X plane
    var pVelocityX = folder1.add(particleAttributes, "pVelX")
        .min(-10).max(10).step(1).listen();
    pVelocityX.onChange(function(value) {
        particleAttributes.pVelX = value;
    });
    // The speed in which the particle travels the Y plane
    var pVelocityY = folder1.add(particleAttributes, "pVelY")
        .min(-10).max(10).step(1).listen();
    pVelocityY.onChange(function(value) {
        particleAttributes.pVelY = value;
    });
    // The speed in which the particle travels the Z plane
    var pVelocityZ = folder1.add(particleAttributes, "pVelZ")
        .min(-10).max(10).step(1).listen();
    pVelocityZ.onChange(function(value) {
        particleAttributes.pVelZ = value;
    });
//________________________________________Position
    // The minimum starting x positon on the plane
    var pPosXLowerBound = folder1.add(particleAttributes, "pPosXLower")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosXLowerBound.onChange(function(value) {
        particleAttributes.pPosXLower = value;
    });

    // The maximum starting x positon on the plane
    var pPosXUpperBound = folder1.add(particleAttributes, "pPosXUpper")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosXUpperBound.onChange(function(value) {
        particleAttributes.pPosXUpper = value;
    });

    // The minimum starting y positon on the plane
    var pPosYLowerBound = folder1.add(particleAttributes, "pPosYLower")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosYLowerBound.onChange(function(value) {
        particleAttributes.pPosYLower = value;
    });

    var pPosYUpperBound = folder1.add(particleAttributes, "pPosYUpper")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosYUpperBound.onChange(function(value) {
        particleAttributes.pPosYUpper = value;
    });

    // The minimum starting z positon on the plane
    var pPosZLowerBound = folder1.add(particleAttributes, "pPosZLower")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosZLowerBound.onChange(function(value) {
        particleAttributes.pPosZLower = value;
    });

    // The maximum starting z positon on the plane
    var pPosZUpperBound = folder1.add(particleAttributes, "pPosZUpper")
        .min(-1 * parseInt(sceneSize)).max(parseInt(sceneSize)).step(1).listen();
    pPosZUpperBound.onChange(function(value) {
        particleAttributes.pPosZUpper = value;
    });
};
MakeParticleSystem.prototype.setupFolder2 = function() {
    var folder2 = this.particleGUI.addFolder('Emitter Settings');
    // Controls the number of particles in the system
    var eNumParticles = folder2.add(particleAttributes, "numParticles")
        .min(1).max(10000).step(50).listen();
    eNumParticles.onChange(function(value) {
        particleAttributes.numParticles = value;
    });
    var eXrot = folder2.add(particleAttributes, "groupXrot")
        .min(-10).max(10).step(1).listen();
    eXrot.onChange(function(value) {
        particleAttributes.groupXrot = value;
    });
    var eYrot = folder2.add(particleAttributes, "groupYrot")
        .min(-10).max(10).step(1).listen();
    eYrot.onChange(function(value) {
        particleAttributes.groupYrot = value;
    });
    var eZrot = folder2.add(particleAttributes, "groupZrot")
        .min(-10).max(10).step(1).listen();
    eZrot.onChange(function(value) {
        particleAttributes.groupZrot = value;
    });
    var obj = {
        Delete: function () {
            removeOldSystem();
            editor.empty();
        }
    };
    folder2.add(obj, 'Delete');


};
MakeParticleSystem.prototype.setupFolder3 = function() {
    var folder3 = this.particleGUI.addFolder('Material Settings');

    var mOpacity = folder3.add(particleAttributes, "opacity")
        .min(0).max(1).step(.1).listen();
    mOpacity.onChange(function(value) {
        particleAttributes.opacity = value;
    });

    var mSize = folder3.add(particleAttributes, "size")
        .min(1).max(50).step(1).listen();
    mSize.onChange(function(value) {
        particleAttributes.size = value;
    });

    var mTrans = folder3.add(particleAttributes, "transparent").listen();
    mTrans.onChange(function(value) {
        particleAttributes.transparent = value;
    });
    var mTexture = folder3.add(particleAttributes,
        'map', ["raindrop", "smoke", "snowflake", "spark", "spikey", "star"]).name('Texture Type').listen();
    mTexture.onChange(function(value) {
       particleAttributes.map =  value;
    });
    var mBlending = folder3.add(particleAttributes, 'blending', ["None", "Normal", "Additive"]).listen();
    mBlending.onChange(function(value) {
        particleAttributes.blending = value;
    });
    var mDepthWrite = folder3.add(particleAttributes, 'depthWrite').listen();
    mDepthWrite.onChange(function(value) {
        particleAttributes.depthWrite = value;
    });
    var mSizeAttenuation = folder3.add(particleAttributes, 'sizeAttenuation').listen();
    mDepthWrite.onChange(function(value) {
        particleAttributes.sizeAttenuation = value;
    });
    var mrValueMin = folder3.add(particleAttributes, "rValueMin")
        .min(0).max(100).step(1).listen();
    mrValueMin.onChange(function(value) {
        particleAttributes.rValueMin = value;
    });
    var mrValueMax = folder3.add(particleAttributes, "rValueMax")
        .min(0).max(100).step(1).listen();
    mrValueMax.onChange(function(value) {
        particleAttributes.rValueMax = value;
    });
    var mgValueMin = folder3.add(particleAttributes, "gValueMin")
        .min(0).max(100).step(1).listen();
    mgValueMin.onChange(function(value) {
        particleAttributes.gValueMin = value;
    });
    var mgValueMax = folder3.add(particleAttributes, "gValueMax")
        .min(0).max(100).step(1).listen();
    mgValueMax.onChange(function(value) {
        particleAttributes.gValueMax = value;
    });
    var mbValueMin = folder3.add(particleAttributes, "bValueMin")
        .min(0).max(100).step(1).listen();
    mbValueMin.onChange(function(value) {
        particleAttributes.bValueMin = value;
    });
    var mbValueMax = folder3.add(particleAttributes, "bValueMax")
        .min(0).max(100).step(1).listen();
    mbValueMax.onChange(function(value) {
        particleAttributes.bValueMax = value;
    });
}
function addNewSystem(newSystem) {
    listOfSystems.push(newSystem);
    scene.add(newSystem.particleGroup);
    newSystem.particleGroup.name = mesh.name;
    mesh = newSystem.particleGroup;
    changeEditorDiv();
}
function removeOldSystem() {
    var index = listOfSystems.indexOf(particleAttributes.currSystem);
    if(index > -1) {
        listOfSystems.splice(index, 1);
    } else {
        alert("couldnt find pSystem");
    }

    scene.remove(mesh);
    rebuildDropDown();

}
function initializeSystem(){

    var geometry = new THREE.Geometry();

    for (var i = 0; i < particleAttributes.numParticles; i ++ ) {

        var vertex = new THREE.Vector3();
        if ( particleAttributes.pPosXUpper < 0 ) {
            vertex.x = (Math.random() * (particleAttributes.pPosXLower)) + particleAttributes.pPosXUpper;
        } else if(particleAttributes.pPosXLower < 0) {
            vertex.x = (Math.random() * (particleAttributes.pPosXUpper * 2)) + particleAttributes.pPosXLower;
        } else {
            vertex.x = (Math.random() * (particleAttributes.pPosXUpper)) + particleAttributes.pPosXLower;
        }

        if ( particleAttributes.pPosYUpper < 0 ) {
            vertex.y = (Math.random() * (particleAttributes.pPosYLower)) + particleAttributes.pPosYUpper;
        } else if(particleAttributes.pPosYLower < 0) {
            vertex.y = (Math.random() * (particleAttributes.pPosYUpper*2)) + particleAttributes.pPosYLower;
        } else {
            vertex.y = (Math.random() * (particleAttributes.pPosYUpper)) + particleAttributes.pPosYLower;
        }

        if ( particleAttributes.pPosZUpper < 0 ) {
            vertex.z = (Math.random() * (particleAttributes.pPosZLower)) + particleAttributes.pPosZUpper;
        } else if(particleAttributes.pPosZLower < 0) {
            vertex.z = (Math.random() * (particleAttributes.pPosZUpper*2)) + particleAttributes.pPosZLower;
        } else {
            vertex.z = (Math.random() * (particleAttributes.pPosZUpper)) + particleAttributes.pPosZLower;
        }

        geometry.vertices.push( vertex );

    }
    var colors = [];
    for(var i = 0; i < geometry.vertices.length; i++ ){
        colors[i] = new THREE.Color();

        colors[i].setRGB((Math.random() * particleAttributes.rValueMax / 100) + particleAttributes.rValueMin / 100,
                         (Math.random() * particleAttributes.gValueMax / 100) + particleAttributes.gValueMin / 100,
                         (Math.random() * particleAttributes.bValueMax / 100) + particleAttributes.bValueMin / 100);

    }
    geometry.colors = colors;
    var blendWith = THREE.NoBlending;
    if(particleAttributes.blending == "None") {
        blendWith = THREE.NoBlending;
    } else if(particleAttributes.blending == "Normal") {
        blendWith = THREE.NormalBlending;
    } else if(particleAttributes.blending == "Additive") {
        blendWith = THREE.AdditiveBlending;
    }
    var pMaterial = new THREE.ParticleBasicMaterial({
        size: particleAttributes.size,
        transparent: particleAttributes.transparent,
        opacity: particleAttributes.opacity,
        map: THREE.ImageUtils.loadTexture("images/" + particleAttributes.map + ".png"),
        blending: blendWith,
        depthWrite: particleAttributes.depthWrite,
        sizeAttenuation: particleAttributes.sizeAttenuation,
        vertexColors: THREE.VertexColors
    });
    // range of coverage on screen


    var particles = new THREE.PointCloud(geometry, pMaterial);

    return particles;

};










































































    /*
var particleTexture = THREE.ImageUtils.loadTexture( 'images/raindrop.png' );

particleGroup = new THREE.Object3D();
particleAttributes = { startSize: [], startPosition: [], randomness: [] };

var totalParticles = 100;
var radiusRange = 500;
var a = 5;
var offset = 2;
var numArms = 3;
for(var arm; arm < numArms; arm++) {
    for (var i = 0; i < totalParticles; i++) {

        var spriteMaterial = new THREE.SpriteMaterial({
            map: particleTexture,
            useScreenCoordinates: false,
            color: 0xffffff
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.x = a * i * Math.cos(i +(Math.PI * arm)) + (Math.random() * offset);
        sprite.position.y = a * i * Math.sin(i +(Math.PI * arm)) + (Math.random() * offset);
        sprite.position.z = (Math.random() * a);
        sprite.scale.set(8, 8, 0.25); // imageWidth, imageHeight
        //sprite.position.set( Math.random() * 1000, 0.5, Math.random() * 1000);

        // for a cube:
        // sprite.position.multiplyScalar( radiusRange );
        // for a solid sphere:
        // sprite.position.setLength( radiusRange * Math.random() );
        // for a spherical shell:
        sprite.position.setLength(radiusRange * (Math.random()) * 0.1 + 0.9);

        // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() );
        sprite.material.color.setHSL(Math.random(), 0.9, 0.7);

        // sprite.opacity = 0.80; // translucent particles
        sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles

        particleGroup.add(sprite);
        particleGroup.isAParticle = true;
        // add variable qualities to arrays, if they need to be accessed later
        particleAttributes.startPosition.push(sprite.position.clone());
        particleAttributes.randomness.push(Math.random());
    }
}
particleGroup.position.y = 0;


scene.add( particleGroup );
var time = 4 * clock.getElapsedTime();

for ( var c = 0; c < particleGroup.children.length; c ++ )
{
    var sprite = particleGroup.children[ c ];

    // particle wiggle
    var wiggleScale = 2;
    // sprite.position.x += wiggleScale * (Math.random() -.05);
    // sprite.position.y += wiggleScale * (Math.random() -.5);
    //sprite.position.z += wiggleScale * (Math.random() - 5);

    // pulse away/towards center
    // individual rates of movement
    var a = particleAttributes.randomness[c] + 1;
    var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
    // sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
    // sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
    // sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;
}

// rotate the entire group
//  particleGroup.rotation.x = time * 0.5;
particleGroup.rotation.y = time * 0.75;
//   particleGroup.rotation.z = time * 1.0;
*/