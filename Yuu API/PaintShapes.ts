// import { Color } from "./Basic Types/Color";
// import { Vector2 } from "./Basic Types/Vector2";
// import { Texture } from "./Texture";


// export const paintShapes = {
//   getShapeFunc,
// }


// export type BrushShapes = 'Round' | 'Square' | 'Star' | 'Flower' | 'Triangle' | 'Heart' | 'Line';

// type ShapeFuncProperties = { brushTexture: Texture, brushStartPixel: Vector2, radius: number, cropRadius: number, color: Color, alpha: number };


// function getShapeFunc(brushShape: BrushShapes): (shapeFuncProperties: ShapeFuncProperties) => void {
//   if (brushShape === 'Square') {
//     return fillRect;
//   }
//   else if (brushShape === 'Round') {
//     return fillRound;
//   }
//   else {
//     // Replace with else if tree for all options
//     return fillRect;
//   }
// }

// function fillRect(shapeFuncProperties: ShapeFuncProperties) {
//   const diameter = shapeFuncProperties.radius * 2;
//   shapeFuncProperties.brushTexture.fillRectWithColor(shapeFuncProperties.brushStartPixel, new Vector2(diameter, diameter), shapeFuncProperties.color, shapeFuncProperties.alpha);
// }

// function fillRound(shapeFuncProperties: ShapeFuncProperties) {
//   const pixels: Vector2[] = [];
//   const radiusSquared = shapeFuncProperties.radius * shapeFuncProperties.radius;

//   const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));

//   for (let x = -shapeFuncProperties.radius; x < shapeFuncProperties.radius; x++) {
//     for (let y = -shapeFuncProperties.radius; y < shapeFuncProperties.radius; y++) {
//       const cSquared = (x * x) + (y * y);
//       // Hey LEXY this "cropRadius" can be used to make a cylinder / hollow circle brush!! :D
//       if (cSquared < radiusSquared && cSquared >= shapeFuncProperties.cropRadius) {
//         pixels.push(centerPixel.add(new Vector2(x, y)));
//       }
//     }
//   }

//   shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
// }


//--------------------------------------------------------------------------

import { Color } from "./Basic Types/Color";
import { Vector2 } from "./Basic Types/Vector2";
import { Texture } from "./Texture";


export const paintShapes = {
  getShapeFunc,
}


export type BrushShapes = 'Round' | 'Square' | 'Star' | 'Flower' | 'Triangle' | 'Heart' | 'Line';

export type LineOrientation = 'Horizontal' | 'Vertical' | 'Slash';

type ShapeFuncProperties = { brushTexture: Texture, brushStartPixel: Vector2, radius: number, cropRadius: number, color: Color, alpha: number, numberOfPoints: number | undefined, lineOrientation: LineOrientation | undefined, lineThickness: number | undefined };


function getShapeFunc(brushShape: BrushShapes): (shapeFuncProperties: ShapeFuncProperties) => void {
  if (brushShape === 'Round') {
    return fillRound;
  }
  else if (brushShape === 'Square') {
    return fillRect;
  }
  else if (brushShape === 'Star') {
    return (payload) => fillStar(payload, true);
  }
  else if (brushShape === 'Flower') {
    return (payload) => fillStar(payload, false);
  }
  else if (brushShape === 'Triangle') {
    return fillTriangle;
  }
  else if (brushShape === 'Heart') {
    return fillHeart;
  }
  else if (brushShape === 'Line') {
    return fillLine;
  }
  else {
    return fillRect;
  }
}

function fillRound(shapeFuncProperties: ShapeFuncProperties) {
  const pixels: Vector2[] = [];
  const radiusSquared = shapeFuncProperties.radius * shapeFuncProperties.radius;

  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));

  for (let x = -shapeFuncProperties.radius; x < shapeFuncProperties.radius; x++) {
    for (let y = -shapeFuncProperties.radius; y < shapeFuncProperties.radius; y++) {
      const cSquared = (x * x) + (y * y);
      // Hey LEXY this "cropRadius" can be used to make a cylinder / hollow circle brush!! :D   --WOOHOO!! CANT WAIT TO SEE!
      if (cSquared < radiusSquared && cSquared >= shapeFuncProperties.cropRadius) {
        pixels.push(centerPixel.add(new Vector2(x, y)));
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}

function fillRect(shapeFuncProperties: ShapeFuncProperties) {
  const diameter = shapeFuncProperties.radius * 2;
  shapeFuncProperties.brushTexture.fillRectWithColor(shapeFuncProperties.brushStartPixel, new Vector2(diameter, diameter), shapeFuncProperties.color, shapeFuncProperties.alpha);
}

function fillStar(shapeFuncProperties: ShapeFuncProperties, isStar: boolean) {
  const pixels: Vector2[] = [];
  const numPoints = isStar ? 5 : (shapeFuncProperties.numberOfPoints ?? 6);
  const outerRadius = shapeFuncProperties.radius;
  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(outerRadius, outerRadius));

  if (isStar) {
    const innerRadius = outerRadius * 0.4; // Controls how far the notches cut in
    const PI2 = Math.PI * 2;

    const vertsX: number[] = [];
    const vertsY: number[] = [];

    for (let i = 0; i < numPoints; i++) {
      const outerAngle = -Math.PI / 2 + (PI2 / numPoints) * i;
      const innerAngle = outerAngle + Math.PI / numPoints;
      vertsX.push(Math.cos(outerAngle) * outerRadius); vertsY.push(Math.sin(outerAngle) * outerRadius);
      vertsX.push(Math.cos(innerAngle) * innerRadius); vertsY.push(Math.sin(innerAngle) * innerRadius);
    }

    for (let x = -outerRadius; x <= outerRadius; x++) {
      for (let y = -outerRadius; y <= outerRadius; y++) {
        if (((x * x) + (y * y)) > outerRadius * outerRadius) {
          let isInside = false;

          for (let i = 0; i < 10 && !isInside; i++) {
            const next = (i + 1) % 10;
            isInside = isInsideTriangle(0, 0, vertsX[i], vertsY[i], vertsX[next], vertsY[next], x, y);
          }

          if (isInside) {
            pixels.push(centerPixel.add(new Vector2(x, y)));
          }
        }
      }
    }
  }
  else {
    const innerRadius = outerRadius * 0.45;
    const outerRadiusSq = outerRadius * outerRadius;
    const segmentAngle = (Math.PI * 2) / numPoints;

    for (let x = -outerRadius; x <= outerRadius; x++) {
      for (let y = -outerRadius; y <= outerRadius; y++) {
        const distSq = (x * x) + (y * y);

        if (distSq > outerRadiusSq) {
          if (distSq === 0) {
            pixels.push(centerPixel);
          }

          // Offset by -PI/2 so the first petal points straight up.
          const angle = Math.atan2(y, x) - Math.PI / 2;
          const angleInSegment = ((angle % segmentAngle) + segmentAngle) % segmentAngle;
          const offset = angleInSegment / segmentAngle; // 0→1 across one petal sector

          // Cosine wave: smooth ease from innerRadius at sector edges to outerRadius at center.
          const cosWave = 0.5 - 0.5 * Math.cos(offset * Math.PI * 2);
          const boundaryRadius = innerRadius + (outerRadius - innerRadius) * cosWave;

          if (distSq <= boundaryRadius * boundaryRadius) {
            pixels.push(centerPixel.add(new Vector2(x, y)));
          }
        }
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}


function fillTriangle(shapeFuncProperties: ShapeFuncProperties) {
  const pixels: Vector2[] = [];

  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));

  const apexVertX = 0, apexVertY = -shapeFuncProperties.radius;
  const bottomLeftX = -shapeFuncProperties.radius, bottomLeftY = shapeFuncProperties.radius;
  const bottomRightX = shapeFuncProperties.radius, bottomRightY = shapeFuncProperties.radius;

  for (let x = -shapeFuncProperties.radius; x <= shapeFuncProperties.radius; x++) {
    for (let y = -shapeFuncProperties.radius; y <= shapeFuncProperties.radius; y++) {
      if (isInsideTriangle(apexVertX, apexVertY, bottomLeftX, bottomLeftY, bottomRightX, bottomRightY, x, y)) {
        pixels.push(centerPixel.add(new Vector2(x, y)));
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}


//Alt version, seemingly more optimized. 
// function fillTriangle(shapeFuncProperties: ShapeFuncProperties) {
//   const pixels: Vector2[] = [];

//   const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));
//   const diameter = shapeFuncProperties.radius * 2;

//   for (let y = -shapeFuncProperties.radius; y <= shapeFuncProperties.radius; y++) {
//     const halfWidth = ((y + shapeFuncProperties.radius) * shapeFuncProperties.radius / diameter) | 0;

//     for (let x = -halfWidth; x <= halfWidth; x++) {
//       pixels.push(centerPixel.add(new Vector2(x, y)));
//     }
//   }

//   shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
// }

function fillHeart(shapeFuncProperties: ShapeFuncProperties) {
  const pixels: Vector2[] = [];

  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));
  const verticalOffset = shapeFuncProperties.radius * 0.1;

  const scale = shapeFuncProperties.radius * 1.1;

  for (let x = -shapeFuncProperties.radius; x <= shapeFuncProperties.radius; x++) {
    for (let y = -shapeFuncProperties.radius; y <= shapeFuncProperties.radius; y++) {
      const nx = x / scale;
      const ny = (y - verticalOffset) / scale;

      const fx = nx;
      const fy = -ny;

      //(fx²+fy²-1)³ - fx²·fy³
      const fxSq = fx * fx;
      const fySq = fy * fy;
      const base = (fxSq + fySq) - 1;
      const val = (base * base * base) - (fxSq * (fySq * fy));

      if (val <= 0) {
        pixels.push(centerPixel.add(new Vector2(x, y)));
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}

function fillLine(shapeFuncProperties: ShapeFuncProperties) {
  const pixels: Vector2[] = [];

  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));

  const orientation = shapeFuncProperties.lineOrientation ?? 'Slash';
  const halfThickness = (shapeFuncProperties.lineThickness ?? 2) / 2;
  const halfThicknessSq = halfThickness * halfThickness;

  let isValid = false;

  for (let x = -shapeFuncProperties.radius; x <= shapeFuncProperties.radius; x++) {
    for (let y = -shapeFuncProperties.radius; y <= shapeFuncProperties.radius; y++) {
      if (orientation === 'Slash') {
        isValid = (x + y) * (x + y) < halfThicknessSq * 2;
      }
      else if (orientation === 'Horizontal') {
        isValid = (y * y) < halfThicknessSq;
      }
      else if (orientation === 'Vertical') {
        isValid = (x * x) < halfThicknessSq;
      }

      if (isValid) {
        pixels.push(centerPixel.add(new Vector2(x, y)));
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}



//Claude's Helper Funcs:

// Shared half-plane (edge sign) test used by fillBurst (star) and fillTriangle.
// Returns which side of directed edge (a→b) the point p falls on.
// Positive = left of edge, negative = right, zero = on the edge.
function edgeSign(ax: number, ay: number, bx: number, by: number, px: number, py: number): number {
  return (bx - ax) * (py - ay) - (by - ay) * (px - ax);
}

// Tests whether point (px, py) is inside the triangle defined by three vertices.
function isInsideTriangle(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, px: number, py: number): boolean {
  const d1 = edgeSign(ax, ay, bx, by, px, py);
  const d2 = edgeSign(bx, by, cx, cy, px, py);
  const d3 = edgeSign(cx, cy, ax, ay, px, py);

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);
}

