import { slugify } from "./slugify";

export const articleCategories = [
  "News",
  "Top Trending News",
  "Editor's Picks",
  "Top Stories",
  "Business",
  "Technology",
  "Leadership",
  "Innovation",
  "Strategy",
  "Finance",
  "Marketing",
  "Healthcare",
  "Manufacturing",
  "Energy",
  "Other",
];

export const INDUSTRY_NEWS_CATEGORIES = ["News", "Top Trending News", "Top Stories"];

export const normalizeCategorySlug = (value?: string | null) =>
  slugify(value || "");

export const isIndustryNewsCategory = (value?: string | null) => {
  const normalizedValue = (value || "").trim().toLowerCase();
  return INDUSTRY_NEWS_CATEGORIES.some(
    (category) => category.trim().toLowerCase() === normalizedValue
  );
};
