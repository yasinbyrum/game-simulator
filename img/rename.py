import os

def main():
    print("🧹 Dosya ismi temizliği (Boşluk ve Tire) başlıyor...")
    files = os.listdir('.')
    count = 0
    
    for filename in files:
        # Sadece resim dosyalarına bak
        if not (filename.endswith(".png") or filename.endswith(".jpg")):
            continue
            
        old_name = filename
        
        # 1. "miami_ beach" gibi durumları düzelt
        new_name = filename.replace("_ ", "_").replace(" _", "_")
        # 2. Tireleri alt çizgi yap (power-up -> power_up)
        new_name = new_name.replace("-", "_")
        # 3. Boşlukları alt çizgi yap
        new_name = new_name.replace(" ", "_")
        # 4. Hepsi küçük harf
        new_name = new_name.lower()

        if old_name != new_name:
            try:
                if not os.path.exists(new_name):
                    os.rename(old_name, new_name)
                    print(f"✅ {old_name} -> {new_name}")
                    count += 1
                else:
                    print(f"⚠️ {new_name} zaten var. {old_name} siliniyor (Duplicate).")
                    os.remove(old_name) # Eski hatalı ismi sil, yenisi zaten var
            except Exception as e:
                print(f"❌ Hata: {filename} - {e}")

    print(f"\n🎉 Toplam {count} dosya ismi standartlaştırıldı.")
    input("Çıkmak için Enter...")

if __name__ == "__main__":
    main()