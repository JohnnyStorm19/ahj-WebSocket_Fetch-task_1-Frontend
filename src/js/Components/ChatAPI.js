export default class ChatAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    async add(login) {
        const request = fetch(this.apiUrl + '/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( { login: login } )
          })
          const result = await request;
      
          if (!result.ok) {
            console.error('Error');
            return;
          }
          const json = await result.json();

          return json;
    }
}