import { ProductGroupModel } from './../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from './../../../services/common.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { SolarData } from '../../../@core/data/solar';
import { CollaboratorService } from '../collaborator.service';
import { ApiService } from '../../../services/api.service';
import { CollaboratorPageModel } from '../../../models/collaborator.model';
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}
@Component({
  selector: 'ngx-collaborator-page-dashboard',
  templateUrl: './collaborator-page-dashboard.component.html',
  styleUrls: ['./collaborator-page-dashboard.component.scss']
})
export class CollaboratorPageDashboardComponent implements OnDestroy {

  groupList: ProductGroupModel[];
  formItem: FormGroup;
  constructor(
    private themeService: NbThemeService,
    private solarService: SolarData,
    public commonService: CommonService,
    public formBuilder: FormBuilder,
    public collaboratorService: CollaboratorService,
    public apiService: ApiService,
  ) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });

      this.apiService.getPromise<ProductGroupModel[]>('/collaborator/product-groups', { onlyIdText: true, limit: 'nolimit' }).then(rs => {
        this.groupList = [{ id: '', text: '' }, ...rs];
      });

    const currentDate = new Date();
    this.formItem = this.formBuilder.group({
      DateReport: ['MONTH', Validators.required],
      DateRange: [[new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), new Date(currentDate.getFullYear(), currentDate.getMonth(), 31)]],
      Page: [''],
      ProductGroup: [''],
    });
    this.formItem.get('DateRange').valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  select2OptionForPage = {
    placeholder: 'Tất cả trang...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2DateReportOption = {
    placeholder: 'Chọn thời gian...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  dateReportList = [
    { id: 'MONTH', text: 'Tháng này' },
    { id: 'YEAR', text: 'Năm nay' },
    { id: 'WEEK', text: 'Tuần này' },
    { id: 'TODAY', text: 'Hôm nay' },
  ];
  onDateReportChange(dateReport: any) {

  }

  select2ProductGroup = {
    placeholder: 'Tất cả nhóm sản phẩm...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    multiple: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  private alive = true;

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Đơn hàng phát sinh',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Đơn hàng đã duyệt',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Doanh thu phát sinh',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Hoa hồng phát sinh',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.lightCard,
          type: 'warning',
        },
        {
          ...this.rollerShadesCard,
          type: 'primary',
        },
        {
          ...this.wirelessAudioCard,
          type: 'danger',
        },
        {
          ...this.coffeeMakerCard,
          type: 'info',
        },
      ],
      dark: this.commonStatusCardsSet,
    };

  ngOnDestroy() {
    this.alive = false;
  }

  onChangePage(page: CollaboratorPageModel) {
    
  }
}
