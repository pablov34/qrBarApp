Sobre la carpeta que tengo la app: cmd -> cd C:\Workspace\Hybrid\qrBar

npm install -g ionic cordova
ionic cordova plugin add phonegap-plugin-barcodescanner
npm install --save @ionic-native/barcode-scanner
ionic cordova plugin add cordova-plugin-x-toast
npm install --save @ionic-native/toast
Lo instala solo supuestamente a este paquete "@ionic/app-scripts"
npm install --save @ionic/storage
ionic cordova plugin add cordova-plugin-local-notification
npm install --save @ionic-native/local-notifications
ionic cordova plugin add cordova-plugin-fcm-with-dependecy-updated
npm install --save @ionic-native/fcm
ionic cordova plugin add cordova-plugin-screen-orientation
npm install --save @ionic-native/screen-orientation
cordova plugin add cordova-plugin-splashscreen
npm install ion-multi-picker --save
ionic cordova plugin add cordova-plugin-network-information
npm install --save @ionic-native/network
ionic serve --lab (Prueba local)
ionic serve (Prueba local)

Prueba en dispositivo
adb devices
ionic cordova platform rm android
ionic cordova platform add android
ionic cordova run android o ionic cordova run ios