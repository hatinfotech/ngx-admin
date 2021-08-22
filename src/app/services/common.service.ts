import { CommerceServiceByCycleFormComponent } from './../modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';
import { DeploymentVoucherPrintComponent } from './../modules/deployment/deployment-voucher/deployment-voucher-print/deployment-voucher-print.component';
import { SalesPriceReportPrintComponent } from './../modules/sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { CashPaymentVoucherPrintComponent } from './../modules/accounting/cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component';
import { CashReceiptVoucherPrintComponent } from './../modules/accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { WarehouseGoodsReceiptNotePrintComponent } from './../modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { WarehouseGoodsDeliveryNotePrintComponent } from './../modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { PurchaseOrderVoucherPrintComponent } from './../modules/purchase/order/purchase-order-voucher-print/purchase-order-voucher-print.component';
import { PurchasePriceTablePrintComponent } from './../modules/purchase/price-table/purchase-price-table-print/purchase-price-table-print.component';
import { HelpdeskTicketModel } from './../models/helpdesk.model';
import { TaxModel } from './../models/tax.model';
import { Injectable, Type, TemplateRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './api.service';
import {
  NbDialogService, NbMenuItem, NbToastrService, NbSidebarService,
  NbSidebarComponent, NbDialogRef, NbDialogConfig, NbIconLibraries, NbThemeService, NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Location, getCurrencySymbol, CurrencyPipe, DatePipe } from '@angular/common';
import { ActionControl } from '../lib/custom-element/action-control-list/action-control.interface';
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import { BaseComponent } from '../lib/base-component';
import { LoginInfoModel } from '../models/login-info.model';
import { TranslateService } from '@ngx-translate/core';
import { LocaleConfigModel } from '../models/system.model';
import { environment } from '../../environments/environment';
import { MySocket } from '../lib/nam-socket/my-socket';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { filter, take } from 'rxjs/operators';
import { UnitModel } from '../models/unit.model';
import { DeviceModel } from '../models/device.model';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from './notification.service';
import { MobileAppService } from '../modules/mobile-app/mobile-app.service';
import { QuickTicketFormComponent } from '../modules/helpdesk/dashboard/quick-ticket-form/quick-ticket-form.component';
import { SalesVoucherPrintComponent } from '../modules/sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { PurchaseVoucherPrintComponent } from '../modules/purchase/voucher/purchase-voucher-print/purchase-voucher-print.component';
import { AccountingOtherBusinessVoucherPrintComponent } from '../modules/accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  private DIACRITICS = {
    'Ⓐ': 'A', 'Ａ': 'A', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẫ': 'A', 'Ẩ': 'A', 'Ã': 'A', 'Ā': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A',
    'Ẵ': 'A', 'Ẳ': 'A', 'Ȧ': 'A', 'Ǡ': 'A', 'Ä': 'A', 'Ǟ': 'A', 'Ả': 'A', 'Å': 'A', 'Ǻ': 'A', 'Ǎ': 'A', 'Ȁ': 'A', 'Ȃ': 'A', 'Ạ': 'A', 'Ậ': 'A', 'Ặ': 'A', 'Ḁ': 'A',
    'Ą': 'A', 'Ⱥ': 'A', 'Ɐ': 'A', 'Ꜳ': 'AA', 'Æ': 'AE', 'Ǽ': 'AE', 'Ǣ': 'AE', 'Ꜵ': 'AO', 'Ꜷ': 'AU', 'Ꜹ': 'AV', 'Ꜻ': 'AV', 'Ꜽ': 'AY', 'Ⓑ': 'B', 'Ｂ': 'B', 'Ḃ': 'B',
    'Ḅ': 'B', 'Ḇ': 'B', 'Ƀ': 'B', 'Ƃ': 'B', 'Ɓ': 'B', 'Ⓒ': 'C', 'Ｃ': 'C', 'Ć': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Č': 'C', 'Ç': 'C', 'Ḉ': 'C', 'Ƈ': 'C', 'Ȼ': 'C', 'Ꜿ': 'C',
    'Ⓓ': 'D', 'Ｄ': 'D', 'Ḋ': 'D', 'Ď': 'D', 'Ḍ': 'D', 'Ḑ': 'D', 'Ḓ': 'D', 'Ḏ': 'D', 'Đ': 'D', 'Ƌ': 'D', 'Ɗ': 'D', 'Ɖ': 'D', 'Ꝺ': 'D', 'Ǳ': 'DZ', 'Ǆ': 'DZ', 'ǲ': 'Dz',
    'ǅ': 'Dz', 'Ⓔ': 'E', 'Ｅ': 'E', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ễ': 'E', 'Ể': 'E', 'Ẽ': 'E', 'Ē': 'E', 'Ḕ': 'E', 'Ḗ': 'E', 'Ĕ': 'E', 'Ė': 'E',
    'Ë': 'E', 'Ẻ': 'E', 'Ě': 'E', 'Ȅ': 'E', 'Ȇ': 'E', 'Ẹ': 'E', 'Ệ': 'E', 'Ȩ': 'E', 'Ḝ': 'E', 'Ę': 'E', 'Ḙ': 'E', 'Ḛ': 'E', 'Ɛ': 'E', 'Ǝ': 'E', 'Ⓕ': 'F', 'Ｆ': 'F',
    'Ḟ': 'F', 'Ƒ': 'F', 'Ꝼ': 'F', 'Ⓖ': 'G', 'Ｇ': 'G', 'Ǵ': 'G', 'Ĝ': 'G', 'Ḡ': 'G', 'Ğ': 'G', 'Ġ': 'G', 'Ǧ': 'G', 'Ģ': 'G', 'Ǥ': 'G', 'Ɠ': 'G', 'Ꞡ': 'G', 'Ᵹ': 'G',
    'Ꝿ': 'G', 'Ⓗ': 'H', 'Ｈ': 'H', 'Ĥ': 'H', 'Ḣ': 'H', 'Ḧ': 'H', 'Ȟ': 'H', 'Ḥ': 'H', 'Ḩ': 'H', 'Ḫ': 'H', 'Ħ': 'H', 'Ⱨ': 'H', 'Ⱶ': 'H', 'Ɥ': 'H', 'Ⓘ': 'I', 'Ｉ': 'I', 'Ì': 'I',
    'Í': 'I', 'Î': 'I', 'Ĩ': 'I', 'Ī': 'I', 'Ĭ': 'I', 'İ': 'I', 'Ï': 'I', 'Ḯ': 'I', 'Ỉ': 'I', 'Ǐ': 'I', 'Ȉ': 'I', 'Ȋ': 'I', 'Ị': 'I', 'Į': 'I', 'Ḭ': 'I', 'Ɨ': 'I', 'Ⓙ': 'J',
    'Ｊ': 'J', 'Ĵ': 'J', 'Ɉ': 'J', 'Ⓚ': 'K', 'Ｋ': 'K', 'Ḱ': 'K', 'Ǩ': 'K', 'Ḳ': 'K', 'Ķ': 'K', 'Ḵ': 'K', 'Ƙ': 'K', 'Ⱪ': 'K', 'Ꝁ': 'K', 'Ꝃ': 'K', 'Ꝅ': 'K', 'Ꞣ': 'K', 'Ⓛ': 'L',
    'Ｌ': 'L', 'Ŀ': 'L', 'Ĺ': 'L', 'Ľ': 'L', 'Ḷ': 'L', 'Ḹ': 'L', 'Ļ': 'L', 'Ḽ': 'L', 'Ḻ': 'L', 'Ł': 'L', 'Ƚ': 'L', 'Ɫ': 'L', 'Ⱡ': 'L', 'Ꝉ': 'L', 'Ꝇ': 'L',
    'Ꞁ': 'L', 'Ǉ': 'LJ', 'ǈ': 'Lj', 'Ⓜ': 'M', 'Ｍ': 'M', 'Ḿ': 'M', 'Ṁ': 'M', 'Ṃ': 'M', 'Ɱ': 'M', 'Ɯ': 'M', 'Ⓝ': 'N', 'Ｎ': 'N', 'Ǹ': 'N', 'Ń': 'N', 'Ñ': 'N', 'Ṅ': 'N',
    'Ň': 'N', 'Ṇ': 'N', 'Ņ': 'N', 'Ṋ': 'N', 'Ṉ': 'N', 'Ƞ': 'N', 'Ɲ': 'N', 'Ꞑ': 'N', 'Ꞥ': 'N', 'Ǌ': 'NJ', 'ǋ': 'Nj', 'Ⓞ': 'O', 'Ｏ': 'O', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Ồ': 'O', 'Ố': 'O', 'Ỗ': 'O', 'Ổ': 'O', 'Õ': 'O', 'Ṍ': 'O', 'Ȭ': 'O', 'Ṏ': 'O', 'Ō': 'O', 'Ṑ': 'O', 'Ṓ': 'O', 'Ŏ': 'O', 'Ȯ': 'O', 'Ȱ': 'O', 'Ö': 'O', 'Ȫ': 'O', 'Ỏ': 'O',
    'Ő': 'O', 'Ǒ': 'O', 'Ȍ': 'O', 'Ȏ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ỡ': 'O', 'Ở': 'O', 'Ợ': 'O', 'Ọ': 'O', 'Ộ': 'O', 'Ǫ': 'O', 'Ǭ': 'O', 'Ø': 'O', 'Ǿ': 'O', 'Ɔ': 'O',
    'Ɵ': 'O', 'Ꝋ': 'O', 'Ꝍ': 'O', 'Œ': 'OE', 'Ƣ': 'OI', 'Ꝏ': 'OO', 'Ȣ': 'OU', 'Ⓟ': 'P', 'Ｐ': 'P', 'Ṕ': 'P', 'Ṗ': 'P', 'Ƥ': 'P', 'Ᵽ': 'P', 'Ꝑ': 'P', 'Ꝓ': 'P', 'Ꝕ': 'P',
    'Ⓠ': 'Q', 'Ｑ': 'Q', 'Ꝗ': 'Q', 'Ꝙ': 'Q', 'Ɋ': 'Q', 'Ⓡ': 'R', 'Ｒ': 'R', 'Ŕ': 'R', 'Ṙ': 'R', 'Ř': 'R', 'Ȑ': 'R', 'Ȓ': 'R', 'Ṛ': 'R', 'Ṝ': 'R', 'Ŗ': 'R', 'Ṟ': 'R', 'Ɍ': 'R',
    'Ɽ': 'R', 'Ꝛ': 'R', 'Ꞧ': 'R', 'Ꞃ': 'R', 'Ⓢ': 'S', 'Ｓ': 'S', 'ẞ': 'S', 'Ś': 'S', 'Ṥ': 'S', 'Ŝ': 'S', 'Ṡ': 'S', 'Š': 'S', 'Ṧ': 'S', 'Ṣ': 'S', 'Ṩ': 'S', 'Ș': 'S',
    'Ş': 'S', 'Ȿ': 'S', 'Ꞩ': 'S', 'Ꞅ': 'S', 'Ⓣ': 'T', 'Ｔ': 'T', 'Ṫ': 'T', 'Ť': 'T', 'Ṭ': 'T', 'Ț': 'T', 'Ţ': 'T', 'Ṱ': 'T', 'Ṯ': 'T', 'Ŧ': 'T', 'Ƭ': 'T', 'Ʈ': 'T', 'Ⱦ': 'T',
    'Ꞇ': 'T', 'Ꜩ': 'TZ', 'Ⓤ': 'U', 'Ｕ': 'U', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ũ': 'U', 'Ṹ': 'U', 'Ū': 'U', 'Ṻ': 'U', 'Ŭ': 'U', 'Ü': 'U', 'Ǜ': 'U', 'Ǘ': 'U', 'Ǖ': 'U', 'Ǚ': 'U',
    'Ủ': 'U', 'Ů': 'U', 'Ű': 'U', 'Ǔ': 'U', 'Ȕ': 'U', 'Ȗ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ữ': 'U', 'Ử': 'U', 'Ự': 'U', 'Ụ': 'U', 'Ṳ': 'U', 'Ų': 'U', 'Ṷ': 'U', 'Ṵ': 'U',
    'Ʉ': 'U', 'Ⓥ': 'V', 'Ｖ': 'V', 'Ṽ': 'V', 'Ṿ': 'V', 'Ʋ': 'V', 'Ꝟ': 'V', 'Ʌ': 'V', 'Ꝡ': 'VY', 'Ⓦ': 'W', 'Ｗ': 'W', 'Ẁ': 'W', 'Ẃ': 'W', 'Ŵ': 'W', 'Ẇ': 'W', 'Ẅ': 'W',
    'Ẉ': 'W', 'Ⱳ': 'W', 'Ⓧ': 'X', 'Ｘ': 'X', 'Ẋ': 'X', 'Ẍ': 'X', 'Ⓨ': 'Y', 'Ｙ': 'Y', 'Ỳ': 'Y', 'Ý': 'Y', 'Ŷ': 'Y', 'Ỹ': 'Y', 'Ȳ': 'Y', 'Ẏ': 'Y', 'Ÿ': 'Y', 'Ỷ': 'Y', 'Ỵ': 'Y',
    'Ƴ': 'Y', 'Ɏ': 'Y', 'Ỿ': 'Y', 'Ⓩ': 'Z', 'Ｚ': 'Z', 'Ź': 'Z', 'Ẑ': 'Z', 'Ż': 'Z', 'Ž': 'Z', 'Ẓ': 'Z', 'Ẕ': 'Z', 'Ƶ': 'Z', 'Ȥ': 'Z', 'Ɀ': 'Z', 'Ⱬ': 'Z', 'Ꝣ': 'Z',
    'ⓐ': 'a', 'ａ': 'a', 'ẚ': 'a', 'à': 'a', 'á': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẫ': 'a', 'ẩ': 'a', 'ã': 'a', 'ā': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẵ': 'a', 'ẳ': 'a',
    'ȧ': 'a', 'ǡ': 'a', 'ä': 'a', 'ǟ': 'a', 'ả': 'a', 'å': 'a', 'ǻ': 'a', 'ǎ': 'a', 'ȁ': 'a', 'ȃ': 'a', 'ạ': 'a', 'ậ': 'a', 'ặ': 'a', 'ḁ': 'a', 'ą': 'a', 'ⱥ': 'a',
    'ɐ': 'a', 'ꜳ': 'aa', 'æ': 'ae', 'ǽ': 'ae', 'ǣ': 'ae', 'ꜵ': 'ao', 'ꜷ': 'au', 'ꜹ': 'av', 'ꜻ': 'av', 'ꜽ': 'ay', 'ⓑ': 'b', 'ｂ': 'b', 'ḃ': 'b', 'ḅ': 'b',
    'ḇ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɓ': 'b', 'ⓒ': 'c', 'ｃ': 'c', 'ć': 'c', 'ĉ': 'c', 'ċ': 'c', 'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ƈ': 'c', 'ȼ': 'c', 'ꜿ': 'c', 'ↄ': 'c',
    'ⓓ': 'd', 'ｄ': 'd', 'ḋ': 'd', 'ď': 'd', 'ḍ': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ḏ': 'd', 'đ': 'd', 'ƌ': 'd', 'ɖ': 'd', 'ɗ': 'd', 'ꝺ': 'd', 'ǳ': 'dz', 'ǆ': 'dz', 'ⓔ': 'e',
    'ｅ': 'e', 'è': 'e', 'é': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ễ': 'e', 'ể': 'e', 'ẽ': 'e', 'ē': 'e', 'ḕ': 'e', 'ḗ': 'e', 'ĕ': 'e', 'ė': 'e', 'ë': 'e', 'ẻ': 'e',
    'ě': 'e', 'ȅ': 'e', 'ȇ': 'e', 'ẹ': 'e', 'ệ': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ę': 'e', 'ḙ': 'e', 'ḛ': 'e', 'ɇ': 'e', 'ɛ': 'e', 'ǝ': 'e', 'ⓕ': 'f', 'ｆ': 'f', 'ḟ': 'f',
    'ƒ': 'f', 'ꝼ': 'f', 'ⓖ': 'g', 'ｇ': 'g', 'ǵ': 'g', 'ĝ': 'g', 'ḡ': 'g', 'ğ': 'g', 'ġ': 'g', 'ǧ': 'g', 'ģ': 'g', 'ǥ': 'g', 'ɠ': 'g', 'ꞡ': 'g', 'ᵹ': 'g', 'ꝿ': 'g',
    'ⓗ': 'h', 'ｈ': 'h', 'ĥ': 'h', 'ḣ': 'h', 'ḧ': 'h', 'ȟ': 'h', 'ḥ': 'h', 'ḩ': 'h', 'ḫ': 'h', 'ẖ': 'h', 'ħ': 'h', 'ⱨ': 'h', 'ⱶ': 'h', 'ɥ': 'h', 'ƕ': 'hv', 'ⓘ': 'i', 'ｉ': 'i',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ĩ': 'i', 'ī': 'i', 'ĭ': 'i', 'ï': 'i', 'ḯ': 'i', 'ỉ': 'i', 'ǐ': 'i', 'ȉ': 'i', 'ȋ': 'i', 'ị': 'i', 'į': 'i', 'ḭ': 'i', 'ɨ': 'i',
    'ı': 'i', 'ⓙ': 'j', 'ｊ': 'j', 'ĵ': 'j', 'ǰ': 'j', 'ɉ': 'j', 'ⓚ': 'k', 'ｋ': 'k', 'ḱ': 'k', 'ǩ': 'k', 'ḳ': 'k', 'ķ': 'k', 'ḵ': 'k', 'ƙ': 'k', 'ⱪ': 'k', 'ꝁ': 'k', 'ꝃ': 'k',
    'ꝅ': 'k', 'ꞣ': 'k', 'ⓛ': 'l', 'ｌ': 'l', 'ŀ': 'l', 'ĺ': 'l', 'ľ': 'l', 'ḷ': 'l', 'ḹ': 'l', 'ļ': 'l', 'ḽ': 'l', 'ḻ': 'l', 'ſ': 'l', 'ł': 'l', 'ƚ': 'l', 'ɫ': 'l', 'ⱡ': 'l',
    'ꝉ': 'l', 'ꞁ': 'l', 'ꝇ': 'l', 'ǉ': 'lj', 'ⓜ': 'm', 'ｍ': 'm', 'ḿ': 'm', 'ṁ': 'm', 'ṃ': 'm', 'ɱ': 'm', 'ɯ': 'm', 'ⓝ': 'n', 'ｎ': 'n', 'ǹ': 'n', 'ń': 'n', 'ñ': 'n', 'ṅ': 'n',
    'ň': 'n', 'ṇ': 'n', 'ņ': 'n', 'ṋ': 'n', 'ṉ': 'n', 'ƞ': 'n', 'ɲ': 'n', 'ŉ': 'n', 'ꞑ': 'n', 'ꞥ': 'n', 'ǌ': 'nj', 'ⓞ': 'o', 'ｏ': 'o', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'ồ': 'o',
    'ố': 'o', 'ỗ': 'o', 'ổ': 'o', 'õ': 'o', 'ṍ': 'o', 'ȭ': 'o', 'ṏ': 'o', 'ō': 'o', 'ṑ': 'o', 'ṓ': 'o', 'ŏ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ö': 'o', 'ȫ': 'o', 'ỏ': 'o', 'ő': 'o',
    'ǒ': 'o', 'ȍ': 'o', 'ȏ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ỡ': 'o', 'ở': 'o', 'ợ': 'o', 'ọ': 'o', 'ộ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'ɔ': 'o', 'ꝋ': 'o',
    'ꝍ': 'o', 'ɵ': 'o', 'œ': 'oe', 'ƣ': 'oi', 'ȣ': 'ou', 'ꝏ': 'oo', 'ⓟ': 'p', 'ｐ': 'p', 'ṕ': 'p', 'ṗ': 'p', 'ƥ': 'p', 'ᵽ': 'p', 'ꝑ': 'p', 'ꝓ': 'p', 'ꝕ': 'p', 'ⓠ': 'q',
    'ｑ': 'q', 'ɋ': 'q', 'ꝗ': 'q', 'ꝙ': 'q', 'ⓡ': 'r', 'ｒ': 'r', 'ŕ': 'r', 'ṙ': 'r', 'ř': 'r', 'ȑ': 'r', 'ȓ': 'r', 'ṛ': 'r', 'ṝ': 'r', 'ŗ': 'r', 'ṟ': 'r', 'ɍ': 'r', 'ɽ': 'r',
    'ꝛ': 'r', 'ꞧ': 'r', 'ꞃ': 'r', 'ⓢ': 's', 'ｓ': 's', 'ß': 's', 'ś': 's', 'ṥ': 's', 'ŝ': 's', 'ṡ': 's', 'š': 's', 'ṧ': 's', 'ṣ': 's', 'ṩ': 's', 'ș': 's', 'ş': 's', 'ȿ': 's',
    'ꞩ': 's', 'ꞅ': 's', 'ẛ': 's', 'ⓣ': 't', 'ｔ': 't', 'ṫ': 't', 'ẗ': 't', 'ť': 't', 'ṭ': 't', 'ț': 't', 'ţ': 't', 'ṱ': 't', 'ṯ': 't', 'ŧ': 't', 'ƭ': 't', 'ʈ': 't', 'ⱦ': 't',
    'ꞇ': 't', 'ꜩ': 'tz', 'ⓤ': 'u', 'ｕ': 'u', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ũ': 'u', 'ṹ': 'u', 'ū': 'u', 'ṻ': 'u', 'ŭ': 'u', 'ü': 'u', 'ǜ': 'u', 'ǘ': 'u', 'ǖ': 'u', 'ǚ': 'u',
    'ủ': 'u', 'ů': 'u', 'ű': 'u', 'ǔ': 'u', 'ȕ': 'u', 'ȗ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ữ': 'u', 'ử': 'u', 'ự': 'u', 'ụ': 'u', 'ṳ': 'u', 'ų': 'u', 'ṷ': 'u', 'ṵ': 'u',
    'ʉ': 'u', 'ⓥ': 'v', 'ｖ': 'v', 'ṽ': 'v', 'ṿ': 'v', 'ʋ': 'v', 'ꝟ': 'v', 'ʌ': 'v', 'ꝡ': 'vy', 'ⓦ': 'w', 'ｗ': 'w', 'ẁ': 'w', 'ẃ': 'w', 'ŵ': 'w', 'ẇ': 'w', 'ẅ': 'w', 'ẘ': 'w',
    'ẉ': 'w', 'ⱳ': 'w', 'ⓧ': 'x', 'ｘ': 'x', 'ẋ': 'x', 'ẍ': 'x', 'ⓨ': 'y', 'ｙ': 'y', 'ỳ': 'y', 'ý': 'y', 'ŷ': 'y', 'ỹ': 'y', 'ȳ': 'y', 'ẏ': 'y', 'ÿ': 'y', 'ỷ': 'y', 'ẙ': 'y',
    'ỵ': 'y', 'ƴ': 'y', 'ɏ': 'y', 'ỿ': 'y', 'ⓩ': 'z', 'ｚ': 'z', 'ź': 'z', 'ẑ': 'z', 'ż': 'z', 'ž': 'z', 'ẓ': 'z', 'ẕ': 'z', 'ƶ': 'z', 'ȥ': 'z', 'ɀ': 'z', 'ⱬ': 'z', 'ꝣ': 'z',
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ϊ': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ϋ': 'Υ', 'Ώ': 'Ω', 'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ϊ': 'ι', 'ΐ': 'ι', 'ό': 'ο', 'ύ': 'υ',
    'ϋ': 'υ', 'ΰ': 'υ', 'ώ': 'ω', 'ς': 'σ', '’': '\''
  };
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private permissionsCache: { [key: string]: boolean };
  private excludeComponents = [
    // 'AppComponent',
    // 'ECommerceComponent',
    // 'DashboardComponent',
  ];
  public env = environment;
  private previousUrl = null;
  private routeParams: { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] }[] = [];

  public locale$ = new BehaviorSubject<{ locale: string, skipUpdate?: boolean }>({ locale: 'vi-VN', skipUpdate: true });
  public languageLoaded$ = new BehaviorSubject<boolean>(false);
  public theme$ = new BehaviorSubject<{ theme: string, skipUpdate?: boolean }>(null);
  public timezone$: BehaviorSubject<{ timezone: string, skipUpdate?: boolean }> = new BehaviorSubject<{ timezone: string, skipUpdate?: boolean }>(null);
  public configReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // private loginInfo: LoginInfoModel;
  // loginInfoSubject: BehaviorSubject<LoginInfoModel> = new BehaviorSubject<LoginInfoModel>(null);
  // loginInfo$ = this.loginInfoSubject.asObservable();
  loginInfo: LoginInfoModel = new LoginInfoModel();

  distributeFileStoreCookieRequestSubject: BehaviorSubject<string> = new BehaviorSubject<string>('assets/images/nick.png');
  distributeFileStoreCookieRequest$ = this.distributeFileStoreCookieRequestSubject.asObservable();

  componentChangeSubject: BehaviorSubject<{ componentName: string, state: boolean, data?: any }> = new BehaviorSubject<{ componentName: string, state: boolean, data?: any }>({ componentName: '', state: false });
  componentChange$: Observable<{ componentName: string, state: boolean, data?: any }> = this.componentChangeSubject.asObservable();

  pushHeaderActionControlListSubject: BehaviorSubject<ActionControl[]> = new BehaviorSubject<ActionControl[]>([]);
  pushHeaderActionControlList$: Observable<ActionControl[]> = this.pushHeaderActionControlListSubject.asObservable();
  // popHeaderActionControlListSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  // popHeaderActionControlList$: Observable<void> = this.popHeaderActionControlListSubject.asObservable();

  popHeaderActionControlList$: Subject<void> = new Subject<void>();
  clearHeaderActionControlList$: Subject<void> = new Subject<void>();


  authenticatedSubject = new BehaviorSubject<LoginInfoModel>(null);
  authenticated$ = this.authenticatedSubject.asObservable();

  menuSidebar: NbSidebarComponent;
  mobileSidebar: NbSidebarComponent;

  loginInfo$ = new BehaviorSubject<LoginInfoModel>(null);
  private mainSocket: MySocket;
  mainSocketInfo$ = new BehaviorSubject<{ protocol?: string, domain: string; port: number; url?: string }>(null);

  taxList: TaxModel[];
  unitList: UnitModel[];

  // localStorageAvailable$: BehaviorSubject<WindowLocalStorage> = new BehaviorSubject<WindowLocalStorage>(null);

  notificationMessage: BehaviorSubject<any>;

  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public router: Router,
    public _location: Location,
    public sidebarService: NbSidebarService,
    public translate: TranslateService,
    public currencyPipe: CurrencyPipe,
    public iconsLibrary: NbIconLibraries,
    public datePipe: DatePipe,
    private themeService: NbThemeService,
    // public messagingService: NotificationService,
    private toastrService: NbToastrService,
    private mobileService: MobileAppService,
    public activeRoute: ActivatedRoute,
  ) {
    // this.authService.onAuthenticationChange().subscribe(state => {
    //   if (state) {
    //     this.loadPermissionToCache();
    //   }
    // });

    /** Load langCode */
    translate.addLangs(['en-US', 'vi-VN']);
    translate.setDefaultLang('en-US');
    moment.locale('en');
    // translate.setDefaultLang('vi-VN');
    this.locale$.subscribe(info => {
      if (info) {
        this.languageLoaded$.next(false);
        translate.use(info.locale).pipe(take(1)).toPromise().then(() => setTimeout(() => this.languageLoaded$.next(true), 1000));
        localStorage.setItem('configuration.locale', info.locale);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-configs', {}, [{ LocaleCode: info.locale }]).then(rs => {
            console.log('Update locale success');
          });
        }
        moment.locale(info.locale);
      }
    });
    this.theme$.subscribe(info => {
      if (info) {
        // translate.use(info.theme);
        localStorage.setItem('configuration.theme', info.theme);
        this.themeService.changeTheme(info.theme);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-configs', {}, [{ Theme: info.theme }]).then(rs => {
            console.log('Update theme success');
          });
        }
      }
    });
    this.timezone$.subscribe(info => {
      if (info) {
        localStorage.setItem('configuration.timezone', info.timezone);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-locales', {}, [{ Timezone: info.timezone }]).then(rs => {
            console.log('Update timezone success');
          });
        }
      }
    });

    // const $this = this;
    // (function checkLocalStorageOnline() {
    //   if (localStorage) {
    //     let locale = localStorage.getItem('configuration.locale');
    //     if (!locale) {
    //       const browserLangCode = translate.getBrowserLang();
    //       locale = browserLangCode.match(/en|vi/) ? browserLangCode : 'en-US';
    //     }
    //     // $this.locale$.next({locale: locale, skipUpdate: true});
    //     translate.use(locale);
    //   } else {
    //     setTimeout(() => {
    //       checkLocalStorageOnline();
    //     }, 100);
    //   }
    // })();
    /** End Load langCode */

    // Init main socket
    this.apiService.getPromise<{ domain: string, port: number, protocol?: string, url?: string }>('/chat/services/connect-info', {}).then(rs => {
      rs.url = `${rs.protocol || 'https'}://${rs.domain}:${rs.port}`;
      this.mainSocketInfo$.next(rs);
      // this.mainSocket = new MySocket(this.mainSocketInfo.url);
      this.initMainSocket().then(sc => {
        // this.mainSocket = sc;
        // sc.on('Helpdesk_Had_New_Ticket').subscribe();
        console.info('Conntect to local chat server success');
      });

    }).catch(e => console.error(e));

    this.authService.onAuthenticationChange().subscribe(async state => {
      console.info('Authentication change with state ' + state);
      if (state) {
        // Get login info
        this.apiService.get<LoginInfoModel>('/user/login/info', {}, loginInfo => {
          // this.loginInfoSubject.next(loginInfo);
          this.loginInfo = loginInfo;
          this.loginInfo$.next(loginInfo);
          this.authenticatedSubject.next(loginInfo);
          // this.cookieService.set(loginInfo.distributeFileStore.name, loginInfo.distributeFileStore.value, null, '/', loginInfo.distributeFileStore.domain.replace(/https?:\/\/\./g, ''));
          // this.cookieService.set(loginInfo.distributeFileStore.name, loginInfo.distributeFileStore.value, null, null, loginInfo.distributeFileStore.domain);
          if (loginInfo.distribution && loginInfo.distribution.cookie && loginInfo.distribution.fileStores) {
            const fileStoreCode = Object.keys(loginInfo.distribution.fileStores).pop();
            const firstFileStore = loginInfo.distribution.fileStores[fileStoreCode];
            this.distributeFileStoreCookieRequestSubject.next(firstFileStore.requestCookieUrl + '&time=' + (Date.now()));
          }
          const locale = loginInfo['configuration']['locale'] || 'vi-VN';
          const timezone = loginInfo['configuration']['timezone'] || 'America/Los_Angeles';
          const theme = loginInfo['configuration']['theme'] || 'default';
          this.locale$.next({ locale, skipUpdate: true });
          this.timezone$.next({ timezone, skipUpdate: true });
          this.theme$.next({ theme, skipUpdate: true });
          // localStorage.setItem('configuration.locale', locale);
          // localStorage.setItem('configuration.timezone', timezone);

          // Re-register main socket on login changed
          this.mainSocket.emit('register', {
            token: this.apiService.getAccessToken(),
            user: {
              id: this.loginInfo.user.Code,
              name: this.loginInfo.user.Name,
            },
          }).then(rs2 => {
            console.log('Main socket registerd');
            console.log(rs2);
          });

        });

        // tax cache
        this.takeUntil('load_tax_unit_list', 3000).then(async rs => {
          this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
            tax['id'] = tax.Code;
            tax['text'] = tax.Name;
            return tax;
          });
          this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
            tax['id'] = tax.Code;
            tax['text'] = tax.Name;
            return tax;
          });
        });
      } else {
        // this.loginInfoSubject.next(new LoginInfoModel());
        // this.unregisterDevice();
        this.clearCache();
      }
    });

    // Subcribe authorized event
    this.apiService.unauthorizied$.subscribe(info => {
      if (info) {
        this.setPreviousUrl(info.previousUrl);
      }
    });
  }

  /**
   * Wait for language loaded
   * @return Promise<boolean>
   */
  async waitForLanguageLoaded(): Promise<boolean> {
    return this.languageLoaded$.pipe(filter(f => f), take(1)).toPromise();
  }

  async getMainSocket(): Promise<MySocket> {
    if (this.mainSocket) {
      return this.mainSocket;
    }
    return this.initMainSocket();
  }

  async initMainSocket(): Promise<MySocket> {
    const mainSocketInfo = await this.mainSocketInfo$.pipe(filter(f => !!f), take(1)).toPromise();
    if (this.mainSocket) {
      return this.mainSocket.onConnect$.pipe(filter(f => f), take(1)).toPromise().then(rs => this.mainSocket);
    }
    this.mainSocket = new MySocket(mainSocketInfo.url);
    // return new Promise<MySocket>((resolve, reject) => {

    // Auto register when main socket reconnected
    this.mainSocket.onReconnect$.subscribe(rs => {
      this.mainSocket.emit('register', {
        token: this.apiService.getAccessToken(),
        user: {
          id: this.loginInfo.user.Code,
          name: this.loginInfo.user.Name,
        },
      }).then(rs2 => {
        console.log('Main socket registerd');
        console.log(rs2);
      });
    });

    return this.mainSocket.onConnect$.pipe(filter(f => f), take(1)).toPromise().then(rs => {
      // resolve(this.mainSocket);
      return this.mainSocket.emit<{ socketServerId: string }>('register', {
        // token: this.apiService.getAccessToken(),
        // user: {
        //   id: this.loginInfo.user.Code,
        //   name: this.loginInfo.user.Name,
        // },
      }).then(rs2 => {
        console.log('Main socket registerd');
        console.log(rs2);
        // Store socket service id
        this.mainSocket.socketServerId$.next(rs2.socketServerId);
        return this.mainSocket;
      }).catch((err: { socketServerId: string }) => {
        if (err && err.socketServerId) {
          // Store socket service id
          this.mainSocket.socketServerId$.next(err.socketServerId);
        }
        return this.mainSocket;
      });
      // if (subscription) {
      //   subscription.unsubscribe();
      // }
    });
    // });

  }

  getMenuTree(callback: (menuTree: NbMenuItem[]) => void) {
    this.apiService.get<NbMenuItem[]>('/menu/menu-items', { limit: 999999, restrictPms: true, isTree: true, includeUsers: true, select: 'id=>Code,group=>Group,title,link=>Link=>Title,icon=>Icon,children=>Children' }, list => {
      callback(list);
    });
  }

  get location() {
    return this._location;
  }

  setPreviousUrl(url: string) {
    this.previousUrl = url;
  }

  goback() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
      this.previousUrl = null;
    } else {
      this._location.back();
      // this.router.navigate(['/']);
    }

  }

  goToPrevious() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
      this.previousUrl = null;
    } else {
      // this._location.back();
      this.router.navigate(['/']);
    }

  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  getRouteParams(id: number): { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] } {
    const param = this.routeParams.splice(id - 1, 1);
    return param ? param[0] : null;
  }

  gotoNotification(params: { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] }): void {
    this.routeParams.push(params);
    this.router.navigate(['/notification', this.routeParams.length]);
  }

  // privegetPermissions() {
  //   if (!this.permissionsCache) {
  //     this.loadPermissionToCache(() => {

  //     });
  //   }
  //   return this.permissionsCache;
  // }

  private loadPermissionToCache(callback?: () => void) {
    if (!this.permissionsCache || Object.keys(this.permissionsCache).length === 0) {
      this.apiService.get<{ Component: string, Path: string, Permission: string, State: number }[]>('/user/permissions', { limi: 99999, loadPermissionsForLoggedUser: true }, results => {
        this.permissionsCache = {};
        results.map(item => {
          if (item.Component)
            this.permissionsCache[`${item.Component}_${item.Permission}`] = item.State > 0 ? true : false;
        });
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }

  checkPermission(componentName: string, permission: string, callback: (result: boolean) => void) {
    // path = path.replace(/^\//g, '').replace(/\:id/g, '').replace(/\/$/g, '');
    // const componentName = component['componentName'];
    if (this.excludeComponents.indexOf(componentName) < 0) {
      this.loadPermissionToCache(() => {
        callback(typeof this.permissionsCache[`${componentName}_${permission}`] === 'undefined' ? false : this.permissionsCache[`${componentName}_${permission}`]);
      });
    }
    return callback(true);
  }

  clearCache() {
    this.permissionsCache = null;
  }

  /** Dialog */
  showDiaplog(title: string, content: string, buttons: { label: string, icon?: string, status?: string, action?: () => void }[], onClose?: () => void) {
    return this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: title,
        content: content,
        actions: buttons,
        onClose: () => {
          onClose && onClose();
        },
      },
    });
  }

  openDialog<T>(content: Type<T> | TemplateRef<T>, userConfig?: Partial<NbDialogConfig<Partial<T> | string>>): NbDialogRef<T> {
    setTimeout(() => {
      // tslint:disable-next-line: ban
      $('html').css({ top: 0 });
    }, 50);
    let dialogLoading = null;
    if (userConfig.context) {
      const afterInit = userConfig.context['onAfterInit'];
      userConfig.context['onAfterInit'] = (component?: BaseComponent, type?: string) => {
        afterInit && afterInit(component, type);
        setTimeout(() => {
          dialogLoading && dialogLoading.fadeOut(300);
        }, 300);
      }
    }
    const dialogRef = this.dialogService.open<T>(content, userConfig);
    if (dialogRef['overlayRef'] && dialogRef['overlayRef']['_pane'] && userConfig.context['showLoadinng']) {

      const panel = $(dialogRef['overlayRef']['_pane']);
      dialogLoading = $('\
        <div class="cube" style="left: 50%; right: initial; bottom:initial; top: 50%">\
          <div class="sides">\
            <div class="top"></div>\
            <div class="right"></div>\
            <div class="bottom"></div>\
            <div class="left"></div>\
            <div class="front"></div>\
            <div class="back"></div>\
          </div>\
        </div>');

      panel.find('nb-dialog-container').append(dialogLoading);
    }

    return dialogRef;
  }

  /** Dialog */
  // openRelativeVoucherDiaplog(title: string, content: string, buttons: { label: string, icon?: string, status?: string, action?: () => void }[]) {
  //   return this.dialogService.open(ShowcaseDialogComponent, {
  //     context: {
  //       title: title,
  //       content: content,
  //       actions: buttons,
  //     },
  //   });
  // }

  resumeDialog(dialogRef: NbDialogRef<BaseComponent> | any, config?: { events: { onDialogClose?: () => void, onDialogChoose?: (selectItems: any[]) => void } }): boolean {
    if (dialogRef.show) {
      dialogRef.show(config);
    }
    return true;
  }
  /** End dialog */

  convertUnicodeToNormal(text: string) {
    return text.replace(/[^\u0000-\u007E]/g, (a) => {
      return this.DIACRITICS[a] || a;
    }).replace(/[^a-z0-9 ]+/ig, '');
  }

  smartFilter(value: string, query: string) {
    return (new RegExp(this.convertUnicodeToNormal(query).toLowerCase().replace(/\s+/g, '.*'), 'ig')).test(this.convertUnicodeToNormal(value));
  }

  getFullRoutePath(route: ActivatedRouteSnapshot): string {
    /** The url we are going to return */
    if (route.routeConfig) {
      const url = route.routeConfig.path;
      console.info('[router-reuse] returning url', url);

      return route.pathFromRoot.filter(v => v.routeConfig && v.routeConfig.path).map(v => v.routeConfig.path ? v.routeConfig.path : '').join('/');
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  pushLoggedIn(state: boolean) {
    this.isLoggedIn$.next(state);
  }

  convertOptionList(list: any[], idKey: string, labelKey: string) {
    return list.map(item => {
      item['id'] = item[idKey] = item[idKey] ? item[idKey] : 'undefined';
      item['text'] = item[labelKey] = item[labelKey] ? item[labelKey] : 'undefined';

      return item;
    });
  }

  private takeUltilCount = {};
  private takeUltilPastCount = {};
  async takeUntil(context: string, delay: number, callback?: () => void): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      if (delay === 0) {
        // if (callback) callback(); else return;
        resolve(true);
        return;
      }
      if (!this.takeUltilCount[context]) this.takeUltilCount[context] = 0;
      this.takeUltilCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeUltilPastCount[context] = takeCount;
        }, delay);
      })(this.takeUltilCount[context]);
      setTimeout(() => {
        if (this.takeUltilPastCount[context] === this.takeUltilCount[context]) {
          // callback();
          resolve(true);
        }
      }, delay);
    });
    if (callback) {
      callback();
    }
    return result;
  }

  private takeOncePastCount = {};
  private takeOnceCount = {};
  async takeOnce(context: string, delay: number): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      // resolve(true);
      // if (delay === 0) {
      //   resolve(true);
      //   return;
      // }
      if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
        resolve(true);
      }
      if (!this.takeOnceCount[context]) { this.takeOnceCount[context] = 0; }
      this.takeOnceCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeOncePastCount[context] = takeCount;
        }, delay);
      })(this.takeOnceCount[context]);
      setTimeout(() => {
        if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
          this.takeOncePastCount[context] = null;
          this.takeOnceCount[context] = null;
          // resolve(true);
        }
      }, delay);
    });
    return result;
  }

  generatePassword(length: number): string {
    return Array(length)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(x => x[Math.floor(Math.random() * x.length)]).join('');
  }

  pushHeaderActionControlList(actionControlList: ActionControl[]) {
    this.pushHeaderActionControlListSubject.next(actionControlList.map(control => ({ ...control, size: 'small' })));
  }
  popHeaderActionControlList() {
    this.popHeaderActionControlList$.next();
  }
  clearHeaderActionControlList() {
    this.clearHeaderActionControlList$.next();
  }

  openMobileSidebar() {
    if (this.menuSidebar && this.mobileSidebar) {
      if (this.menuSidebar.expanded) {
        this.sidebarService.toggle(true, 'menu-sidebar');
      }
      if (this.mobileSidebar.collapsed) {
        this.sidebarService.toggle(true, 'chat-sidebar');
      }
    } else {
      console.info('Sidebar was not ready !!!');
    }
  }

  // openMenuSidebar() {

  // }

  getBaseUrl() {
    return `${window.location.origin}/${environment.basePath}`;
  }

  getApiUrl() {
    if (/^http/i.test(this.env.api.baseUrl)) {
      return this.env.api.baseUrl;
    }
    return window.location.origin + this.env.api.baseUrl;
  }

  textTitleCase(text: string): string {
    const sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    // document.write(sentence.join(' '));
    return sentence.join(' ');
  }

  textTransform(text: string, transform: 'title' | 'upper' | 'lower' | 'head-title'): string {
    switch (transform) {
      case 'title':
        return this.textTitleCase(text);
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'head-title':
        return text.replace(/^./, text.charAt(0).toUpperCase());
      default: return text;
    }
  }

  translateText(key: string | Array<string>, interpolateParams?: Object, transform?: 'title' | 'upper' | 'lower' | 'head-title') {
    return this.textTransform(this.translate.instant(key, interpolateParams).trim(), transform ? transform : 'head-title');
  }

  getCurrentLoaleDataset() {
    const currentLocaleCode = this.translate.currentLang;
    if (currentLocaleCode) {
      switch (currentLocaleCode) {
        case 'vi-VN': return localeVi;
        case 'en-US': return localeEn;
      }
    }
    return null;
  }

  getCurrentCurrencySymbol() {
    return getCurrencySymbol('VND', 'narrow', this.translate.currentLang);
  }

  getCurrencyMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: ' ' + getCurrencySymbol('VND', 'narrow', this.translate.currentLang), thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getNumberMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: '', thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getTaxMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: '%', thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getObjectId(obj: any, idName?: string) {
    return obj && typeof obj[idName || 'id'] !== 'undefined' ? obj[idName || 'id'] : obj;
  }

  getObjectText(obj: any, textName?: string) {
    return obj && typeof obj[textName || 'text'] !== 'undefined' ? obj[textName || 'text'] : obj;
  }

  currencyTransform(value: any, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null {
    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
  }

  async registerDevice(option?: { pushRegId?: string }) {
    return this.apiService.postPromise<DeviceModel>('/device/devices/', { registerDevice: true }, {
      RegisterId: option && option.pushRegId || undefined,
      Uuid: this.getDeviceUuid() + this.env.bundleId,
      Name: 'browser',
      Platform: 'browser',
      Version: '1.0',
      SenderIdentification: this.env.firebase.messagingSenderId,
      Owner: this.loginInfo?.user?.Name,
      Mode: this.env.production ? 'Production' : 'Development',
      BundleId: this.env.bundleId,
      AppVersion: this.env.version,
    }).then(rs => {
      console.info('Device register success', rs);
      return rs;
    }).catch(err => {
      console.error('Device register error', err);
      return Promise.reject(err);
    });
  }

  async unregisterDevice(option?: { pushRegId?: string }) {
    // return this.messagingService.getToken().then(token => {
    return this.apiService.putPromise<DeviceModel>('/device/devices/', { unregisterDevice: true }, {
      Uuid: this.getDeviceUuid() + this.env.bundleId,
    }).then(rs => {
      console.info('Device unregister success', rs);
      //   this.messagingService.deleteToken(token);
      return rs;
    }).catch(err => {
      console.error('Device unregister error', err);
      return Promise.reject(err);
      // });
    });

  }

  /** Auto generate device uuid */
  getDeviceUuid() {
    let deviceUuid = localStorage.getItem('device_uuid');
    if (deviceUuid) {
      return deviceUuid;
    }
    deviceUuid = uuidv4();
    localStorage.setItem('device_uuid', deviceUuid);
    return deviceUuid;
  }

  openTicketForm(id: { Code?: string, UuidIndex?: string }) {
    this.openDialog<QuickTicketFormComponent>(QuickTicketFormComponent, {
      context: {
        showLoadinng: false,
        inputMode: 'dialog',
        ticketCode: id.Code,
        uuidIndex: id.UuidIndex,
        onDialogSave: (newData: HelpdeskTicketModel[]) => {
        },
        onDialogClose: () => {
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  voucherPrintConponentTypeIndex = {
    'SALES': SalesVoucherPrintComponent,
    'PURCHASE': PurchaseVoucherPrintComponent,
    'PURCHASEORDER': PurchaseOrderVoucherPrintComponent,
    'GOODSDELIVERY': WarehouseGoodsDeliveryNotePrintComponent,
    'GOODSRECEIPT': WarehouseGoodsReceiptNotePrintComponent,
    'RECEIPT': CashReceiptVoucherPrintComponent,
    'PAYMENT': CashPaymentVoucherPrintComponent,
    'PRICEREPORT': SalesPriceReportPrintComponent,
    'DEPLOYMENT': DeploymentVoucherPrintComponent,
    'OTHERBUSINESSVOUCHER': AccountingOtherBusinessVoucherPrintComponent,
    'SERVICEBYCYCLE': CommerceServiceByCycleFormComponent,
  };
  previewVoucher<M>(type: string, relativeVocher: string, onClose?: (data: M) => void) {
    if (this.voucherPrintConponentTypeIndex[type]) {
      this.openDialog(this.voucherPrintConponentTypeIndex[type], {
        context: {
          showLoadinng: true,
          title: 'Xem trước',
          id: [this.getObjectId(relativeVocher)],
          inputMode: 'dialog',
          mode: 'print',
          inputId: [this.getObjectId(relativeVocher)],
          // data: data,
          idKey: ['Code'],
          // approvedConfirm: true,
          onClose: (data: M) => {
            onClose && onClose(data);
          },
        },
      });
      return true;
    }
    return false;
  }
}
