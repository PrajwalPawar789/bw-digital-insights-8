// Option lists for the Home page placement tags, shared by the admin forms.

// Which Home page section an article is pinned to. "none" => not shown on Home.
export const ARTICLE_HOME_PLACEMENTS = [
  { value: "none", label: "Not on Home page" },
  { value: "grid", label: "Home — Articles Grid (3×3)" },
  { value: "cxo", label: "Home — CXO Articles" },
  { value: "bizhot_metro", label: "Home — Bizhot Metros" },
  { value: "business_bulletin", label: "Home — Business Bulletin" },
];

// Which Home page section(s) a leadership profile appears in.
export const LEADER_HOME_SECTIONS = [
  { value: "cover_story", label: "Cover Story" },
  { value: "magazine_profile", label: "Magazine Profiles" },
  { value: "video_interview", label: "Video Interviews" },
  { value: "leadership_talk", label: "Leadership Talks" },
];
