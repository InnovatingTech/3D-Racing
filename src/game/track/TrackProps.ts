import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import type { Scene } from "@babylonjs/core/scene";
import type { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import type { Track } from "./Track";

export class TrackProps {
  constructor(
    private scene: Scene,
    private track: Track,
    private shadowGen?: ShadowGenerator
  ) {}

  // Create a plain colour banner panel at a position along the track
  addBanner(trackProgress: number, side: 'left' | 'right', panelColor: Color3, height: number = 6, width: number = 10) {
    const totalLen = this.track.totalLength;
    const targetDist = trackProgress * totalLen;

    let accum = 0;
    let pos = this.track.centerline[0].clone();
    let dir = new Vector3(0, 0, 1);

    for (let i = 0; i < this.track.centerline.length - 1; i++) {
      const a = this.track.centerline[i];
      const b = this.track.centerline[i + 1];
      const segLen = Vector3.Distance(a, b);

      if (accum + segLen >= targetDist) {
        const t = (targetDist - accum) / segLen;
        pos = Vector3.Lerp(a, b, t);
        dir = b.subtract(a).normalize();
        break;
      }
      accum += segLen;
    }

    // Offset to side of track - closer to track for visibility
    const perpendicular = new Vector3(-dir.z, 0, dir.x);
    const offset = side === 'left' ? -1 : 1;
    const bannerPos = pos.add(perpendicular.scale(offset * (this.track.halfWidth + 3)));

    // Face towards track centre - calculate rotation first for pole positioning
    const rotation = Math.atan2(dir.x, dir.z);
    const faceRotation = rotation + (side === 'left' ? -Math.PI / 2 : Math.PI / 2);

    // Create sturdy banner poles - positioned along the banner's local axis
    const poleMat = new PBRMaterial("poleMat", this.scene);
    poleMat.albedoColor = new Color3(0.25, 0.25, 0.3);
    poleMat.metallic = 0.9;
    poleMat.roughness = 0.3;

    const poleHeight = height + 2;
    const poleRadius = 0.12;
    const poleOffset = width / 2 + 0.15;

    // Calculate pole offset vectors using the banner's rotation
    const poleOffsetX = Math.cos(faceRotation) * poleOffset;
    const poleOffsetZ = -Math.sin(faceRotation) * poleOffset;

    const leftPole = CreateCylinder("bannerPoleL", { height: poleHeight, diameter: poleRadius * 2 }, this.scene);
    leftPole.position = bannerPos.clone();
    leftPole.position.x -= poleOffsetX;
    leftPole.position.z -= poleOffsetZ;
    leftPole.position.y = poleHeight / 2;
    leftPole.material = poleMat;
    if (this.shadowGen) this.shadowGen.addShadowCaster(leftPole);

    const rightPole = CreateCylinder("bannerPoleR", { height: poleHeight, diameter: poleRadius * 2 }, this.scene);
    rightPole.position = bannerPos.clone();
    rightPole.position.x += poleOffsetX;
    rightPole.position.z += poleOffsetZ;
    rightPole.position.y = poleHeight / 2;
    rightPole.material = poleMat;
    if (this.shadowGen) this.shadowGen.addShadowCaster(rightPole);

    // Banner dimensions and positioning
    const panelHeight = height * 0.85;
    const panelWidth = width * 1.08;
    const bannerY = poleHeight - height * 0.4;

    // Plain colour panel material, lit from both sides
    const panelMat = new PBRMaterial("bannerPanelMat", this.scene);
    panelMat.albedoColor = panelColor;
    panelMat.roughness = 0.4;
    panelMat.metallic = 0.0;
    panelMat.emissiveColor = panelColor.scale(0.35);
    panelMat.backFaceCulling = false;
    panelMat.twoSidedLighting = true;

    // Use a thin box for the panel (no z-fighting) - shows on both sides
    const panel = CreateBox("bannerPanel", {
      width: panelWidth,
      height: panelHeight,
      depth: 0.05
    }, this.scene);
    panel.position = bannerPos.clone();
    panel.position.y = bannerY;
    panel.rotation.y = faceRotation;
    panel.material = panelMat;

    // Add a coloured border/frame around the banner
    const frameMat = new PBRMaterial("frameMat", this.scene);
    frameMat.albedoColor = new Color3(0.1, 0.4, 0.7); // deep blue frame
    frameMat.roughness = 0.3;
    frameMat.metallic = 0.2;
    frameMat.emissiveColor = new Color3(0.05, 0.15, 0.3);

    // Top frame bar - spans across both sides
    const topBar = CreateBox("topBar", { width: panelWidth + 0.3, height: 0.2, depth: 0.2 }, this.scene);
    topBar.position = bannerPos.clone();
    topBar.position.y = bannerY + panelHeight / 2 + 0.1;
    topBar.rotation.y = faceRotation;
    topBar.material = frameMat;
    if (this.shadowGen) this.shadowGen.addShadowCaster(topBar);

    // Bottom frame bar
    const bottomBar = CreateBox("bottomBar", { width: panelWidth + 0.3, height: 0.2, depth: 0.2 }, this.scene);
    bottomBar.position = bannerPos.clone();
    bottomBar.position.y = bannerY - panelHeight / 2 - 0.1;
    bottomBar.rotation.y = faceRotation;
    bottomBar.material = frameMat;
    if (this.shadowGen) this.shadowGen.addShadowCaster(bottomBar);
  }
}
