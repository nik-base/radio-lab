import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { mockProvider } from '@ngneat/spectator/jest';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [mockProvider(MessageService)],
    }).compileComponents();
  });

  it(`should have as title 'Radiology Reporting Suite'`, () => {
    const fixture: ComponentFixture<AppComponent> =
      TestBed.createComponent(AppComponent);

    const app: AppComponent = fixture.componentInstance;

    expect(app.title).toEqual('Radiology Reporting Suite');
  });
});
