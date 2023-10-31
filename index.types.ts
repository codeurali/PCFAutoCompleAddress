

export type Address = {
    id: string;
    adresse_complete: string;
    street_number: string,
    street_name: string;
    city: string;
    postcode: string;
    longitude: number;
    latitude: number;
    codeINSEE: string;
    region: string;
    simple_address: string;
    numero_departement: string;
    departement: string;
};

export interface IAdressControlProps {
  address: Address
  // eslint-disable-next-line no-unused-vars
  handleValueChanged: (newValue: Address) => void;
}