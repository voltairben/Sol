export type BlockTone = "cyan" | "persimmon" | "green" | "dim";

export interface BioBlock {
  /** Log code, e.g. "01_THE_JOURNEY". */
  code: string;
  /** Right-side telemetry status word. */
  status: string;
  tone: BlockTone;
  body: string;
}

export interface Bio {
  blocks: BioBlock[];
}

export const BIO_EN: Bio = {
  blocks: [
    {
      code: "01_THE_JOURNEY",
      status: "STABLE",
      tone: "persimmon",
      body: "It started a long time ago, when Sol first got his hands on DJ equipment. Years of steady focus followed — a record crate built one find at a time, mixing technique sharpened week after week, a proper rig assembled piece by piece. His first booking came eight years ago in the south of the Netherlands, and the pull of playing to a room has never let up.",
    },
    {
      code: "02_THE_STREAM_LINKUP",
      status: "LIVE",
      tone: "cyan",
      body: "In 2024, TMOCS pulled him into two things at once — livestreaming, and the feel of mixing physical vinyl on air. Both landed instantly. Sol started his own stream that year and found a fast, warm, high-energy community on the other side of it: people who show up for the deep rollers and the heavy bass, week in, week out.",
    },
    {
      code: "03_PE_CLASSROOM_VIBES",
      status: "OPTIMAL",
      tone: "green",
      body: "Off the decks, Sol teaches physical education at a primary school. That job feeds straight into how he runs the stream — the belief that a kid clears any hurdle once they lock in, and a room that runs on respect, positivity, and everyone getting a little better. It's the same code the SOL_DNB chat runs on.",
    },
    {
      code: "04_FREQUENCY_RANGE",
      status: "LOCKED",
      tone: "dim",
      body: "Liquid, dancefloor, neurofunk, jungle — the whole spectrum, moving between warm vinyl and high-resolution digital inside a single set.",
    },
  ],
};

export const BIO_NL: Bio = {
  blocks: [
    {
      code: "01_THE_JOURNEY",
      status: "STABLE",
      tone: "persimmon",
      body: "Het begon een hele tijd geleden, toen Sol voor het eerst achter dj-apparatuur stond. Jarenlange gestage focus volgde — een platenbak die plaat voor plaat groeide, mixtechniek die week na week scherper werd, een volwaardige set-up stukje bij beetje opgebouwd. Zijn eerste boeking kwam acht jaar geleden in het zuiden van Nederland, en de trek om voor een zaal te spelen is nooit meer weggegaan.",
    },
    {
      code: "02_THE_STREAM_LINKUP",
      status: "LIVE",
      tone: "cyan",
      body: "In 2024 trok TMOCS hem in één klap twee kanten op — livestreamen, en het gevoel van vinyl draaien voor een camera. Allebei landde meteen. Datzelfde jaar startte Sol zijn eigen stream en vond aan de andere kant een snelle, warme, energieke community: mensen die er week in, week uit zijn voor de diepe rollers en de zware bass.",
    },
    {
      code: "03_PE_CLASSROOM_VIBES",
      status: "OPTIMAL",
      tone: "green",
      body: "Naast het draaien geeft Sol gymles op een basisschool. Die baan voedt direct hoe hij de stream runt — de overtuiging dat een kind elke hindernis neemt als het zich vastbijt, en een ruimte die draait op respect, positiviteit en iedereen die een beetje beter wordt. Dezelfde code waar de SOL_DNB-chat op draait.",
    },
    {
      code: "04_FREQUENCY_RANGE",
      status: "LOCKED",
      tone: "dim",
      body: "Liquid, dancefloor, neurofunk, jungle — het hele spectrum, schakelend tussen warm vinyl en high-res digitaal binnen één set.",
    },
  ],
};
