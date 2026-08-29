export interface BioBlock {
  kicker: string;
  body: string;
}

export interface Bio {
  lead: string;
  blocks: BioBlock[];
}

export const BIO_EN: Bio = {
  lead: "Who is SOL?",
  blocks: [
    {
      kicker: "origin",
      body: "I started experimenting with DJ equipment about ten years ago. What began as curiosity slowly became craft — a name, a record collection, and an ear for the music, built one weekend at a time. My first booking came a couple of years later, and it stuck — I've been playing clubs and events across the south of the Netherlands ever since.",
    },
    {
      kicker: "the stream",
      body: "In 2024 I met TMOCS, who pulled me into two things at once: livestreaming and playing vinyl. Both clicked immediately. I started my own stream that same year and haven't looked back — the energy of a packed room, but one that never closes, with the chat right in the middle of it. It runs alongside the club sets, not instead of them.",
    },
    {
      kicker: "off the decks",
      body: "These days I stream a few times a week. Tuesday is home base — live on Kick and Twitch at 19:00 CET — and weekends are looser, announced on Instagram and in the Discord. Away from the decks I teach physical education at a primary school, where the lesson I care most about is a simple one: you can do anything you set your mind to.",
    },
  ],
};

export const BIO_NL: Bio = {
  lead: "Wie is SOL?",
  blocks: [
    {
      kicker: "oorsprong",
      body: "Zo'n tien jaar geleden begon ik te experimenteren met dj-apparatuur. Wat als nieuwsgierigheid begon, werd langzaam vakmanschap — een naam, een platencollectie en een oor voor de muziek, weekend na weekend opgebouwd. Mijn eerste boeking kwam een paar jaar later, en het bleef hangen — sindsdien speel ik in clubs en op events door heel Zuid-Nederland.",
    },
    {
      kicker: "de stream",
      body: "In 2024 leerde ik TMOCS kennen, die me in één klap twee dingen liet ontdekken: livestreamen en vinyl draaien. Allebei voelde meteen goed. Datzelfde jaar startte ik mijn eigen stream, en ik heb geen moment achteromgekeken — de energie van een volle zaal, maar dan een die nooit sluit, met de chat er middenin. Het loopt naast de club-sets, niet in plaats daarvan.",
    },
    {
      kicker: "naast het draaien",
      body: "Tegenwoordig stream ik een paar keer per week. Dinsdag is de vaste avond — live op Kick en Twitch om 19:00 CET — en het weekend is losser, aangekondigd op Instagram en in de Discord. Naast het draaien geef ik gymles op een basisschool, waar de belangrijkste les een simpele is: je kunt alles bereiken als je je er echt voor inzet.",
    },
  ],
};
