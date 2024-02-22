import { Component } from '@angular/core';
import WallComponent from './components/wall/wall.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PostSectionComponent } from './components/post-section/post-section.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [
    WallComponent,
    UserProfileComponent,
    PostSectionComponent,
    SearchBarComponent,
  ],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
})
export default class SocialComponent {}
