import { Component, OnInit } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import {Router} from '@angular/router';
import {Friend} from '../models/friend.model';
import {SparqlService} from '../services/query/sparql.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  friends: Friend[];

  constructor(private sparql:SparqlService, private router: Router, private rdf: RdfService) { }

  ngOnInit() {
    this.loadFriends();
  }

  async loadFriends() {
    try {
      const list_friends = await this.rdf.getFriends();
        if (list_friends) {
        this.friends = list_friends;
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  printquery(){
    console.log(this.sparql);
    this.sparql.printQuery();
  }

}
