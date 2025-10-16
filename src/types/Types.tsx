export type ProjectType = {
  id: string;
  number: number;
  tags: string[];
  title: string;
  short_description: string;
  description: string;
  images: ImgType;
};

export type ImgType = {
  main:string[],
  fallback:string[]
}
