export interface IValueFormField {
  code: string;
  label: string;
}

export interface IFormField {
  name: string;
  type: string;
  validation: string;
  values: IValueFormField[] | null;
}

export interface IBank {
  id: number;
  name: string;
  displayName: string;
  logo: string;
  iconLogo: string;
  textLogo: string;
  country: string;
  status: string;
  formFields: IFormField[];
}

export interface InstitutionsResponse {
  count: number;
  institutions: IBank[];
}
