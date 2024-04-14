import axios from "axios";

export class ServerRequests {
    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }
    async getTotalCountries(member_name = "All Members"){
        try {

            let apiResp = await axios.get(this.apiUrl, {
              params: {
                member_name: member_name
              }
            });
            
            console.log(apiResp.data)
            return apiResp.data;
          } catch (error) {
            console.log("Faild to getTotalCountries(): " + error);
          }
    }
    async getUsers() {
        try {
          let apiResp = await axios.get(this.apiUrl + "/users");
          return apiResp.data;
        } catch (error) {
          console.log("Faild to getUsers(): " + error);
        }
      }
    async getCodeFromName(countryName) {
        try {
          let apiResp = await axios.get(this.apiUrl + "/getCodeFromName/" + countryName);
          return apiResp.data;
        } catch (err) {
          console.error(err);
        }
      }
}