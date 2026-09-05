'use strict';

(() => {
  const previousContent=window.PopitaiApprovedContent||Object.freeze({});
  const previousDetail=window.detail;

  const pensionArticle=Object.freeze({
    title:'Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете',
    description:'Къде се обслужвате в Лом, кога се налага Монтана и какво е добре да подготвите за пенсиониране.',
    type:'Статия',
    meta:'Пенсии · Ръководство',
    href:'#detail/article?record=article-pension'
  });

  const existingArticles=(Array.isArray(previousContent.articles)?previousContent.articles:[])
    .filter(item=>item?.href!=='#detail/article?record=article-pension');

  window.PopitaiApprovedContent=Object.freeze({
    ...previousContent,
    articles:Object.freeze([...existingArticles,pensionArticle]),
    publications:Object.freeze([]),
    events:Object.freeze([])
  });

  function pensionSocial(){
    return Object.freeze({
      contentType:'article',
      contentRole:'editorial',
      title:pensionArticle.title,
      description:pensionArticle.description,
      category:'Статии',
      discovery:'Пенсии',
      visualTheme:'Статии · Пенсии',
      icon:'articles',
      accent:'blue',
      mediaAvailable:false,
      mediaType:'',
      canonicalUrl:'https://traqnivanov.github.io/popitai-lom/prototype-final-ia/#detail/article?record=article-pension',
      location:'Лом',
      shareEligible:true,
      facebookText:'Текстът над споделения линк се пише от човека, който споделя.',
      composition:'editorial'
    });
  }

  function articleShare(){
    const social=pensionSocial();
    return `<button class="btn soft" type="button" data-open-share>Сподели</button>
      <div class="share-overlay" data-share-overlay hidden>
        <button class="share-backdrop" type="button" data-close-share aria-label="Затвори споделянето"></button>
        <section class="share-drawer" role="dialog" aria-modal="true" aria-label="Сподели">
          <div class="share-drawer-head"><h2>Сподели</h2><button class="share-close" type="button" data-close-share aria-label="Затвори">×</button></div>
          <div class="share-actions">
            <button class="btn" type="button" data-demo-share="facebook">Facebook</button>
            <button class="btn" type="button" data-demo-share="native">Споделяне от устройството</button>
            <button class="btn" type="button" data-demo-share="copy">Копирай линк</button>
          </div>
          <p class="share-demo-message help" aria-live="polite"></p>
          ${window.PopitaiSocialCardComposer?.render?.(social)||''}
        </section>
      </div>`;
  }

  function pensionDetail(){
    return `<div class="page article-detail-page">
      ${pageHead(pensionArticle.title,pensionArticle.description,'Статии · Пенсии')}
      <div class="shell article-detail-shell">
        <div class="notice ok"><strong>Ръководство · Попитай.Лом</strong><p>Проверено по данни на НОИ · септември 2026</p></div>

        <section class="content-card article-detail-section">
          <h2>НОИ в Лом</h2>
          <h3>Офис НОИ · Лом</h3>
          <p><strong>Пенсионно обслужване</strong></p>
          <div class="kv"><strong>Адрес</strong><span>ул. „Георги Манафски“ №19</span></div>
          <div class="kv"><strong>Приемно време</strong><span>Четвъртък · 09:00–16:00 ч.</span></div>
          <div class="kv"><strong>Телефон</strong><span>0882 91 23 84</span></div>
          <p>Добре е да носите лична карта и наличните документи за трудов и осигурителен стаж. При конкретен пенсионен случай служителите ще ви кажат какво още е необходимо.</p>
        </section>

        <section class="content-card article-detail-section">
          <h2>Кога се налага посещение в Монтана</h2>
          <p>ТП НОИ – Монтана се посещава, когато услугата не се извършва в офиса в Лом или случаят трябва да бъде поет от специализиран отдел.</p>
          <ul>
            <li>болнични и краткосрочни плащания;</li>
            <li>обезщетения за безработица;</li>
            <li>осигурителен архив;</li>
            <li>друг специализиран случай, за който НОИ ви насочи.</li>
          </ul>
          <div class="kv"><strong>Адрес</strong><span>бул. „Трети март“ №76</span></div>
          <div class="kv"><strong>Работно време</strong><span>08:00–16:30 ч.</span></div>
          <div class="kv"><strong>Пенсии</strong><span>096 39 41 37</span></div>
        </section>

        <section class="content-card article-detail-section">
          <h2>Кога можете да се пенсионирате</h2>
          <p>По общия ред трябва едновременно да имате необходимата възраст и осигурителен стаж.</p>
          <div class="kv"><strong>Жени · 2026 г.</strong><span>62 г. и 6 месеца + 36 г. и 10 месеца осигурителен стаж</span></div>
          <div class="kv"><strong>Мъже · 2026 г.</strong><span>64 г. и 9 месеца + 39 г. и 10 месеца осигурителен стаж</span></div>
          <p><strong>От 2027 г.</strong> необходимият стаж достига 37 години за жените и 40 години за мъжете. След това стажът остава същият, а възрастта продължава да се променя по законовия график.</p>
        </section>

        <section class="content-card article-detail-section">
          <h2>Какво да подготвите</h2>
          <ul>
            <li>заявление УП-1;</li>
            <li>трудова или служебна книжка;</li>
            <li>осигурителна книжка, ако е приложимо;</li>
            <li>документи за липсващи периоди от стажа;</li>
            <li>други удостоверения, ако бъдат поискани за конкретния случай.</li>
          </ul>
          <p>Ако имате стар или непълен трудов стаж, проверете документите си предварително.</p>
        </section>

        <section class="content-card article-detail-section">
          <h2>Важен срок</h2>
          <p>Ако заявлението и необходимите документи бъдат подадени до <strong>2 месеца след придобиване на правото на пенсия</strong>, пенсията се отпуска от датата, на която правото е възникнало. При по-късно подаване — от датата на заявлението.</p>
        </section>

        <section class="content-card article-detail-section">
          <h2>Ако не можете да отидете лично</h2>
          <p>Заявлението може да бъде подадено и чрез упълномощено лице или по електронен път според изискванията на НОИ.</p>
        </section>

        <div class="notice"><strong>Източник</strong><p>Национален осигурителен институт (НОИ). Условията са за пенсия за осигурителен стаж и възраст по общия ред; при специални случаи правилата и документите могат да бъдат различни.</p></div>

        <div class="detail-action article-actions">
          <button class="btn soft" type="button" data-pension-helpful aria-pressed="false">♡ Полезно</button>
          <button class="btn soft" type="button" data-pension-comments>Коментирай</button>
          ${articleShare()}
          <button class="btn soft" type="button" data-demo-report>Има промяна?</button>
          <p class="action-demo-message help" aria-live="polite"></p>
        </div>

        <section class="content-card article-comments" id="article-pension-comments">
          <div class="section-head compact-head"><div><h2>Коментари</h2><p>Местен опит и уточнения</p></div></div>
          <form data-pension-comment-form>
            <div class="field"><label for="pension-comment">Коментар</label><textarea id="pension-comment" rows="4" minlength="3" maxlength="2000" required placeholder="Напишете коментар…"></textarea></div>
            <button class="btn primary" type="submit">Изпрати</button>
            <p class="form-message" data-pension-comment-status role="status" aria-live="polite">Все още няма одобрени коментари.</p>
          </form>
        </section>
      </div>
    </div>`;
  }

  window.articles=function articles(){
    const rows=(window.PopitaiApprovedContent?.articles||[]).map(item=>window.PopitaiStage2MasterOrder?.publicRow?.(item)||'').join('');
    return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${rows||'<article class="empty-card"><p>Няма публикувани статии за показване.</p></article>'}</div></div></div>`;
  };

  window.current=function current(){
    return `<div class="page">${pageHead('Актуално','Местни публикации и предстоящи събития на едно място.')}<div class="shell"><article class="empty-card"><h2>Няма актуално съдържание за показване</h2><p>В момента няма потвърдена публикация или предстоящо събитие за този изглед.</p></article></div></div>`;
  };

  window.detail=function detail(kind,query=new URLSearchParams()){
    if(kind==='article'&&query.get('record')==='article-pension') return pensionDetail();
    return typeof previousDetail==='function'?previousDetail(kind,query):'';
  };

  document.addEventListener('click',event=>{
    const comments=event.target.closest?.('[data-pension-comments]');
    if(comments){
      document.getElementById('article-pension-comments')?.scrollIntoView({behavior:'smooth',block:'start'});
      document.getElementById('pension-comment')?.focus({preventScroll:true});
      return;
    }
    const button=event.target.closest?.('[data-pension-helpful]');
    if(!button) return;
    const next=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(next));
    button.textContent=next?'♥ Полезно':'♡ Полезно';
  });

  document.addEventListener('submit',event=>{
    const form=event.target.closest?.('[data-pension-comment-form]');
    if(!form) return;
    event.preventDefault();
    const textarea=form.querySelector('textarea');
    const status=form.querySelector('[data-pension-comment-status]');
    if(!textarea?.checkValidity()){
      textarea?.focus();
      if(status) status.textContent='Напиши поне 3 знака, за да изпратиш коментар.';
      return;
    }
    textarea.value='';
    textarea.disabled=true;
    form.querySelector('button[type="submit"]')?.setAttribute('disabled','');
    if(status) status.textContent='Коментарът е изпратен за преглед.';
  });
})();
