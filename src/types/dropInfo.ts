export type XY = {
  x: number;
  y: number;
};

export type LayoutType = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type MeasureType = LayoutType & {
  top: number;
  left: number;
};

export type DropInfo = {
  glyph: string;
  containsGlyph?: string; // Is something already dropped here or not
} & MeasureType;
