import { JournalEntry } from "../../../types/Book";

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    user: { name: "Sarah Johnson", avatar: "https://i.pravatar.cc/150?img=1" },
    rating: 5,
    date: "October 15, 2025",
    text: "This book completely changed my perspective on the American Dream. Fitzgerald's prose is absolutely stunning, and the way he captures the decadence and emptiness of the Jazz Age is masterful. Gatsby himself is such a tragic figure - his unwavering hope in the face of impossible odds is both inspiring and heartbreaking.",
    upvotes: 45,
    downvotes: 2,
  },
  {
    id: 2,
    user: { name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=2" },
    rating: 4,
    date: "October 12, 2025",
    text: "Beautiful writing, though I found Nick to be an unreliable narrator at times. The symbolism with the green light is something I'll never forget. A must-read for anyone interested in American literature.",
    upvotes: 32,
    downvotes: 5,
  },
  {
    id: 3,
    user: { name: "Emma Williams", avatar: "https://i.pravatar.cc/150?img=3" },
    rating: 5,
    date: "October 8, 2025",
    text: "Reread this for the third time and discovered new layers each time. The contrast between old money and new money, the role of women in the 1920s, and the critique of capitalism are all brilliantly woven into the narrative.",
    upvotes: 28,
    downvotes: 1,
  },
];
