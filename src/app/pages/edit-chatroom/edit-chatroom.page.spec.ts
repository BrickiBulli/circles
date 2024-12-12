import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditChatroomPage } from './edit-chatroom.page';

describe('EditChatroomPage', () => {
  let component: EditChatroomPage;
  let fixture: ComponentFixture<EditChatroomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChatroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
