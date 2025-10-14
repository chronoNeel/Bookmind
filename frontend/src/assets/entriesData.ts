// types.ts
export interface Book {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  cover_i: number;
}

export interface PromptResponses {
  summary: string;
  character: string;
  change: string;
  quote: string;
}

export interface ReadingEntry {
  book: Book;
  id: string;
  createdAt: string;
  updatedAt: string;
  mood: string;
  rating: number;
  readingProgress: number;
  isPrivate: boolean;
  entry: string;
  promptResponses: PromptResponses;
  upvotes: number;
  downvotes: number;
}

export const bonjourTristesseEntries: ReadingEntry[] = [
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000001",
    createdAt: "2025-10-06T06:30:00.000Z",
    updatedAt: "2025-10-06T06:30:00.000Z",
    mood: "Melancholy",
    rating: 4,
    readingProgress: 60,
    isPrivate: false,
    entry:
      "The atmosphere feels heavy yet beautiful — like sun-soaked sadness. Cécile's emotional detachment mirrors my own moments of quiet reflection. Every chapter leaves me in a soft ache.",
    promptResponses: {
      summary:
        "Cécile spends her summer grappling with freedom, guilt, and the weight of emotional consequences.",
      character:
        "I relate to Cécile's conflicted nature — torn between desire and conscience.",
      change:
        "I might deepen Anne's backstory a bit more, to understand her emotional logic.",
      quote:
        "‘A strange melancholy pervades me to which I hesitate to give the grave and beautiful name of sadness.'",
    },
    upvotes: 5,
    downvotes: 0,
  },
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000002",
    createdAt: "2025-10-06T07:10:00.000Z",
    updatedAt: "2025-10-06T07:10:00.000Z",
    mood: "Sad",
    rating: 5,
    readingProgress: 100,
    isPrivate: true,
    entry:
      "Finished it. The simplicity of the ending destroyed me. No redemption, no grand moral — just emptiness. Sagan captures youth's cruel honesty too perfectly.",
    promptResponses: {
      summary:
        "Cécile's summer ends in tragedy — her recklessness leaving her with irreversible guilt.",
      character:
        "Anne's quiet strength felt dignified and tragic. I saw shades of someone trying to fix what shouldn't be fixed.",
      change: "Nothing. Its quiet cruelty is exactly what makes it brilliant.",
      quote:
        "‘I shall have loved this summer for its burning moments and its lost illusions.'",
    },
    upvotes: 9,
    downvotes: 0,
  },
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000003",
    createdAt: "2025-10-06T08:00:00.000Z",
    updatedAt: "2025-10-06T08:00:00.000Z",
    mood: "Neutral",
    rating: 3,
    readingProgress: 30,
    isPrivate: false,
    entry:
      "Still early, but Sagan's tone is fascinating — detached yet emotional. Feels like watching someone smile while they slowly fall apart.",
    promptResponses: {
      summary:
        "Cécile and her father live a carefree life until Anne arrives to disrupt their fragile balance.",
      character:
        "Cécile intrigues me — she's smart but careless, like someone aware of their own downfall.",
      change:
        "I'd add a few more internal monologues early on to understand her motivations better.",
      quote:
        "‘We had no qualms, no regrets, no moral sense — and we were happy.'",
    },
    upvotes: 2,
    downvotes: 1,
  },
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000004",
    createdAt: "2025-10-07T14:20:00.000Z",
    updatedAt: "2025-10-07T14:20:00.000Z",
    mood: "Reflective",
    rating: 4,
    readingProgress: 75,
    isPrivate: false,
    entry:
      "The tension between Cécile and Anne is palpable. It's not just about a stepmother figure, but about two different philosophies of life clashing. The French Riviera setting makes the emotional turmoil even more stark.",
    promptResponses: {
      summary:
        "As Anne's influence grows, Cécile becomes increasingly rebellious, setting the stage for the tragic climax.",
      character:
        "Raymond, Cécile's father, represents a carefree lifestyle that both attracts and repels me.",
      change:
        "I wish we saw more of Cyril's perspective - he seems like more than just a summer fling.",
      quote:
        "‘This new feeling of mine, neither love nor laziness, I named it after the words of a poem: 'Bonjour Tristesse'.'",
    },
    upvotes: 7,
    downvotes: 0,
  },
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000005",
    createdAt: "2025-10-08T09:45:00.000Z",
    updatedAt: "2025-10-08T09:45:00.000Z",
    mood: "Contemplative",
    rating: 5,
    readingProgress: 100,
    isPrivate: false,
    entry:
      "Re-reading this after years, and it hits differently now. At 17, I thought Cécile was cool and rebellious. Now I see the tragedy in her inability to connect genuinely with anyone. Sagan wrote this at 18 - such incredible insight for someone so young.",
    promptResponses: {
      summary:
        "A coming-of-age story where the protagonist's coming-of-age is marked by tragedy and emotional isolation rather than growth.",
      character:
        "Anne represents order and maturity, everything Cécile fears and resists about adulthood.",
      change:
        "The pacing is perfect - the slow build to the inevitable conclusion feels both natural and devastating.",
      quote:
        "‘I was made for happiness, and happiness was made for me, but it had escaped me.'",
    },
    upvotes: 12,
    downvotes: 1,
  },
  {
    book: {
      key: "/works/OL45804W",
      title: "Bonjour Tristesse",
      author_name: ["Françoise Sagan"],
      first_publish_year: 1954,
      cover_i: 8775021,
    },
    id: "/works/OL45804W-1759820000006",
    createdAt: "2025-10-09T16:30:00.000Z",
    updatedAt: "2025-10-09T16:30:00.000Z",
    mood: "Nostalgic",
    rating: 4,
    readingProgress: 100,
    isPrivate: true,
    entry:
      "This book reminds me of summers past - that particular brand of teenage ennui mixed with the intensity of first loves and family dramas. Sagan captures the Mediterranean summer so vividly I can almost feel the sun and smell the sea.",
    promptResponses: {
      summary:
        "A teenage girl's summer of freedom turns into a lesson about the consequences of emotional manipulation.",
      character:
        "Cécile's intelligence is both her strength and her tragedy - she's too smart for her own good.",
      change:
        "Maybe a brief epilogue showing Cécile years later, still haunted by that summer.",
      quote:
        "‘The memory of that summer spent in the south of France will remain with me forever, bathed in a light both cruel and tender.'",
    },
    upvotes: 3,
    downvotes: 0,
  },
];

// Additional utility data
export const bookStats = {
  averageRating: 4.2,
  totalEntries: 6,
  publicEntries: 5,
  privateEntries: 1,
  mostCommonMood: "Reflective",
  readingProgressDistribution: {
    completed: 3,
    inProgress: 2,
    justStarted: 1,
  },
};

export default bonjourTristesseEntries;
