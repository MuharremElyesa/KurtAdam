# Geşiltiricilere yönelik

### Dosya Yapısı
- app -> Ana uygulama klasörü

    * controllers -> klasörü, uygulamanın kontrolcü sınıflarını içerir ve bu sınıflar uygulamanın iş mantığını yönetir. views ile model arasındaki bağlantıyı kurar.

    * models -> klasörü, veritabanı işlemleri ve veri manipülasyonu için model sınıflarını içerir.

    * views -> klasörü, kullanıcı arayüzünün şablonlarını içerir (örneğin EJS veya Pug gibi şablon motorları kullanabilirsiniz. Biz bu projede pug kullanıyoruz).

- public -> klasörü, istemcilere erişilebilir dosyaları içerir. CSS dosyaları, JavaScript dosyaları ve resimler gibi istemci tarafı kaynakları burada bulunur.

- config -> klasörü, uygulama yapılandırma dosyalarını içerir (config.js, database.js, auth.js gibi).

- server.js -> Node.js sunucusunu başlatan ana uygulama dosyasıdır.