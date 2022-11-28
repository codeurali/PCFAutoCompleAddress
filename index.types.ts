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
};

export interface IAdressControlProps {
  address: Address
  handleValueChanged: (newValue: Address) => void;
}