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
        let coo = {...address.geometry.coordinates}
        item.label && setAddresses(addresses => [...addresses, {
          id: item.id,
          adresse_complete: item.label,
          street_number: item.housenumber,
          street_name: item.street,
          city: item.city, 
          postcode: item.postcode,
          longitude: coo[0],
          latitude: coo[1],
          codeINSEE : item.citycode,
          region: item.context.split(',').pop(),
          simple_address: item.name,
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
      addresses.filter((address: Address) => address.adresse_complete.toLowerCase().includes(searchTerm.toLowerCase())); 
    }

    // Set searchTerm when user typing on Combobox input
    const chosenAddress = (option : IComboBoxOption) => {
      let item = addresses.find((address: Address) => address.id === option.key);
      props.handleValueChanged(item as Address);
    }


    // Set searchTerm when user typing on Combobox input
    const addressesOptionsList = addresses
      .filter((address, index, self) => address.adresse_complete !== null && index === self.findIndex((a)=> (a.adresse_complete === address.adresse_complete)))
      .filter(address => address.adresse_complete.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      .map((address: Address) => {
        return { key: address.id, text: address.adresse_complete}
      });

      
    useEffect(() => {
      if (searchTerm.length > 3) {
        searchForAddresses(searchTerm);
      }
    }, [searchTerm]);

  return (
    <Stack 
      // set width to 100% to avoid the control to be shrinked
      styles={{root: {width: '100%'}}}
    >
      <ComboBox
        placeholder='Rechercher une adresse'
        useComboBoxAsMenuWidth={true}
        styles={
          { root: { width: '100%' }, callout: { width: '100%' }, container: { width: '100%' },  }   
        }
        allowFreeform = {true}
        autoComplete='on'
        autoCapitalize='on'
        openOnKeyboardFocus={true}
        options={addressesOptionsList}
        onPendingValueChanged={(option, idx, value) => value && setSearchTerm(value)}
        onChange={(event, option, idx, value) => option ? chosenAddress(option) : console.error(idx, value)}
        onItemClick={(e, option) => option && chosenAddress(option)}
      />
    </Stack>
  )
}

export default AddressControl