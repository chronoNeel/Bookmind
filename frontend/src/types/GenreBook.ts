export interface GenreBook {
  key: string;
  title: string;
  cover_id?: number;
  authors?: {
    key: string;
    name: string;
  }[];
  first_publish_year?: number;
}
