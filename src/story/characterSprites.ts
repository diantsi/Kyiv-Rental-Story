import andrii1 from "../assets/andrii_1.png";
import andrii2 from "../assets/andrii_2.png";
import andrii3 from "../assets/andrii_3.png";
import andrii4 from "../assets/andrii_4.png";
import andrii5 from "../assets/andrii_5.png";
import oksana1 from "../assets/oksana_1.png";
import oksana2 from "../assets/oksana_2.png";
import oksana3 from "../assets/oksana_3.png";
import oksana4 from "../assets/oksana_4.png";
import ignat1 from "../assets/ignat_1.png";
import ignat2 from "../assets/ignat_2.png";
import ignat3 from "../assets/ignat_3.png";
import ignat4 from "../assets/ignat_4.png";
import larysa1 from "../assets/larysa_1.png";
import larysa2 from "../assets/larysa_2.png";
import larysa3 from "../assets/larysa_3.png";
import larysa4 from "../assets/larysa_4.png";
import larysa5 from "../assets/larysa_5.png";
import maks1 from "../assets/maks_1.png";
import maks2 from "../assets/maks_2.png";
import maks3 from "../assets/maks_3.png";
import maks4 from "../assets/maks_4.png";
import maks5 from "../assets/maks_5.png";
import maks6 from "../assets/maks_6.png";
import komendantkaAngry from "../assets/komendantka_angry.png";
import komendantkaNeutral from "../assets/komendantka_neutral.png";
import marta1 from "../assets/marta_1.png";
import marta2 from "../assets/marta_2.png";
import marta3 from "../assets/marta_3.png";
import marta4 from "../assets/marta_4.png";
import marta5 from "../assets/marta_5.png";
import marta6 from "../assets/marta_6.png";
import olia1 from "../assets/olia_1.png";
import olia2 from "../assets/olia_2.png";
import olia3 from "../assets/olia_3.png";
import olia4 from "../assets/olia_4.png";
import olia5 from "../assets/olia_5.png";
import olia6 from "../assets/olia_6.png";
import type { DialogueBeat, SpriteMood } from "./types";

export type SpriteSide = "left" | "right";

type Sprite = { neutral: string } & Partial<Record<SpriteMood, string>>;

/** Sprites by speaker name (the canonical Ukrainian label from Script.md). */
const sides: Record<string, SpriteSide> = { Оля: "left", Марта: "left" };

const sprites: Record<string, Sprite> = {
  Комендантка: { neutral: komendantkaNeutral, angry: komendantkaAngry },
  Андрій: {
    neutral: andrii1,
    thinking: andrii2,
    angry: andrii3,
    happy: andrii4,
    annoyed: andrii5,
  },
  Оксана: {
    neutral: oksana1,
    thinking: oksana2,
    angry: oksana3,
    shocked: oksana4,
  },
  Ігнат: {
    neutral: ignat4,
    showing: ignat1,
    confused: ignat2,
    thinking: ignat3,
  },
  Лариса: {
    neutral: larysa2,
    showing: larysa1,
    thinking: larysa3,
    sheepish: larysa4,
    angry: larysa5,
  },
  Макс: {
    neutral: maks1,
    happy: maks2,
    thinking: maks3,
    sheepish: maks4,
    angry: maks5,
    shocked: maks6,
  },
  Марта: {
    neutral: marta1,
    happy: marta2,
    thinking: marta3,
    sad: marta4,
    angry: marta5,
    confused: marta6,
  },
  Оля: {
    neutral: olia1,
    happy: olia2,
    thinking: olia3,
    annoyed: olia4,
    skeptical: olia5,
    shocked: olia6,
  },
};

export function getBeatSprite(
  beat: DialogueBeat | undefined,
): { src: string; side: SpriteSide } | undefined {
  if (!beat) return undefined;
  const sprite = sprites[beat.speaker];
  if (!sprite) return undefined;
  return {
    src: (beat.mood && sprite[beat.mood]) || sprite.neutral,
    side: sides[beat.speaker] ?? "right",
  };
}
