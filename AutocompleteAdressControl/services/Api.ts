import axios from "axios";

// Anonymous function to create a new instance of the API class
export async function getAddressesFromApi(searchTerm: string) {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${searchTerm}&limit=15`;
  const response = await axios.get(url)
  return response.data.features;
}