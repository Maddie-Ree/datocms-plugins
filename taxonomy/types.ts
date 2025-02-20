export type ValidManualExtensionParameters = {
  targetFieldsApiKey: string[];
  invert: boolean;
  sharedFilterSelector?: string;
};

export type Filter = {
  id: string;
  attributes: {
    name: string;
  };
};