export const CATEGORIES = ["TRABAJO", "FAMILIA", "PERSONAL", "OTRO"] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  TRABAJO: "Trabajo",
  FAMILIA: "Familia",
  PERSONAL: "Personal",
  OTRO: "Otro",
};

export const CATEGORY_BADGE: Record<Category, string> = {
  TRABAJO: "bg-primary",
  FAMILIA: "bg-success",
  PERSONAL: "bg-warning text-dark",
  OTRO: "bg-secondary",
};

export type Signature = {
  id: string;
  label: string;
  imageData: string;
  category: Category;
  notes: string | null;
  createdAt: string;
};
