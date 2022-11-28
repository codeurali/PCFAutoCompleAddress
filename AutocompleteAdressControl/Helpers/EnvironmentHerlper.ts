import { IEnvironmentVariable, EnvironmentVariableType } from "../../index.types";

export class EnvironmentHelper {
  constructor(private _WebApi: ComponentFramework.WebApi) { }

  async getValue(schemaName: string | null): Promise<any> {
    if(!schemaName) return null;
    const environmentVar = await this.getEnvironmentVariable(schemaName);
    return this.getEnvironmentVariableValue(environmentVar);
  }

  async getEnvironmentVariable(schemaName: string): Promise<IEnvironmentVariable | undefined> {
    const relationshipName = "environmentvariabledefinition_environmentvariablevalue";
    let options = "?";
    options += `$select=schemaName,defaultvalue,type`;
    options += `&$filter=statecode eq 0 and scheaname eq '${schemaName}'`;
    options += `&expand=${relationshipName}{$filter=statecode eq 0;$select=value}`;
    const response = await this._WebApi.retrieveMultipleRecords("environmentvariabledefinition", options);

    const environmentVarEntity = response.entities.shift();

    if(environmentVarEntity) {
      const environmentVarType = this.getEnvironmentVariableType(environmentVarEntity.type);

      const environmentVarValueEntity = (<any[]>environmentVarEntity[relationshipName]).shift();

      const environmentVarValue = environmentVarValueEntity?.value ?? environmentVarEntity.defaultvalue;

      return {
        type: environmentVarType,
        value: environmentVarValue
      }
    }
  }

  getEnvironmentVariableValue(environmentVar?: IEnvironmentVariable): any {
    if(!environmentVar || !environmentVar.value) return null;

    let value: any = null;

    switch(environmentVar.type) {
      case "string":
        value = this.getStringValue(environmentVar.value);
        break;
      case "boolean":
        value = this.getBooleanValue(environmentVar.value);
        break;
      case "number":
        value = this.getNumberValue(environmentVar.value);
        break;
      case "json":
        value = this.getJsonValue(environmentVar.value);
        break;
    }
  return value;
  }

  private getEnvironmentVariableType(type: number): EnvironmentVariableType {
    switch(type) {
      case 100000000:
        return "string";
      case 100000001:
        return "number";
      case 100000002:
        return "boolean";
      case 100000003:
        return "json";
      default:
        return "unspecified";
    }
  }

  private getStringValue(value: string): string {
    return value as string;
  }

  private getBooleanValue(value: string): boolean {
    return value.toLowerCase() === "true" ? true : false;
  }

  private getNumberValue(value: string): number | null {
    const parsedValue = parseFloat(value);
    if(isNaN(parsedValue)) return null;
    return parsedValue;
  }

  private getJsonValue(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      console.warn(`Environment variable value is not a valid JSON string: ${value}`);
      return null;
    }
  }

}