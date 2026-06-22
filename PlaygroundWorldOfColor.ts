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


// export const worldOfColor = {
//     spawnArtStudio,
// }

//Color Scheme
const groundColor = new Color(0, 0.349, 0.337);
const patioColor = new Color(0.620, 0.792, 0.475);
const waterColor = new Color(0.098, 0.698, 0.682);
const rockColor = Color.randomHue(0.25, 0.35);
const skyColor = new Color(0.561, 0.486, 0.522);  //maybe use a randHue as well?

registerStart(start);
async function start() {
    //Paintable ground 
    createPaintablePlane(new Vector3(0, 0.02, 0), new Vector3(60, 60, 60), Quaternion.fromEuler(new Vector3(-Math.PI / 2, 0, 0)), groundColor, 1, 2048); //check scale placement for collider

    Paint.properties.color.set(patioColor);
    Paint.properties.radius.set(50);

    //Painting Studio
    spawnArtStudio(new Vector3(20, 0.25, 20));
}

function createPaintablePlane(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const plane = spawnPrimitive.plane("Front", pos, scale, rot, color, alpha, "Concave", "Static", undefined);

    plane.mesh.texture.set(new Texture(pixels, pixels), false);
    plane.mesh.texture.setMipMaps(false);

    plane.mesh.color.set(color, alpha);

    plane.mesh.texture.isPaintable.set(true);

    return plane;
}

function createPaintableCube(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const cube = spawnPrimitive.cube(pos, scale, rot, color, alpha, true, "Static", undefined);

    cube.mesh.texture.set(new Texture(pixels, pixels), false);
    cube.mesh.texture.setMipMaps(false);

    cube.mesh.color.set(color, alpha);

    cube.mesh.texture.isPaintable.set(true);

    return cube;
}

function createPaintableSphere(pos: Vector3, columns: number, diameter: number, color: Color, alpha: number, pixels: number): Entity {
    const sphere = spawnPrimitive.sphere(columns, 16, pos, diameter, Quaternion.one, color, alpha, 'Concave', 'Static', undefined);

    sphere.mesh.texture.set(new Texture(pixels, pixels), false);
    sphere.mesh.texture.setMipMaps(false);

    sphere.mesh.color.set(color, alpha);

    sphere.mesh.texture.isPaintable.set(true);

    return sphere;
}

function createPaintableCone(pos: Vector3, columns: number, diameter: number, rot: Quaternion, color: Color, alpha: number, pixels: number): Entity {
    const cone = spawnPrimitive.cone(columns, pos, diameter, rot, color, alpha, 'Convex', 'Static', undefined);  //no "Concave" option-- check for issues with paintability

    cone.mesh.texture.set(new Texture(pixels, pixels), false);
    cone.mesh.texture.setMipMaps(false);

    cone.mesh.color.set(color, alpha);

    cone.mesh.texture.isPaintable.set(true);

    return cone;
}

function spawnArtStudio(pos: Vector3) {
    const patio = createPaintableCube(pos, new Vector3(10, 0.4, 10), Quaternion.fromEuler(new Vector3(0, -Math.PI / 2, 0)), patioColor, 1, 2048);

    const poleScale = new Vector3(0.25, 6, 0.25);
    const roofThickness = 0.35;
    const roofScale = new Vector3(patio.scale.x * 1.2, roofThickness, patio.scale.z * 1.2);
    const roofHeight = poleScale.y + (roofThickness / 2);

    spawnPrimitive.cube(pos.add(new Vector3(-5, poleScale.y / 2, 5)), poleScale, Quaternion.one, rockColor, 1, true, "Static", patio); //back left
    spawnPrimitive.cube(pos.add(new Vector3(5, poleScale.y / 2, 5)), poleScale, Quaternion.one, rockColor, 1, true, "Static", patio); //back right
    spawnPrimitive.cube(pos.add(new Vector3(-5, poleScale.y / 2, -5)), poleScale, Quaternion.one, rockColor, 1, true, "Static", patio); //front left
    spawnPrimitive.cube(pos.add(new Vector3(5, poleScale.y / 2, -5)), poleScale, Quaternion.one, rockColor, 1, true, "Static", patio); //front right

    spawnPrimitive.cube(pos.add(new Vector3(0, roofHeight, 0)), roofScale, Quaternion.one, rockColor, 1, true, "Static", patio); //roof

    playgroundDemos.canvas(pos.add(new Vector3(-2, 0.75, 3)), Quaternion.one, Vector3.one);
    playgroundDemos.canvas(pos.add(new Vector3(4, 0.75, 3.25)), Quaternion.one, new Vector3(1.25, 1.25, 1.25));

    playgroundDemos.colorPicker(pos.add(new Vector3(5, 1.5, 0)), Quaternion.fromEuler(new Vector3(0, -Math.PI / 2, 0)), new Vector3(3, 2, 3));
    //Spawn buttons
}



//Paintable sculpture

//New Brush shapes?

//Waterfall

//Obby Rocks

//Ball bowling

//Rainbow Stairs

//Reactive ground plane -- paintable with foot pos spray brush, then reverts back to prev color after delay, secret message (ie. pixels that dont change when drawn on = code?)

//Color Picker... Moves with you? Appear/ Disappear with B Button?

//Skydome Change

//Teleport, Sky Obby