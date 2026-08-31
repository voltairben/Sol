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
      body: "Sol started young, the first time he got behind DJ gear. The years after that went into digging for records, drilling his mixing, and putting a proper rig together. His first booking came eight years ago in the south of the Netherlands, and he still loves playing to a room as much as he did then.",
    },
    {
      code: "02_THE_STREAM_LINKUP",
      status: "LIVE",
      tone: "cyan",
      body: "In 2024, TMOCS got him into livestreaming and into mixing vinyl on camera. Both clicked right away. He started his own stream that year and found a fast, warm crowd on the other end. People who turn up every week for the deep rollers and the heavy bass.",
    },
    {
      code: "03_PE_CLASSROOM_VIBES",
      status: "OPTIMAL",
      tone: "green",
      body: "Away from the decks, Sol teaches PE at a primary school. That feeds into how he runs the stream. He reckons a kid gets past any hurdle once they lock in, and that a room works best on respect, encouragement, and everyone improving a bit. The SOL_DNB chat runs the same way.",
    },
    {
      code: "04_FREQUENCY_RANGE",
      status: "LOCKED",
      tone: "dim",
      body: "Liquid, dancefloor, neurofunk, jungle. He plays across the whole spectrum and mixes warm vinyl with hi-res digital in a single set.",
    },
  ],
};

export const BIO_NL: Bio = {
  blocks: [
    {
      code: "01_THE_JOURNEY",
      status: "STABLE",
      tone: "persimmon",
      body: "Sol begon jong, de eerste keer dat hij achter dj-apparatuur stond. De jaren daarna gingen op aan platen zoeken, mixen oefenen en stukje bij beetje een goede set-up bouwen. Zijn eerste boeking kwam acht jaar geleden in het zuiden van Nederland, en voor een zaal spelen voelt nog net zo goed als toen.",
    },
    {
      code: "02_THE_STREAM_LINKUP",
      status: "LIVE",
      tone: "cyan",
      body: "In 2024 haalde TMOCS hem binnen bij het livestreamen en bij vinyl draaien voor de camera. Allebei klikte meteen. Datzelfde jaar begon hij zijn eigen stream en vond aan de andere kant een snelle, warme groep. Mensen die er elke week bij zijn voor de diepe rollers en de zware bass.",
    },
    {
      code: "03_PE_CLASSROOM_VIBES",
      status: "OPTIMAL",
      tone: "green",
      body: "Naast het draaien geeft Sol gymles op een basisschool. Dat werkt door in hoe hij de stream runt. Hij gelooft dat een kind elke hindernis neemt zodra het zich vastbijt, en dat een ruimte het beste draait op respect, aanmoediging en iedereen die een beetje beter wordt. De SOL_DNB-chat werkt net zo.",
    },
    {
      code: "04_FREQUENCY_RANGE",
      status: "LOCKED",
      tone: "dim",
      body: "Liquid, dancefloor, neurofunk, jungle. Hij speelt door het hele spectrum en mixt warm vinyl met high-res digitaal binnen één set.",
    },
  ],
};
