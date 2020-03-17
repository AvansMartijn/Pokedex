import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HuntPage } from './hunt.page';

describe('HuntPage', () => {
  let component: HuntPage;
  let fixture: ComponentFixture<HuntPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuntPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HuntPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
