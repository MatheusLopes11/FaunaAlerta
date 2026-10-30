export interface GbifPage<T> {
    offset: number;
    limit: number;
    endOfRecords: boolean;
    results: T[];
}

export interface GbifSpecies {
    ley: number;
    scientificName: string;
    canonicalName?: string;
    class?: string;
    family?: string;
}

export interface GbifVernacularName {
    vernacularName: string;
    language?: string;
}

export interface GbifMedia {
    identifier?: string;
    creator?: string;
    license?: string;
}

export interface GbifOccurrence {
  media?: GbifMedia[];
}

export interface GbifFacetResponse {
  facets: { field: string; counts: { name: string; count: number }[] }[];
}