import { Component, OnInit } from '@angular/core';
import { RdfService } from '../services/rdf.service';
import {Router} from '@angular/router';
import {Friend} from '../models/friend.model';
import {forEach} from '@angular/router/src/utils/collection';
// Declaramos las variables para jQuery
import * as $ from 'jquery';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  friends: Friend[];

  constructor(private router: Router, private rdf: RdfService) { }

  ngOnInit() {
    this.loadFriends();

    //JQUERY

    $('.messages').animate({ scrollTop: $(document).height() }, 'fast');
    $('#profile-img').click(function() {
      $('#status-options').toggleClass('active');
    });

    $('.expand-button').click(function() {
      $('#profile').toggleClass('expanded');
      $('#contacts').toggleClass('expanded');
    });

    $('#status-options ul li').click(function() {
      $('#profile-img').removeClass();
      $('#status-online').removeClass('active');
      $('#status-away').removeClass('active');
      $('#status-busy').removeClass('active');
      $('#status-offline').removeClass('active');
      $(this).addClass('active');

      if ($('#status-online').hasClass('active')) {
        $('#profile-img').addClass('online');
      } else if ($('#status-away').hasClass('active')) {
        $('#profile-img').addClass('away');
      } else if ($('#status-busy').hasClass('active')) {
        $('#profile-img').addClass('busy');
      } else if ($('#status-offline').hasClass('active')) {
        $('#profile-img').addClass('offline');
      } else {
        $('#profile-img').removeClass();
      }

      $('#status-options').removeClass('active');
    });
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

}
