export interface Book {
  // searchBook
  key: string;
  title: string;

  author_key?: string[];
  author_name?: string[];

  cover_i: number;
  cover_edition_key?: string;

  first_publish_year?: number;
  edition_count?: number;

  ebook_access?: string;
  has_fulltext?: boolean;
  public_scan_b?: boolean;

  language?: string[];
  ia?: string[];
  ia_collection_s?: string;

  lending_edition_s?: string;
  lending_identifier_s?: string;
}

export interface BookDetails {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: { author: { key: string } }[];
}

export interface SimilarBook {
  title: string;
  author: string;
  workKey: string;
  coverUrl: string | null;
  subject: string;
}

// export interface JournalEntry {
//   id: number;
//   user: {
//     name: string;
//     avatar: string;
//   };
//   rating: number;
//   date: string;
//   text: string;
//   upvotes: number;
//   downvotes: number;
// }

export type ReadingStatus = "wantToRead" | "ongoing" | "completed" | null;
