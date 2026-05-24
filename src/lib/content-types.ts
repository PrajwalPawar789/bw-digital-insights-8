export type HomePlacement = "grid" | "cxo" | "bizhot_metro" | "business_bulletin" | "cover_story";
export type HomeLeaderSection =
  | "cover_story"
  | "magazine_profile"
  | "video_interview"
  | "leadership_talk";

export type Article = {
  id: string;
  title: string;
  image_url?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
  category?: string | null;
  author?: string | null;
  home_placement?: string | null;
  home_order?: number | null;
};

export type Leader = {
  id: string;
  name: string;
  image_url?: string | null;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  slug?: string | null;
  home_sections?: string[] | null;
  home_order?: number | null;
};

export type PressRelease = {
  id: string;
  title: string;
  image_url?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  date?: string | null;
};

export type Trending = {
  id: string;
  title: string;
  image_url?: string | null;
};

export type Upcoming = {
  id: string;
  title: string;
  release_date?: string | null;
};

export type Testimonial = {
  id: string;
  name?: string | null;
  content?: string | null;
};
