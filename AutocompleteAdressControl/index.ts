import { IInputs, IOutputs } from "./generated/ManifestTypes";
import AddressControl from "./AddressControl";
import { IAdressControlProps, Address } from "../index.types";
import * as React from "react";

export class AutocompleteAddressControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
  private _notifyOutputChanged: () => void;
  private _props: IAdressControlProps = {
    address: {} as Address,
    handleValueChanged: (newValue: Address) => {
      this._props.address = {
        id: newValue.id,
        whole_address: newValue.whole_address,
        street_number: newValue.street_number,
        street: newValue.street,
        city: newValue.city,
        zip: newValue.zip,
        longitude: newValue.longitude,
        latitude: newValue.latitude
      }
      this._notifyOutputChanged();
    }
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
    state: ComponentFramework.Dictionary
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
    this._setProps(context); 
    this._notifyOutputChanged();
    // if persisted state is available, restore it
    state ?? (this._props.address = state as Address);
    
    
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
    if (context.parameters.whole_address.raw) {
      this._props.address = {
        id: context.parameters.id.raw,
        whole_address: context.parameters.whole_address.raw,
        street_number: context.parameters.street_number.raw,
        street: context.parameters.street.raw,
        city: context.parameters.city.raw,
        zip: context.parameters.zip.raw,
        longitude: context.parameters.longitude.raw,
        latitude: context.parameters.latitude.raw
      } as Address;
      this._notifyOutputChanged();
    }
  }

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
      whole_address: a.whole_address,
      street_number: a.street_number,
      street: a.street,
      city: a.city,
      zip: a.zip,
      longitude: a.longitude,
      latitude: a.latitude
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
