import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { GameService } from './services/gameService';
import { User } from './model/User';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  private userList : Array<User> = [];
  private username:string = '';
  private requestUser:User = { Username : '', ClientId: '' };
  constructor(public gameService:GameService){
    this.requestUser.Username = '';
  }
  ngOnInit(){
    

    this.gameService.startConnection();

    this.gameService.hubConnection.on('GetAllUser', (data) => {
      this.userList = data;
    });
    
    this.gameService.hubConnection.on('GetPlayRequest', (data) => {
      this.openModal.nativeElement.click();
      this.requestUser = data;
    });

    this.gameService.hubConnection.on('LetsPlay', (data) => {
      console.log("Oyun başladı");
    });

    this.gameService.hubConnection.on('Result', (data) => {
      console.log(data);
    });
    
    
  }

  setUsername(){
    this.gameService.setUsername(this.username);
  }

  sendRequest(clientId){
    this.gameService.sendGameRequest(clientId);
  }

  acceptGameRequest(senderClient)
  {
    this.gameService.acceptGameRequest(senderClient);
  }

  setUserChoice(choice){
    this.gameService.setUserChoice(choice);
  }

  title = 'SPA';
}
