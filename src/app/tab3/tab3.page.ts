import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonInput, IonToggle } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonToggle, IonInput, IonLabel, IonItem, IonList, IonIcon, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page {
  username: string = '';
  isDarkMode: boolean = true;

  constructor() {}

  async ngOnInit() {

    this.isDarkMode = await this.getData();
    document.documentElement.classList.toggle('ion-palette-dark',  this.isDarkMode);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('ion-palette-dark',  !this.isDarkMode);
    this.saveData(!this.isDarkMode)
  }

  async saveData(isDarkMode: boolean) {
    await Preferences.set({
        key: 'dark_mode',
        value: JSON.stringify(isDarkMode), // Save as a stringified boolean
    });
    console.log('Data saved successfully!');
}

  async getData(): Promise<boolean> {
    const { value } = await Preferences.get({ key: 'dark_mode' });
    console.log('Retrieved value:', value);

    // Parse the value into a boolean
    return value === 'true';
  }
  
}
