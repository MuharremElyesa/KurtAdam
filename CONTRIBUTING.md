# KATKIDA BULUNMA REHBERİ

Öncelikle projemize katkı sağlamak için gösterdiğiniz ilgiden dolayı teşekkür ederiz! Bu proje açık kaynaklıdır ve katkılarınız çok değerli.

Aşağıdaki adımları izleyerek projeye katkı sağlayabilirsiniz.

---

## Başlarken

* **Fork Etme**

   Projemizi katkı sağlamak için önce [repo'yu fork'la](https://github.com/MuharremElyesa/KurtAdam) kendi GitHub hesabına kopyala.
   
* **Kendi Dalını Oluşturma**
   
   Projeyi fork ettikten sonra, kendi bilgisayarında yeni bir dal (`branch`) oluştur.

   main dalına doğrudan push yapmaktan kaçının.
   
* **Geliştirme Yapma**

   Projemiz veritabanı olarak firebase'in realtime database'ini kullanıyor. Projeyi çalıştırabilmeniz için firebase console'da hesap oluşturup projeye bağlamanız gerekmektedir. Ücretsiz sürümde kullanabilirsiniz. Projemizde bulunan "config" klasörünün içerisinde bulunan "service-account-key.json" dosyasını oluşturmuş olduğunuz firebase hesabınızda size verilen anahtarları doldurup, "config/firebase-connect.js" yolunda bulunan dosyaya da realtime database'nizin url'sini yapıştırarak projeyi çalıştırabilirsiniz. Bunu yaptıktan sonra konsolda "npm start" komutu ile projeyi ayağa kaldırabilirsiniz.

   Projemiz normal şartlarda "localhost:7777" portunda çalışır. Eğer çalıştırmak istediğinizde o port dolu olduğu için hata alıyorsanız, kök dizinde bulunan "server.js" dosyasını düzenleyerek başka port yazarak çalıştırabilirsiniz. Onun haricinde IP hakkında vereceğim son bilgi de, "/puplic/js/global-socket-io(client).js" dosyası olacak. Projemizde client ile serveri socket.io ile bağladık. Client tarafındaki bağlantı dosyasıda vermiş olduğum yolda bulunuyor. O kısımda bir hata alırsanız ayar dosyası o şekilde. Projemizde bazı değişkenleri bir dosyada tuttuk ve o dosyadan ulaştık. Yolu şu şekilde: "config/global-variables.js". Bir çok ayar orada bulunuyor.

   Bu ayarlamaları yaptığınızda artık projenizin çalışır vaziyette olması gerekiyor. Artık geliştirme yapmaya başlayabilirsiniz. Ek olarak projeyi geliştirirken ana dizinde notlar.yaml isminde bir dosya göreceksiniz. (Neden yaml diye sorarsanız bende bilmiyom canım istedi :D). O dosyayı hep not almak için kullanmıştım. Gelecekte eklemek istediğim şeyler de içerisinde mevcut. Ordan da geliştirme fikirleri alıp yazmaya başlayabilirsiniz. Katkılarınız için teşekkürler. 

* **Pull Request (PR) Gönderme**

   - PR Açma:
      Kodunuzun hazır olduğunu düşündüğünüzde, fork ettiğiniz reposu üzerinden yeni bir Pull Request açın. main dalına doğrudan push yapmayı engellemek için PR gereklidir.

   - Açıklama Yazma:
      - PR açıklamanızda aşağıdaki bilgileri verin:

      - Yaptığınız değişikliklerin kısa özeti.

      - Bu değişikliğin neden önemli olduğu.

      - Varsa eklediğiniz yeni özelliklerin ve düzeltmelerin listesi.

_Notlar:_

  * _Eğer oturum açmak için ya da veritabanı için kendi hesabınızı oluşturursanız, bu servislere bağlanmak ya da herhangi bir işlem yapmak için kullandığınız özel secret keylerinizi depoya yüklemeyiniz. Güvenlik açığı oluşturur._
