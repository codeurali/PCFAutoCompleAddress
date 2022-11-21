import * as React from 'react';
import { Stack, ComboBox, IComboBoxOption } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { getAddressesFromApi } from './services/Api';
import {Address, IAdressControlProps} from '../index.types';

const AddressControl = (props: IAdressControlProps) => {

    const [addresses, setAddresses] = useState([] as Address[]);
    const [searchTerm, setSearchTerm] = useState('' as string);

    // Loop on API Address response and push each company in setAddresses
  // Finally return a list of companies
    const populateAddresses = (result: any) : Address[] => {
      for(let address of result) {
        let item = {...address.properties}
        item.label && setAddresses(addresses => [...addresses, {
          id: item.id,
          whole_address: item.label,
          street_number: item.housenumber,
          street: item.street,
          city: item.city,
          zip: item.postcode,
          longitude: item.x,
          latitude: item.y,
          cityCode : item.citycode,
          context : item.context
        }]);
      }
      return addresses;
    }

    // Call API Addresses by name when user searching on Combobox input then set setAddresses or return error
    const receiveAddresses = async (searchTerm: string) => {
      const result = await getAddressesFromApi(searchTerm);
      populateAddresses(result);
    }

    // Filter companyList by name when user searching on Combobox input
    const searchForAddresses = (searchTerm: string) => {
      receiveAddresses(searchTerm);
      addresses.filter((address: Address) => address.whole_address.toLowerCase().includes(searchTerm.toLowerCase())); 
    }

    // Set searchTerm when user typing on Combobox input
    const chosenAddress = (option : IComboBoxOption) => {
      let item = addresses.find((address: Address) => address.id === option.key);
      props.handleValueChanged(item as Address);
    }

    // Set searchTerm when user typing on Combobox input
    const addressesOptionsList = addresses
      .filter((address, index, self) => address.whole_address !== null && index === self.findIndex((a)=> (a.whole_address === address.whole_address)))
      .filter(address => address.whole_address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      .map((address: Address) => {
        return { key: address.id, text: address.whole_address}
      });

      
    useEffect(() => {
      if (searchTerm.length > 3) {
        searchForAddresses(searchTerm);
      }
    }, [searchTerm]);

  return (
    <Stack>
      <ComboBox
        placeholder='Rechercher une adresse'
        useComboBoxAsMenuWidth={true}
        allowFreeform = {true}
        autoComplete='on'
        autoCapitalize='on'
        openOnKeyboardFocus={true}
        options={addressesOptionsList}
        onPendingValueChanged={(option, idx, value) => value && setSearchTerm(value)}
        onChange={(event, option, idx, value) => option && chosenAddress(option)}
        onItemClick={(e, option) => option && chosenAddress(option)}
      />
    </Stack>
  )
}

export default AddressControl