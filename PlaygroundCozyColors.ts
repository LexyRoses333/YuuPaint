import { registerStart } from "./Yuu API/RegisterStart";
import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { createUIElement } from "./Yuu API/CreateUIElement";
import { Entity } from "./Yuu API/Entity";
import { BrushTypes, Paint } from "./Yuu API/Paint";
import { BrushShapes, paintShapes } from "./Yuu API/PaintShapes";
import { Player } from "./Yuu API/Player";
import { playgroundDemos } from "./PlaygroundLaex";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture } from "./Yuu API/Texture";
import { lexy } from "./PlaygroundLexy";
import { overTime } from "./Yuu API/MotionOverTime";
import { SkyDome } from "./Yuu API/SkyDome";


// export const worldOfColor = {
//     spawnArtStudio,
// }

//Color Scheme
const groundColor = new Color(0.016, 0.58, 0.561);  //darker, less sat
const patioColor = new Color(0.420, 0.792, 0.575);
const waterColor = new Color(0.098, 0.698, 0.682);
const rockColor = Color.randomHue(0.75, 0.45);
const skyColor = new Color(0.773, 0.506, 0.941);  //maybe use a randHue as well?
const horizonColor = new Color(0.929, 0.345, 0.008);

registerStart(start);
async function start() {
    updateSkydome();

    //Paintable ground 
    createPaintablePlane(new Vector3(0, 0.02, 0), new Vector3(60, 60, 60), Quaternion.fromEuler(new Vector3(-Math.PI / 2, 0, 0)), groundColor, 1, 2048); //check scale placement for collider

    Paint.properties.color.set(Color.randomHue(0.75, 0.8));
    Paint.properties.radius.set(30);
    Paint.properties.brushShape.set('Round');

    //Painting Studio
    spawnArtStudio(new Vector3(20, 0.25, -20));

    //Sculpture
    spawnInteractiveSculpture(new Vector3(15, 0, 15));

    //CubeTest
    spawnMovingCube(new Vector3(5, 1, -5));

    //Paintable rotating sphere
    spawnSpinningGlobe(new Vector3(0, 0.75, 6));
}

function updateSkydome() {
    SkyDome.ambientLight.baseColor.set(horizonColor);
    SkyDome.ambientLight.skyColorContribution.set(0.2);

    SkyDome.skyMaterial.setProceduralSkyMaterial(skyColor, new Color(0.969, 0.69, 0.039), 0.75, horizonColor, skyColor, 0.25);
}

function spawnSpinningGlobe(pos: Vector3) {
    // spawnPrimitive.cube(pos, new Vector3(1.5, 1, 1.5), Quaternion.one, rockColor, 0.6, true, 'Static', undefined);
     createPaintableCone(pos, 8, 5, Quaternion.fromEuler(new Vector3(Math.PI, 0, 0)), groundColor, 0.3, 1048);

    const spinningSphere = createPaintableSphere(pos.add(new Vector3(0, 3, 0)), 16, 4, waterColor, 1, 2048);
    spinningSphere.rot = Quaternion.fromEuler(new Vector3(0, 0, Math.PI / 2));

    rotateSphere(spinningSphere, 8_000);

    Async.setInterval(() => {
        rotateSphere(spinningSphere, 8_000);
    }, 8_000);
}

function rotateSphere(entity: Entity, durMs: number) {
    const currentRot = entity.rot;
    const next = currentRot.multiply(Quaternion.fromEuler(new Vector3(0, Math.PI, 0)));

    overTime.rotateTo.start(entity, next, durMs);
};


function spawnArtStudio(pos: Vector3) {
    const patio = createPaintableCube(pos, new Vector3(10, 0.4, 10), Quaternion.one, patioColor, 1, 2048);

    const poleScaleTall = new Vector3(0.25, 7, 0.25);
    const poleScaleShort = new Vector3(0.25, 4, 0.25);
    const roofThickness = 0.35;
    const roofScale = new Vector3(patio.scale.x * 1.2, roofThickness, patio.scale.z * 1.2);
    const roofHeight = ((poleScaleTall.y + poleScaleShort.y) / 2) + (roofThickness / 2);

    spawnPrimitive.cube(new Vector3(-4.5, 2.5, 4.5), poleScaleShort, Quaternion.one, rockColor, 1, true, "Static", patio); //short left
    spawnPrimitive.cube(new Vector3(4.5, 2.5, 4.5), poleScaleShort, Quaternion.one, rockColor, 1, true, "Static", patio); //short right
    spawnPrimitive.cube(new Vector3(-4.5, poleScaleTall.y / 2, -4.5), poleScaleTall, Quaternion.one, rockColor, 1, true, "Static", patio); //tall left
    spawnPrimitive.cube(new Vector3(4.5, poleScaleTall.y / 2, -4.5), poleScaleTall, Quaternion.one, rockColor, 1, true, "Static", patio); //tall right

    spawnPrimitive.cube(new Vector3(0, roofHeight, 0), roofScale, Quaternion.fromEuler(new Vector3(Math.PI / 12, 0, 0)), Color.randomHue(0.75, 0.25), 1, true, "Static", patio); //roof

    playgroundDemos.canvas(pos.add(new Vector3(-2, 0.95, -3)), Quaternion.one, Vector3.one);
    playgroundDemos.canvas(pos.add(new Vector3(2, 0.95, -3)), Quaternion.one, Vector3.one);

    createPaintableCone(pos.add(new Vector3(2, 0.2, 3)), 8, 5, Quaternion.one, groundColor, 1, 1048); //Not paintable yet

    playgroundDemos.colorPicker(pos.add(new Vector3(5, 1.5, 0)), Quaternion.fromEuler(new Vector3(0, -Math.PI / 2, 0)), new Vector3(3, 2, 3));

    lexy.spawnDrawSettingButtons(pos.add(new Vector3(0, 1.5, -3.25)));
}

function spawnInteractiveSculpture(pos: Vector3) {
    const maxRadius = 6;
    const maxHeight = 15;
    const centerpieceScale = new Vector3(2.5, 15, 2.5);
    const centerpieceOffset = new Vector3(0, (centerpieceScale.y / 2), 0);

    spawnPrimitive.cube(pos.add(centerpieceOffset), centerpieceScale, Quaternion.one, Color.randomHue(0.9, 0.75), 1, true, 'Static', undefined);
    spawnPrimitive.cube(pos.add(new Vector3(0, 5, 2)), new Vector3(1.5, 10, 1.5), Quaternion.one, Color.randomHue(0.9, 0.75), 1, true, 'Static', undefined);
    spawnPrimitive.cube(pos.add(new Vector3(-2, 3, 0)), new Vector3(1.5, 6, 1.5), Quaternion.one, Color.randomHue(0.9, 0.75), 1, true, 'Static', undefined);
    spawnPrimitive.cube(pos.add(new Vector3(2, 4, 0)), new Vector3(1.5, 8, 1.5), Quaternion.one, Color.randomHue(0.9, 0.75), 1, true, 'Static', undefined);
    spawnPrimitive.cube(pos.add(new Vector3(0, 2, -2)), new Vector3(1.5, 4, 1.5), Quaternion.one, Color.randomHue(0.9, 0.75), 1, true, 'Static', undefined);

    for (let i = 0; i < 20; i++) {
        const x = (Math.random() * 2 - 1) * maxRadius;
        const y = (Math.random() * maxHeight) + 0.25;
        const z = (Math.random() * 2 - 1) * maxRadius;
        const startPos = pos.add(new Vector3(x, y, z));

        const randRot = Quaternion.fromEuler(new Vector3((Math.random() * Math.PI), (Math.random() * Math.PI), (Math.random() * Math.PI)));

        const cube = spawnPrimitive.cube(startPos, new Vector3(1.5, ((Math.random() * 3) + 1), 1), randRot, Color.randomHue(), 0.5, true, "Static", undefined);

        let asyncID = 0;

        cube.rayClick.initialize(false);
        cube.rayClick.setClickFunction(() => {
            Async.clearTimer(asyncID);

            overTime.moveTo.cancel(cube);
            overTime.rotateTo.cancel(cube);

            cube.mesh.color.set(Color.randomHue(), 0.5);

            const playerPos = Player.position.get() ?? pos;
            const dir = playerPos.subtract(startPos).normalize();
            const newPos = playerPos.subtract(dir.multiply(1.5));


            overTime.moveTo.start(cube, newPos, 5_000);
            Async.wait(20);
            overTime.rotateTo.start(cube, Quaternion.one, 5_000);

            asyncID = Async.setTimeout(() => {
                overTime.moveTo.start(cube, startPos, 5_000);
                Async.wait(20);
                overTime.rotateTo.start(cube, randRot, 5_000);
            }, 8_000);
        });
    }
}

function spawnMovingCube(pos: Vector3) {
    //Turn this into a hide and seek game... use cool magic shader, randomly moves in world and shrinks until it moves again-- find it and catch it to trigger something cool
    const cube = spawnPrimitive.cube(pos, Vector3.one, Quaternion.one, Color.randomHue(), 1, true, "Static", undefined);

    Async.setTimeout(() => {
        cube.pos = pos.add(new Vector3(0, 10, 0));
        cube.rot = Quaternion.fromEuler(new Vector3(0, Math.random() * Math.PI, 0));
    }, 5_000);

    Async.setTimeout(() => {
        overTime.rotateTo.start(cube, Quaternion.fromEuler(new Vector3(0, Math.random() * Math.PI, 0)), 5_500);
        overTime.moveTo.start(cube, pos, 5_500);
    }, 8_000);
}

function createPaintablePlane(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const plane = spawnPrimitive.plane("Front", pos, scale, rot, color, alpha, "Concave", "Static", undefined);
    const texture = new Texture(pixels, pixels);

    plane.mesh.texture.set(texture, false);
    plane.mesh.texture.setMipMaps(false);
    plane.mesh.texture.isPaintable.set(true);

    texture.fillWithColor(color, alpha);
    texture.updateTexture();

    return plane;
}

function createPaintableCube(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const cube = spawnPrimitive.cube(pos, scale, rot, color, alpha, true, "Static", undefined);
    const texture = new Texture(pixels, pixels);

    cube.mesh.texture.set(texture, false);
    cube.mesh.texture.setMipMaps(false);
    cube.mesh.texture.isPaintable.set(true);  //doesnt have Concave ability for box collider?? Not yet paintable in world

    texture.fillWithColor(color, alpha);
    texture.updateTexture();

    return cube;
}

function createPaintableSphere(pos: Vector3, columns: number, diameter: number, color: Color, alpha: number, pixels: number): Entity {
    const sphere = spawnPrimitive.sphere(columns, 16, pos, diameter, Quaternion.one, color, alpha, 'Concave', 'Static', undefined);
    const texture = new Texture(pixels, pixels);

    sphere.mesh.texture.set(texture, false);
    sphere.mesh.texture.setMipMaps(false);
    sphere.mesh.texture.isPaintable.set(true);

    texture.fillWithColor(color, alpha);
    texture.updateTexture();

    return sphere;
}

function createPaintableCone(pos: Vector3, columns: number, diameter: number, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const cone = spawnPrimitive.cone(columns, pos, diameter, rot, color, alpha, 'Convex', 'Static', undefined);  //no "Concave" option-- check for issues with paintability
    const texture = new Texture(pixels, pixels);

    cone.mesh.texture.set(texture, false);
    cone.mesh.texture.setMipMaps(false);
    cone.mesh.texture.isPaintable.set(true);

    texture.fillWithColor(color, alpha);
    texture.updateTexture();

    return cone;
}





//New Brush shapes?

//Mountain background

//Waterfall

//Obby Rocks

//Ball bowling

//Rainbow Stairs

//Secret message using text same color as ground plane (code?)

//Color Picker... Moves with you? Appear/ Disappear with B Button?

//Skydome Change

//Teleport, Sky Obby