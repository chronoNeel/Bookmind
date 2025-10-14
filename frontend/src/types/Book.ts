export interface Book {
  key: string;
  title: string;

  author_key?: string[];
  author_name?: string[];

  cover_i?: number;
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
