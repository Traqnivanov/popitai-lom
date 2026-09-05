from pathlib import Path
p=Path('prototype-final-ia/prototype-marketplace-views.js')
s=p.read_text(encoding='utf-8')
lines=s.splitlines()
for i,line in enumerate(lines):
    if line.strip().startswith('const active=`<div class="result-list">'):
        lines[i]="    const seekPaint=`#results?context=${encodeURIComponent('Услуги')}&group=${encodeURIComponent('Шпакловка и боядисване')}&detail=listing&owner=Listings&type=${encodeURIComponent('Търси')}`;"
        lines.insert(i+1,"    const active=`<div class=\"result-list\">${demoRow('Предлагам ВиК услуги в Лом','Ремонти, монтаж и аварийни посещения.','Предлагам услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Търся изпълнител за шпакловка и боядисване','Търсене на местен изпълнител за ремонтна задача.','Търся изпълнител',seekPaint,'Лом')}</div>`;")
        break
else:
    raise SystemExit('active row marker not found')
p.write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('staging syntax patch fixed')
