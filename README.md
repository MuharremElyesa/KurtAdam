# Geşiltiricilere yönelik

### Dosya Yapısı
- app -> Ana uygulama klasörü

    * controllers -> klasörü, uygulamanın kontrolcü sınıflarını içerir ve bu sınıflar uygulamanın iş mantığını yönetir. views ile model arasındaki bağlantıyı kurar.

    * models -> klasörü, veritabanı işlemleri ve veri manipülasyonu için model sınıflarını içerir.

    * views -> klasörü, kullanıcı arayüzünün şablonlarını içerir (örneğin EJS veya Pug gibi şablon motorları kullanabilirsiniz. Biz bu projede pug kullanıyoruz).

- public -> klasörü, istemcilere erişilebilir dosyaları içerir. CSS dosyaları, JavaScript dosyaları ve resimler gibi istemci tarafı kaynakları burada bulunur.

- config -> klasörü, uygulama yapılandırma dosyalarını içerir (config.js, database.js, auth.js gibi).

- server.js -> Node.js sunucusunu başlatan ana uygulama dosyasıdır.

## 🔐 Firebase Service Account

Bu proje, Firebase Admin SDK kullanmaktadır. Gerekli `service-account-key.json` dosyasını kendiniz oluşturmalısınız.

### 🛠️ Nasıl Yapılır?

1. Firebase Console'a gidin: https://console.firebase.google.com
2. Projenizi seçin.
3. Sol menüden **"Project Settings"** > **"Service accounts"** sekmesine gidin.
4. **"Generate new private key"** butonuna tıklayın.
5. İndirilen JSON dosyasını proje kök dizinine `service-account-key.json` olarak yerleştirin.

> NOT: Bu dosya `.gitignore`'da tanımlı olmalı ve hiçbir şekilde repoya push edilmemelidir.