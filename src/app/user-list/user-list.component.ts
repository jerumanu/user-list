import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list'; 
import { User } from './user.model';
import { UserService } from '../user.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule, // Add these imports
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true // If you are using standalone component
})
export class UserListComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Fetch user data on component initialization
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    // Apply debounce to search input
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(query => {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(target.value.toLowerCase())
    );
  }
}
