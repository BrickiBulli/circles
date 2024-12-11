import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateChatroomPage } from './create-chatroom.page';

describe('CreateChatroomPage', () => {
  let component: CreateChatroomPage;
  let fixture: ComponentFixture<CreateChatroomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChatroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
