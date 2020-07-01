import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PedidosPage } from '../pages/pedidos/pedidos';
import { HeaderPage } from '../pages/header/header';
import { BaresPage } from '../pages/bares/bares';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ReservasPage } from '../pages/reservas/reservas';
import { MiCuentaPage } from '../pages/micuenta/micuenta';
import { NuevoPedidoOrderToRetreatPage } from '../pages/nuevopedidoordertoretreat/nuevopedidoordertoretreat';
import { NuevoPedidoOrderQrPage} from '../pages/nuevopedidoorderqr/nuevopedidoorderqr';
import { NuevoPedidoOrderWQrPage } from '../pages/nuevopedidoorderwqr/nuevopedidoorderwqr';
import { InitPage } from '../pages/init/init';
import { LoginPage } from '../pages/login/login';
import { RegistroPage } from '../pages/registro/registro';
import { NuevaReservaPage } from '../pages/nuevareserva/nuevareserva';
import { OlvidaContrasenaPage } from '../pages/olvidacontrasena/olvidacontrasena';
import { TermsAndConditionsPage } from '../pages/termsandconditions/termsandconditions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BarService } from '../providers/bar-service/bar-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FCM } from '@ionic-native/fcm';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MultiPickerModule } from 'ion-multi-picker';
import { Network } from '@ionic-native/network';

@NgModule({
  declarations: [
    MyApp,
    HeaderPage,
    PedidosPage,
    BaresPage,
    HomePage,
    TabsPage,
    ReservasPage,
    NuevoPedidoOrderToRetreatPage,
    NuevoPedidoOrderQrPage,
    NuevoPedidoOrderWQrPage,
    MiCuentaPage,
    InitPage,
    LoginPage,
    RegistroPage,
    NuevaReservaPage,
    OlvidaContrasenaPage,
    TermsAndConditionsPage
  ],
  imports: [
    BrowserModule,   
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    MultiPickerModule,
    IonicStorageModule.forRoot({
      name: '__qrBardb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HeaderPage,
    PedidosPage,
    BaresPage,
    HomePage,
    TabsPage,
    ReservasPage,
    NuevoPedidoOrderToRetreatPage,
    NuevoPedidoOrderQrPage,
    NuevoPedidoOrderWQrPage,
    MiCuentaPage,
    InitPage,
    LoginPage,
    RegistroPage,
    NuevaReservaPage,
    OlvidaContrasenaPage,
    TermsAndConditionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Toast,
    DataServiceProvider,
    WheelSelector,
    LocalNotifications,
    FCM,
    ScreenOrientation,
    MultiPickerModule,
    Network
  ]
})
export class AppModule {}
