export interface TabletDimensions {
    width: number;
    height: number;
}

export interface TabletBrands {
    [brand: string]: {
        [model: string]: TabletDimensions;
    };
}
