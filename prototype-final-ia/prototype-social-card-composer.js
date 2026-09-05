'use strict';

(() => {
  const allowedCompositions=new Set(['marketplace','profile','editorial','event','community']);
  const allowedMediaTypes=new Set(['','approved-photo','approved-logo','approved-logo-or-photo','approved-publication-photo','approved-poster']);
  const allowedContentRoles=new Set(['marketplace','profile','specialized','editorial','event','community','verified-information']);
  const iconRegistry=Object.freeze({
    services:Object.freeze({file:'icons/briefcase-duotone.svg',label:'Услуги'}),
    repairs:Object.freeze({file:'icons/wrench-duotone.svg',label:'Ремонти'}),
    animals:Object.freeze({file:'icons/paw-print-duotone.svg',label:'Животни'}),
    cars:Object.freeze({file:'icons/car-duotone.svg',label:'Автомобили'}),
    health:Object.freeze({file:'icons/first-aid-kit-duotone.svg',label:'Здраве'}),
    utilities:Object.freeze({file:'icons/plug-duotone.svg',label:'Комунални услуги'}),
    articles:Object.freeze({file:'icons/article-duotone.svg',label:'Статии'}),
    publications:Object.freeze({file:'icons/newspaper-duotone.svg',label:'Публикации'})
  });
  const roleLabels=Object.freeze({
    marketplace:'Marketplace',
    profile:'Профил',
    specialized:'Специализиран owner',
    editorial:'Редакционно съдържание',
    event:'Събитие',
    community:'Community',
    'verified-information':'Проверена информация'
  });

  function text(value=''){return String(value??'').trim();}
  function escapeHtml(value=''){return text(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function titleFor(input={}){
    const explicit=text(input.title);
    if(explicit) return explicit;
    const subject=text(input.discovery)||text(input.category)||'Съдържание';
    const location=text(input.location)||'Лом';
    return `${subject} в ${location}`;
  }

  function validate(input={}){
    const normalized={
      contentType:text(input.contentType),
      contentRole:text(input.contentRole),
      title:text(input.title),
      description:text(input.description),
      category:text(input.category),
      discovery:text(input.discovery),
      visualTheme:text(input.visualTheme),
      icon:text(input.icon)||'services',
      accent:text(input.accent)||'blue',
      mediaAvailable:Boolean(input.mediaAvailable),
      mediaType:text(input.mediaType),
      canonicalUrl:text(input.canonicalUrl),
      location:text(input.location)||'Лом',
      shareEligible:Boolean(input.shareEligible),
      facebookText:text(input.facebookText),
      composition:text(input.composition)
    };
    const errors=[];
    if(!normalized.contentType) errors.push('contentType');
    if(!allowedContentRoles.has(normalized.contentRole)) errors.push('contentRole');
    if(!normalized.description) errors.push('description');
    if(!normalized.category) errors.push('category');
    if(!normalized.canonicalUrl) errors.push('canonicalUrl');
    if(!allowedCompositions.has(normalized.composition)) errors.push('composition');
    if(!allowedMediaTypes.has(normalized.mediaType)) errors.push('mediaType');
    if(!Object.prototype.hasOwnProperty.call(iconRegistry,normalized.icon)) errors.push('icon');
    try { if(normalized.canonicalUrl) new URL(normalized.canonicalUrl); } catch { errors.push('canonicalUrl-format'); }
    return {ok:errors.length===0,errors,input:normalized};
  }

  function imageMode(input){
    if(input.mediaAvailable) return 'real';
    if(input.visualTheme) return 'template';
    return 'lom';
  }

  function iconMarkup(key){
    const asset=iconRegistry[key];
    if(!asset) return '';
    return `<img src="${asset.file}" alt="" aria-hidden="true">`;
  }

  function imageBlock(input,mode,resolvedTitle){
    if(mode==='real'){
      return `<div class="social-card-image social-card-image--real" data-image-level="real" role="img" aria-label="Реална одобрена медия"><div class="social-card-approved-media"><span>APPROVED MEDIA</span><strong>${escapeHtml(resolvedTitle)}</strong><p>${escapeHtml(input.mediaType||'approved media')}</p></div><div class="social-card-approved-brand">Попитай.Лом</div></div>`;
    }
    if(mode==='lom'){
      return `<div class="social-card-image social-card-image--lom" data-image-level="lom" role="img" aria-label="Панорама на Лом — последен fallback"><div class="social-card-copy"><span>${escapeHtml(input.contentType)}</span><strong>${escapeHtml(resolvedTitle)}</strong><small>Последен fallback · Лом</small></div><b>Попитай.Лом</b></div>`;
    }
    return `<div class="social-card-image social-card-image--template" data-image-level="template" data-accent="${escapeHtml(input.accent)}" role="img" aria-label="Тематичен Social Card шаблон"><div class="social-card-template-icon" aria-hidden="true">${iconMarkup(input.icon)}</div><div class="social-card-copy"><span>${escapeHtml(input.category)}${input.discovery?` · ${escapeHtml(input.discovery)}`:''}</span><strong>${escapeHtml(resolvedTitle)}</strong><small>${escapeHtml(input.visualTheme)}</small></div><b>Попитай.Лом</b></div>`;
  }

  function qaSimulation(input,actualMode){
    return `<details class="social-card-qa"><summary>QA симулация на image hierarchy</summary>
      <p><strong>Production-like избор:</strong> <code>${escapeHtml(actualMode)}</code>. Той зависи само от валидирания record input.</p>
      <div class="social-card-qa-controls" role="group" aria-label="Само QA симулация">
        <button type="button" class="btn soft" data-qa-image="real">Симулирай real</button>
        <button type="button" class="btn soft" data-qa-image="template">Симулирай template</button>
        <button type="button" class="btn soft" data-qa-image="lom">Симулирай Lom fallback</button>
      </div>
      <div class="social-card-qa-simulation" data-qa-image-output aria-live="polite">QA контролът не е активиран. Той не променя production-like избора.</div>
      <p class="help">Дори при „Симулирай real“ record с <code>mediaAvailable=false</code> остава с действителен режим <code>${escapeHtml(actualMode)}</code>. Симулацията не доказва наличие на медия.</p>
    </details>`;
  }

  function render(rawInput){
    const checked=validate(rawInput);
    if(!checked.ok){
      return `<div class="notice danger social-card-error"><strong>Social Card input error.</strong><p>Липсва или е невалидно: ${escapeHtml(checked.errors.join(', '))}</p></div>`;
    }
    const input=checked.input;
    if(!input.shareEligible) return '';

    const resolvedTitle=titleFor(input);
    const mode=imageMode(input);
    let domain='';
    try { domain=new URL(input.canonicalUrl).host; } catch { domain=''; }

    return `<section class="social-card-preview social-card-preview--${escapeHtml(input.composition)}" data-content-role="${escapeHtml(input.contentRole)}" aria-label="Social Card preview">
      <h3>Social Card — UX прототип</h3>
      <div class="facebook-human-text"><strong>Facebook текст над линка — пише се от човека</strong><p>${escapeHtml(input.facebookText)}</p></div>
      <div class="social-card-role"><strong>Content role / trust:</strong> ${escapeHtml(roleLabels[input.contentRole]||input.contentRole)}</div>
      <div class="social-card-image-label"><strong>og:image · 1200 × 630</strong><span>${mode==='real'?'approved media':mode==='template'?'тематичен template':'Lom fallback'}</span></div>
      ${imageBlock(input,mode,resolvedTitle)}
      <div class="social-card-metadata" aria-label="Open Graph metadata preview">
        <small>${escapeHtml(domain)}</small>
        <strong>${escapeHtml(resolvedTitle)}</strong>
        <p>${escapeHtml(input.description)}</p>
        <code>${escapeHtml(input.canonicalUrl)}</code>
      </div>
      <p class="social-card-separation">Facebook teaser, <code>og:image</code>, title/description/domain и QA са отделни повърхности.</p>
      ${qaSimulation(input,mode)}
    </section>`;
  }

  window.PopitaiSocialCardComposer=Object.freeze({render,validate,titleFor,imageMode,iconRegistry});
})();
