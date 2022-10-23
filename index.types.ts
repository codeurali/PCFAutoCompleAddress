export type Address = {
    id: string;
    whole_address: string;
    street_number: string,
    street: string;
    city: string;
    zip: string;
};


export interface IAdressControlProps {
  address: Address
  handleValueChanged: (newValue: Address) => void
}