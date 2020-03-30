import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabHuntPage } from './tab-hunt.page';

describe('TabHuntPage', () => {
  let component: TabHuntPage;
  let fixture: ComponentFixture<TabHuntPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabHuntPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabHuntPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
