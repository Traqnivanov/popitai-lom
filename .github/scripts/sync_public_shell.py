#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
MANIFEST=ROOT/'public-shell-manifest-v1.json'
TEMPLATE=ROOT/'public-shell-template-v1.json'
CSS_REF='<link rel="stylesheet" href="public-shell-v1.css?v=20260830-stage4">'
JS_REF='<script src="public-shell-v1.js?v=20260830-marketplace-v3" defer></script>'
CSS_ASSET_RE=re.compile(r'<link rel="stylesheet" href="public-shell-v1\.css(?:\?v=[^"]*)?">')
JS_ASSET_RE=re.compile(r'<script src="public-shell-v1\.js(?:\?v=[^"]*)?" defer></script>')
LEGACY_NAV_KEYS={'home','info','categories','firms','listings','questions','articles'}
MARKETPLACE_NAV_KEYS={'categories','listings'}
MORE_PAGES={'vaprosi.html','vapros.html','nov-vapros.html','sabitiya.html','za-nas.html','pravila.html','kontakti.html'}
MARKERS={'header':('<!-- PUBLIC SHELL:HEADER START -->','<!-- PUBLIC SHELL:HEADER END -->'),'add':('<!-- PUBLIC SHELL:ADD START -->','<!-- PUBLIC SHELL:ADD END -->'),'footer':('<!-- PUBLIC SHELL:FOOTER START -->','<!-- PUBLIC SHELL:FOOTER END -->'),'mobile':('<!-- PUBLIC SHELL:MOBILE START -->','<!-- PUBLIC SHELL:MOBILE END -->')}
LEGACY={
 'header':re.compile(r'<header\b[^>]*class="[^"]*site-header[^"]*".*?</header>',re.S),
 'add':re.compile(r'<div\b[^>]*class="[^"]*public-add-layer[^"]*"[^>]*id="public-add-sheet".*?</section>\s*</div>',re.S),
 'footer':re.compile(r'<footer\b[^>]*class="[^"]*site-footer[^"]*".*?</footer>',re.S),
 'mobile':re.compile(r'<nav\b[^>]*class="[^"]*mobile-bottom-nav[^"]*".*?</nav>',re.S),
}
HOME_STYLES={
 'mobile-navigation-test-v2':'MOBILE NAVIGATION — TEST V2','desktop-navigation-test-v1':'DESKTOP NAVIGATION — TEST V1','desktop-navigation-test-v1-1':'DESKTOP NAVIGATION — TEST V1.1','desktop-header-sticky-fit-fix':'INTERNAL TEST: DESKTOP HEADER STICKY/FIT FIX','desktop-info-lom-accent':'INTERNAL TEST: DESKTOP INFO LOM ACCENT','whole-desktop-header-separation':'INTERNAL TEST: WHOLE DESKTOP HEADER SEPARATION'}
BOM_PAGES={'index.html','profil.html'}
THEMATIC={'maistori.html':('maistori','Намери майстор'),'avtomobili.html':('avtomobili','Намери автосервиз или услуга'),'zavedenia.html':('zavedenia','Намери заведение'),'rabota.html':('rabota','Намери услуга'),'sabitiya.html':('sabitiya','Разгледай предстоящите')}

def load():
 m=json.loads(MANIFEST.read_text(encoding='utf-8')); t=json.loads(TEMPLATE.read_text(encoding='utf-8'))
 pages=m.get('pages') or {}; excluded=set(m.get('excluded') or [])
 if excluded!={'404.html','admin.html'} or len(pages)!=41: raise ValueError('manifest must contain exactly 41 public pages and exclude only 404.html/admin.html')
 actual={p.name for p in ROOT.glob('*.html')}-excluded
 if actual!=set(pages): raise ValueError(f'public page manifest mismatch: actual-only={sorted(actual-set(pages))}; manifest-only={sorted(set(pages)-actual)}')
 for n,c in pages.items():
  if c.get('nav') not in {None,*LEGACY_NAV_KEYS}: raise ValueError(f'invalid nav: {n}')
  if c.get('mobile') not in {None,'home','categories','listings','profile'}: raise ValueError(f'invalid mobile: {n}')
  if c.get('footer','standard') not in {'standard','info','health'}: raise ValueError(f'invalid footer: {n}')
  if c.get('special') not in {None,'shop','health'}: raise ValueError(f'invalid special: {n}')
 return m,t

def attr(active):
 return ' class="active" aria-current="page"' if active else ''

def render(t,c,name):
 nav_key=c.get('nav')
 nav=(
  f'<a{attr(nav_key=="home")} href="index.html">Начало</a>'
  f'<a{attr(nav_key in MARKETPLACE_NAV_KEYS)} href="obyavi.html">Обяви и услуги</a>'
  f'<a{attr(nav_key=="firms")} href="firmi.html">Фирми</a>'
  f'<a{attr(nav_key=="info")} href="info.html">Инфо Лом</a>'
  f'<a{attr(nav_key=="articles")} href="statii.html">Статии</a>'
  f'<details class="public-more{" active" if name in MORE_PAGES else ""}"><summary{" aria-current=\"page\"" if name in MORE_PAGES else ""}>Още</summary><div class="public-more-menu"><a href="vaprosi.html">Въпроси</a><a href="sabitiya.html">Събития</a><a href="za-nas.html">За сайта</a><a href="pravila.html">Правила</a><a href="kontakti.html">Контакти</a></div></details>'
  f'<a{attr(name=="profil.html")} href="profil.html">Профил</a>'
 )
 header=t['header'].replace('{{NAV_LINKS}}',nav)
 add=t['add'][c.get('special') or 'none'].replace('{{QUESTION}}',c.get('question','nov-vapros.html'))
 footer=t['footer'][c.get('footer','standard')]
 mobile=t['mobile']
 mobile_active=c.get('mobile')
 replacements={
  'HOME': mobile_active=='home',
  'MARKETPLACE': mobile_active in {'categories','listings'},
  'INFO': mobile_active=='info' or nav_key=='info',
  'PROFILE': mobile_active=='profile' or name=='profil.html',
 }
 for key,active in replacements.items():
  mobile=mobile.replace('{{'+key+'_ATTR}}',attr(active))
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

def sync_asset_ref(text,pattern,ref,anchor):
 if pattern.search(text): return pattern.sub(ref,text,count=1)
 return text.replace(anchor,'  '+ref+'\n'+anchor,1)

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
 text=migrate(name,text); parts=render(t,c,name)
 for k in ['header','add','footer','mobile']: text=replace_fragment(text,k,parts[k])
 text=sync_asset_ref(text,CSS_ASSET_RE,CSS_REF,'</head>')
 text=sync_asset_ref(text,JS_ASSET_RE,JS_REF,'</body>')
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
 shell_js=(ROOT/'public-shell-v1.js').read_text(encoding='utf-8')
 if '}, { capture: true });' not in shell_js: problems.append('public-shell-v1.js: hamburger Escape focus listener must run in capture phase')
 pages=json.loads(MANIFEST.read_text(encoding='utf-8')).get('pages') or {}
 for n in pages:
  page=(ROOT/n).read_text(encoding='utf-8-sig')
  if page.count(CSS_REF)!=1: problems.append(f'{n}: expected exactly one canonical public shell CSS reference')
  if page.count(JS_REF)!=1: problems.append(f'{n}: expected exactly one canonical public shell JS reference')
  if '{{' in marker_re('header').search(page).group(0) or '{{' in marker_re('mobile').search(page).group(0): problems.append(f'{n}: unresolved public shell placeholder')
  header=marker_re('header').search(page).group(0)
  mobile=marker_re('mobile').search(page).group(0)
  if 'href="kategorii.html">Категории</a>' in header: problems.append(f'{n}: competing Categories entry remains in canonical header')
  if header.count('href="obyavi.html">Обяви и услуги</a>')!=1: problems.append(f'{n}: canonical header must contain one Обяви и услуги entry')
  if 'class="login-link"' in header: problems.append(f'{n}: duplicate login entry remains in canonical Marketplace V3 header')
  for label in ['<span>Начало</span>','<span>Обяви</span>','<span>Добави</span>','<span>Инфо</span>','<span>Профил</span>']:
   if label not in mobile: problems.append(f'{n}: canonical mobile nav missing {label}')
 return problems

def main():
 p=argparse.ArgumentParser(); g=p.add_mutually_exclusive_group(required=True); g.add_argument('--write',action='store_true'); g.add_argument('--check',action='store_true'); a=p.parse_args()
 try: m,t=load()
 except Exception as e: print(f'public-shell manifest/template error: {e}',file=sys.stderr); return 2
 changed=[]; errors=[]
 for n,c in m['pages'].items():
  path=ROOT/n; raw=path.read_bytes(); cur=raw.decode('utf-8-sig')
  try: exp=expected(n,cur,c,t)
  except Exception as e: errors.append(f'{n}: {e}'); continue
  desired=(b'\xef\xbb\xbf' if n in BOM_PAGES else b'')+exp.encode('utf-8')
  if raw!=desired:
   changed.append(n)
   if a.write: path.write_bytes(desired)
 if a.check:
  errors+=validate()
  if changed: errors.append('out-of-sync public shell pages: '+', '.join(sorted(changed)))
 if errors:
  print('Public shell check FAILED:',file=sys.stderr); [print('- '+x,file=sys.stderr) for x in errors]; return 1
 print(f'Public shell synchronized: {len(changed)} page(s) changed.' if a.write else 'Public shell check PASS: 41 pages synchronized; Marketplace V3 shell canonical; protected exclusions intact.'); return 0
if __name__=='__main__': raise SystemExit(main())