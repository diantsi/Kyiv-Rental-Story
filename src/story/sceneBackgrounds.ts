import type { StoryNodeId } from "./types";
import scene01 from "../assets/scene_01.jpeg";
import scene01LightsOff from "../assets/scene_01_lights_off.jpeg";
import scene05Arrival from "../assets/scene_05_arrival.jpeg";
import scene02 from "../assets/scene_02.jpeg";
import scene03 from "../assets/scene_03.jpeg";
import laptopScreen from "../assets/scene_03_laptop.jpeg";
import scene04 from "../assets/scene_04.jpeg";
import scene05 from "../assets/scene_05.jpeg";
import scene06 from "../assets/scene_06.jpeg";
import scene07 from "../assets/scene_07.jpeg";
import scene08 from "../assets/scene_08.jpeg";
import scene09 from "../assets/scene_09.jpeg";
import scene10 from "../assets/scene_10.jpeg";
import scene11 from "../assets/scene_11.jpg";
import scene12 from "../assets/scene_12.jpg";
import scene13 from "../assets/scene_13.jpeg";
import scene14 from "../assets/scene_14.jpeg";
import scene15 from "../assets/scene_15.jpeg";
import scene16 from "../assets/scene_16.jpeg";
import scene17 from "../assets/scene_17.jpeg";
import scene18 from "../assets/scene_18.jpeg";
import scene19 from "../assets/scene_19.jpeg";
import scene20 from "../assets/scene_20.jpeg";
import scene21 from "../assets/scene_21.jpeg";
import scene22 from "../assets/scene_22.jpeg";

/** Background per node: scene_01–13 are scenes in story order, scene_14–22 are F1–F9. */
export const sceneBackgrounds: Record<StoryNodeId, string> = {
  "01": scene01,
  "02": scene02,
  "03": scene03,
  "04L": scene04,
  "05L": scene05,
  "06I": scene06,
  "07I": scene07,
  "08O": scene08,
  "09O": scene09,
  "10S": scene10,
  "11N": scene11,
  "12N": scene12,
  "13N": scene13,
  F1: scene14,
  F2: scene15,
  F3: scene16,
  F4: scene17,
  F5: scene18,
  F6: scene19,
  F7: scene20,
  F8: scene21,
  F9: scene22,
};

/** Scene 01 corridor without the emergency lamp, used by the lamp-flicker effect. */
export const lampOffBackground = scene01LightsOff;

/** Close-up of the laptop with the listing, shown briefly when scene 03 starts. */
export const laptopIntroBackground = laptopScreen;

/** Alternative backgrounds a beat or a context sheet can switch to. */
export const beatBackdrops = {
  arrival: scene05Arrival,
} as const;
