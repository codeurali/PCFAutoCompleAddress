import { IInputs, IOutputs } from "./generated/ManifestTypes";
import AddressControl from "./AddressControl";
import { IAdressControlProps, Address } from "../index.types";
import * as React from "react";

export class AutocompleteAddressControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private _notifyOutputChanged: () => void;
  private _context: ComponentFramework.Context<IInputs>;
  private _props: IAdressControlProps = {
    address: {} as Address,
    handleValueChanged: (newValue: Address) => {
      this._props.address = {
        id: newValue.id,
        adresse_complete: newValue.adresse_complete,
        street_number: newValue.street_number,
        street_name: newValue.street_name,
        city: newValue.city,
        postcode: newValue.postcode,
        longitude: newValue.longitude,
        latitude: newValue.latitude,
        codeINSEE: newValue.codeINSEE,
        region: newValue.region,
        simple_address: newValue.simple_address,
        numero_departement: newValue.numero_departement,
        departement: newValue.departement,
        
      }
      this._notifyOutputChanged();
    },
  
  }

  /**
   * Empty constructor.
   */
  constructor() { }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
    this._context = context;
    console.log("init", context);
    console.log("_init", this._context);
    this._setProps(context);
    this._notifyOutputChanged();
    state ?? (this._props.address = state as Address);
    console.log("state", state)
    console.log("state " + context.mode.setControlState(state));
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    this._setProps(context)
    return React.createElement(
      AddressControl, this._props
    );
  }

  private _setProps(context: ComponentFramework.Context<IInputs>): void {
    if (context.parameters.adresse_complete.raw) {
      this._props.address = {
        id: context.parameters.id.raw,
        adresse_complete: context.parameters.adresse_complete.raw,
        street_number: context.parameters.street_number.raw,
        street_name: context.parameters.street_name.raw,
        city: context.parameters.city.raw,
        postcode: context.parameters.postcode.raw,
        longitude: context.parameters.longitude.raw,
        latitude: context.parameters.latitude.raw,
        codeINSEE: context.parameters.codeINSEE.raw,
        region: context.parameters.region.raw,
        simple_address: context.parameters.simple_address.raw,
        numero_departement: context.parameters.numero_departement.raw,
        departement: context.parameters.departement.raw,
      } as Address;
      this._notifyOutputChanged();
    }
  }

  // retrieve address from web api and set it to props using context Web Api
  // private _retrieveAdressFromWebAPI(context: ComponentFramework.Context<IInputs>): void {
  //   var query = context.webAPI.retrieveRecord("account", context.parameters.id.raw, "?$select=address1_line1,address1_line2,address1_line3,address1_city,address1_postalcode,address1_stateorprovince,address1_country,address1_latitude,address1_longitude");
  // }

  public clearRecivedProps(): void {
    this._props.address = {} as Address;
    this._notifyOutputChanged();
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    let a = { ...this._props.address }
    return {
      id: a.id,
      adresse_complete: a.adresse_complete,
      street_number: a.street_number,
      street_name: a.street_name,
      city: a.city,
      postcode: a.postcode,
      longitude: a.longitude,
      latitude: a.latitude,
      codeINSEE: a.codeINSEE,
      region: a.region,
      simple_address: a.simple_address,
      numero_departement: a.numero_departement,
      departement: a.departement,
    };
  }


  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}