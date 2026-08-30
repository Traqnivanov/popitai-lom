#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
MANIFEST=ROOT/'public-shell-manifest-v1.json'
TEMPLATE=ROOT/'public-shell-template-v1.json'
CSS_REF='<link rel="stylesheet" href="public-shell-v1.css?v=20260830-stage4">'
JS_REF='<script src="public-shell-v1.js?v=20260830-stage4" defer></script>'
NAV=[('home','index.html','Начало'),('info','info.html','Инфо Лом'),('categories','kategorii.html','Категории'),('firms','firmi.html','Фирми'),('listings','obyavi.html','Обяви'),('questions','vaprosi.html','Въпроси'),('articles','statii.html','Статии')]
MARKERS={'header':('<!-- PUBLIC SHELL:HEADER START -->','<!-- PUBLIC SHELL:HEADER END -->'),'add':('<!-- PUBLIC SHELL:ADD START -->','<!-- PUBLIC SHELL:ADD END -->'),'footer':('<!-- PUBLIC SHELL:FOOTER START -->','<!-- PUBLIC SHELL:FOOTER END -->'),'mobile':('<!-- PUBLIC SHELL:MOBILE START -->','<!-- PUBLIC SHELL:MOBILE END -->')}
LEGACY={
 'header':re.compile(r'<header\b[^>]*class="[^"]*site-header[^"]*".*?</header>',re.S),
 'add':re.compile(r'<div\b[^>]*class="[^"]*public-add-layer[^"]*"[^>]*id="public-add-sheet".*?</section>\s*</div>',re.S),
 'footer':re.compile(r'<footer\b[^>]*class="[^"]*site-footer[^"]*".*?</footer>',re.S),
 'mobile':re.compile(r'<nav\b[^>]*class="[^"]*mobile-bottom-nav[^"]*".*?</nav>',re.S),
}
HOME_STYLES={
 'mobile-navigation-test-v2':'MOBILE NAVIGATION — TEST V2','desktop-navigation-test-v1':'DESKTOP NAVIGATION — TEST V1','desktop-navigation-test-v1-1':'DESKTOP NAVIGATION — TEST V1.1','desktop-header-sticky-fit-fix':'INTERNAL TEST: DESKTOP HEADER STICKY/FIT FIX','desktop-info-lom-accent':'INTERNAL TEST: DESKTOP INFO LOM ACCENT','whole-desktop-header-separation':'INTERNAL TEST: WHOLE DESKTOP HEADER SEPARATION'}
THEMATIC={'maistori.html':('maistori','Намери майстор'),'avtomobili.html':('avtomobili','Намери автосервиз или услуга'),'zavedenia.html':('zavedenia','Намери заведение'),'rabota.html':('rabota','Намери услуга'),'sabitiya.html':('sabitiya','Разгледай предстоящите')}

def load():
 m=json.loads(MANIFEST.read_text(encoding='utf-8')); t=json.loads(TEMPLATE.read_text(encoding='utf-8'))
 pages=m.get('pages') or {}; excluded=set(m.get('excluded') or [])
 if excluded!={'404.html','admin.html'} or len(pages)!=41: raise ValueError('manifest must contain exactly 41 public pages and exclude only 404.html/admin.html')
 actual={p.name for p in ROOT.glob('*.html')}-excluded
 if actual!=set(pages): raise ValueError(f'public page manifest mismatch: actual-only={sorted(actual-set(pages))}; manifest-only={sorted(set(pages)-actual)}')
 for n,c in pages.items():
  if c.get('nav') not in {None,*[x[0] for x in NAV]}: raise ValueError(f'invalid nav: {n}')
  if c.get('mobile') not in {None,'home','categories','listings','profile'}: raise ValueError(f'invalid mobile: {n}')
  if c.get('footer','standard') not in {'standard','info','health'}: raise ValueError(f'invalid footer: {n}')
  if c.get('special') not in {None,'shop','health'}: raise ValueError(f'invalid special: {n}')
 return m,t

def render(t,c):
 nav=''.join(f'<a{(" class=\"active\" aria-current=\"page\"" if c.get("nav")==k else "")} href="{h}">{l}</a>' for k,h,l in NAV)
 header=t['header'].replace('{{NAV_LINKS}}',nav)
 add=t['add'][c.get('special') or 'none'].replace('{{QUESTION}}',c.get('question','nov-vapros.html'))
 footer=t['footer'][c.get('footer','standard')]
 mobile=t['mobile']
 for k in ['home','categories','listings','profile']:
  attr=' class="active" aria-current="page"' if c.get('mobile')==k else ''
  mobile=mobile.replace('{{'+k.upper()+'_ATTR}}',attr)
 return {'header':header,'add':add,'footer':footer,'mobile':mobile}

def marker_re(kind):
 a,b=MARKERS[kind]; return re.compile(re.escape(a)+r'.*?'+re.escape(b),re.S)

def replace_fragment(text,kind,body):
 r=marker_re(kind)
 if r.search(text): return r.sub(body,text,count=1)
 if LEGACY[kind].search(text): return LEGACY[kind].sub(body,text,count=1)
 if kind in {'add','mobile'}:
  anchor=marker_re('header' if kind=='add' else 'footer').search(text)
  if anchor: return text[:anchor.end()]+'\n'+body+text[anchor.end():]
 raise ValueError(f'cannot locate {kind} fragment')

def migrate(name,text):
 if name=='index.html':
  for sid,comment in HOME_STYLES.items():
   text=re.sub(rf'\s*<!--\s*{re.escape(comment)}\s*-->\s*<style[^>]*id=["\']{re.escape(sid)}["\'][^>]*>.*?</style>\s*','\n',text,count=1,flags=re.S|re.I)
  text=text.replace('<a class="hero-cover-primary" href="nov-vapros.html">Задай въпрос</a>','<button class="hero-cover-primary public-add-trigger" type="button" aria-haspopup="dialog" aria-controls="public-add-sheet">+ Добави</button>',1)
 elif name=='kategorii.html':
  text=text.replace('<p>Избери раздел и намери въпроси, фирми, услуги и полезна информация.</p>','<p>Намери или добави местна услуга, фирма, обява, препоръка или събитие.</p>\n    <div class="public-stage4-actions"><button class="primary-link-button public-add-trigger" type="button" aria-haspopup="dialog" aria-controls="public-add-sheet">+ Добави</button><a class="secondary-link-button" href="vaprosi.html">Въпроси и препоръки</a></div>',1)
  text=text.replace('<h2>Обяви</h2>','<h2>Всички обяви</h2>',1).replace('<p>Купува, продава, подарява, наема и търси.</p>','<p>Общият каталог за купува, продава, подарява, наема и търси.</p>',1)
 elif name=='obyavi.html': text=text.replace('<h1>Обяви</h1>','<h1>Всички обяви</h1>',1)
 elif name in THEMATIC:
  slug,label=THEMATIC[name]; old=f'<a class="primary-link-button" href="nov-vapros.html?category={slug}">Задай въпрос</a>'; new=f'<div class="public-stage4-actions"><a class="primary-link-button" href="#category-subcategories">{label}</a><a class="secondary-link-button" href="nov-vapros.html?category={slug}">Задай въпрос</a></div>'; text=text.replace(old,new,1)
  if 'id="category-subcategories"' not in text: text=text.replace('<div class="subcategory-grid"','<div class="subcategory-grid" id="category-subcategories"',1)
 elif name=='zdrave-i-lekari.html' and '<div class="public-stage4-actions"><button class="health-hero-add"' not in text:
  old='<button class="health-hero-add" type="button" aria-expanded="false" aria-controls="health-pro-panel">＋ Добави лекар или здравна услуга</button>'; new='<div class="public-stage4-actions">'+old+'<a class="secondary-link-button" href="nov-vapros.html?category=zdrave">Задай въпрос</a></div>'; text=text.replace(old,new,1)
 elif name=='magazini.html' and 'href="#shops-panel">Намери магазин</a>' not in text:
  old='<p>Избери какво търсиш и намери подходящ магазин в Лом.</p>'; text=text.replace(old,old+'<div class="public-stage4-actions"><a class="primary-link-button" href="#shops-panel">Намери магазин</a><a class="secondary-link-button" href="obyavi.html">Всички обяви</a><a class="secondary-link-button" href="nov-vapros.html?category=magazini">Задай въпрос</a></div>',1)
 return text

def expected(name,text,c,t):
 text=migrate(name,text); parts=render(t,c)
 for k in ['header','add','footer','mobile']: text=replace_fragment(text,k,parts[k])
 if 'public-shell-v1.css' not in text: text=text.replace('</head>','  '+CSS_REF+'\n</head>',1)
 if 'public-shell-v1.js' not in text: text=text.replace('</body>','  '+JS_REF+'\n</body>',1)
 return text

def validate():
 problems=[]
 def req(n,x):
  if x not in (ROOT/n).read_text(encoding='utf-8-sig'): problems.append(f'{n}: missing {x!r}')
 idx=(ROOT/'index.html').read_text(encoding='utf-8-sig'); req('index.html','<button class="hero-cover-primary public-add-trigger"')
 for sid in HOME_STYLES:
  if sid in idx: problems.append(f'index.html: legacy navigation style remains: {sid}')
 req('kategorii.html','Намери или добави местна услуга, фирма, обява, препоръка или събитие.'); req('kategorii.html','>Въпроси и препоръки</a>'); req('kategorii.html','<h2>Всички обяви</h2>'); req('obyavi.html','<h1>Всички обяви</h1>')
 for n,(slug,label) in THEMATIC.items(): req(n,'id="category-subcategories"'); req(n,label); req(n,f'nov-vapros.html?category={slug}')
 req('zdrave-i-lekari.html','nov-vapros.html?category=zdrave'); req('magazini.html','href="#shops-panel">Намери магазин</a>'); req('magazini.html','href="obyavi.html">Всички обяви</a>'); req('magazini.html','nov-vapros.html?category=magazini')
 for asset in ['public-shell-v1.css','public-shell-v1.js','public-shell-template-v1.json']:
  if not (ROOT/asset).is_file(): problems.append(f'missing asset: {asset}')
 return problems

def main():
 p=argparse.ArgumentParser(); g=p.add_mutually_exclusive_group(required=True); g.add_argument('--write',action='store_true'); g.add_argument('--check',action='store_true'); a=p.parse_args()
 try: m,t=load()
 except Exception as e: print(f'public-shell manifest/template error: {e}',file=sys.stderr); return 2
 changed=[]; errors=[]
 for n,c in m['pages'].items():
  path=ROOT/n; raw=path.read_bytes(); had_bom=raw.startswith(b'\xef\xbb\xbf'); cur=raw.decode('utf-8-sig')
  try: exp=expected(n,cur,c,t)
  except Exception as e: errors.append(f'{n}: {e}'); continue
  if cur!=exp:
   changed.append(n)
   if a.write: path.write_bytes((b'\xef\xbb\xbf' if had_bom else b'')+exp.encode('utf-8'))
 if a.check:
  errors+=validate()
  if changed: errors.append('out-of-sync public shell pages: '+', '.join(sorted(changed)))
 if errors:
  print('Public shell check FAILED:',file=sys.stderr); [print('- '+x,file=sys.stderr) for x in errors]; return 1
 print(f'Public shell synchronized: {len(changed)} page(s) changed.' if a.write else 'Public shell check PASS: 41 pages synchronized; protected exclusions intact.'); return 0
if __name__=='__main__': raise SystemExit(main())
