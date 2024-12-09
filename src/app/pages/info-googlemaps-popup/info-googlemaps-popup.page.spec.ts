import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoGooglemapsPopupPage } from './info-googlemaps-popup.page';

describe('InfoGooglemapsPopupPage', () => {
  let component: InfoGooglemapsPopupPage;
  let fixture: ComponentFixture<InfoGooglemapsPopupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGooglemapsPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
