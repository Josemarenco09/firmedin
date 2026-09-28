export type Signature = {
  id: string;
  label: string;
  imageData: string;
  category: "TRABAJO" | "FAMILIA" | "PERSONAL" | "OTRO";
  notes: string | null;
  createdAt: string;
};
