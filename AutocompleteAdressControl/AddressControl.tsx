import * as React from "react";
import { Stack, ComboBox, IComboBoxOption, IComboBox } from "@fluentui/react";
import { useState, useMemo, useRef, useCallback } from "react";
import { getAddressesFromApi } from "./services/Api";
import { Address, IAdressControlProps } from "../index.types";

const AddressControl = (props: IAdressControlProps) => {
  const [addresses, setAddresses] = useState([] as Address[]);
  const [searchTerm, setSearchTerm] = useState("" as string);

  const comboBoxRef = useRef<IComboBox>(null);
  const onOpenClick = useCallback(() => comboBoxRef.current?.focus(true), []);

  // Loop on API Address response and push each company in setAddresses then return a list of companies
  const populateAddresses = (result: any): Address[] => {
    for (let address of result) {
      let item = { ...address.properties };
      let coo = { ...address.geometry.coordinates };
      item.label &&
        setAddresses((addresses) => [
          ...addresses,
          {
            id: item.id,
            adresse_complete: item.label,
            street_number: item.housenumber,
            street_name: item.street,
            city: item.city,
            postcode: item.postcode,
            longitude: coo[0],
            latitude: coo[1],
            codeINSEE: item.citycode,
            region: item.context.split(",").pop(),
            simple_address: item.name,
            numero_departement: item.context.split(",")[0],
            departement: item.context.split(",")[1],
          },
        ]);
    }
    return addresses;
  };

  // Call API Addresses by name when user searching on Combobox input then set setAddresses or return error
  const receiveAddresses = async (searchTerm: string) => {
    setAddresses([] as Address[]);
    const result = await getAddressesFromApi(searchTerm);
    populateAddresses(result);
    console.log(addresses);
  };

  // Set searchTerm when user typing on Combobox input
  const chosenAddress = (option: IComboBoxOption) => {
    let item = addresses.find((address: Address) => address.id === option.key);
    props.handleValueChanged(item as Address);
  };

  // Set searchTerm when user typing on Combobox input
  const addressesOptionsList = addresses
    .filter(
      (address, index, self) =>
        address.adresse_complete !== null &&
        index ===
          self.findIndex((a) => a.adresse_complete === address.adresse_complete)
    )
    .slice(0, 10)
    .map((address: Address) => {
      return { key: address.id, text: address.adresse_complete };
    });

  useMemo(() => {
    if (searchTerm.length > 3) {
      receiveAddresses(searchTerm);
    }
  }, [searchTerm]);

  return (
    <Stack styles={{ root: { width: "100%" } }}>
      <ComboBox
        placeholder="Rechercher une adresse..."
        useComboBoxAsMenuWidth={true}
        styles={{
          root: { width: "100%", selectors: { ":after": { border: 0 } } },
          container: { width: "100%" },
        }}
        allowFreeform={true}
        autoComplete="on"
        autoCapitalize="on"
        openOnKeyboardFocus={true}
        options={addressesOptionsList}
        onPendingValueChanged={(option, idx, value) =>
          value && setSearchTerm(value)
        }
        onChange={(event, option, idx, value) =>
          option ? chosenAddress(option) : console.error(idx, value)
        }
        onItemClick={(e, option) => option && chosenAddress(option)}
        componentRef={comboBoxRef}
        onClick={onOpenClick}
      />
    </Stack>
  );
};

export default AddressControl;
