import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';

 
@Injectable({
  providedIn: 'root'
})
export class GameService {
 
public hubConnection: signalR.HubConnection
 
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(environment.hubUrl)
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

      this.hubConnection.on('SetConnectionId', (data) => {
        console.log(data)
      });
      
  }

  public setUsername = (username) => {
  this.hubConnection
      .invoke('AddUserWithName', username)
      .catch(err => console.error(err));
  }

  public getAllUser = () => {
    this.hubConnection
        .invoke('SendAllUser')
        .catch(err => console.error(err));
    }
   
    public sendGameRequest(clientId) {
      this.hubConnection
        .invoke('SendGameRequest', clientId)
        .catch(err => console.error(err));
    }

    public acceptGameRequest(senderClientId) {
      this.hubConnection
        .invoke('AcceptGameRequest', senderClientId)
        .catch(err => console.error(err));
    }

    public setUserChoice(choice) {
      this.hubConnection
        .invoke('SetUserChoice', choice)
        .catch(err => console.error(err));
    }
    
    
}