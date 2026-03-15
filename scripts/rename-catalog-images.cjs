const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images');

const renames = [
  ['1. А.А. Трискорни. Надгробие Таировой Марфы Савельевны..jpg', '1_triskorni_tairova.jpg'],
  ['2.Я.И. Земмельгак. Надгробие Попова Алексея Семеновича..jpg', '2_zemmelgak_popov.jpg'],
  ['3.И.П. Мартос. Надгробие графа Лазарева Артемия Ивановича..jpg', '3_martos_lazarev.jpg'],
  ['4. Надгробие_Е.С. Куракиной.jpg', '4_martos_kurakina_elena.jpg'],
  ['5. Надгробие Куракиной Екатерины Андреевны..jpg', '5_kurakina_skorbjashhij_genij.jpg'],
  ['6. Фрагмент надгробия Турчанинова Алексея Федоровича..jpg', '6_turchaninov_5_figur.jpg'],
  ['7. Фрагмент надгробия Турчанинова Алексея Федоровича..jpg', '7_turchaninov_1_zhenskaja_3_junoshi.jpg'],
  ['8. Фрагмент надгробия Козловского Михаила Ивановича.  (3).jpg', '8_demut_kozlovskij.jpg'],
  ['9.Волкова. Медальон.jpg', '9_volkova_medalon.jpg'],
  ['10. Песочные часы.JPG', '10_pesochnye_chasy.jpg'],
  ['11. Жернаков.JPG', '11_zhernakov.jpg'],
];

for (const [oldName, newName] of renames) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('OK:', oldName, '->', newName);
  } else {
    console.log('SKIP (not found):', oldName);
  }
}
