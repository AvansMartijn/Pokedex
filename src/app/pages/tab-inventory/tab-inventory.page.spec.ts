import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabInventoryPage } from './tab-inventory.page';

describe('TabInventoryPage', () => {
  let component: TabInventoryPage;
  let fixture: ComponentFixture<TabInventoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabInventoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
