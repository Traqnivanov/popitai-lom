'use strict';

(() => {
  const allowedCompositions=new Set(['marketplace','profile','editorial','event','community']);
  const allowedMediaTypes=new Set(['','approved-photo','approved-logo','approved-logo-or-photo','approved-publication-photo','approved-poster']);

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
      title:text(input.title),
      description:text(input.description),
      category:text(input.category),
      discovery:text(input.discovery),
      visualTheme:text(input.visualTheme),
      icon:text(input.icon),
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
    if(!normalized.description) errors.push('description');
    if(!normalized.category) errors.push('category');
    if(!normalized.canonicalUrl) errors.push('canonicalUrl');
    if(!allowedCompositions.has(normalized.composition)) errors.push('composition');
    if(!allowedMediaTypes.has(normalized.mediaType)) errors.push('mediaType');
    try { if(normalized.canonicalUrl) new URL(normalized.canonicalUrl); } catch { errors.push('canonicalUrl-format'); }
    return {ok:errors.length===0,errors,input:normalized};
  }

  function imageMode(input){
    if(input.mediaAvailable) return 'real';
    if(input.visualTheme) return 'template';
    return 'lom';
  }

  function imageBlock(input,mode,resolvedTitle){
    if(mode==='real'){
      return `<div class="social-card-image social-card-image--real" data-image-level="real" role="img" aria-label="Реална одобрена медия"><div><span>APPROVED MEDIA</span><strong>${escapeHtml(resolvedTitle)}</strong><p>${escapeHtml(input.mediaType||'approved media')}</p></div></div>`;
    }
    if(mode==='lom'){
      return `<div class="social-card-image social-card-image--lom" data-image-level="lom" role="img" aria-label="Панорама на Лом — последен fallback"><div class="social-card-copy"><span>${escapeHtml(input.contentType)}</span><strong>${escapeHtml(resolvedTitle)}</strong><small>Последен fallback · Лом</small></div><b>Попитай.Лом</b></div>`;
    }
    return `<div class="social-card-image social-card-image--template" data-image-level="template" data-accent="${escapeHtml(input.accent)}" role="img" aria-label="Тематичен Social Card шаблон"><div class="social-card-copy"><span>${escapeHtml(input.category)}${input.discovery?` · ${escapeHtml(input.discovery)}`:''}</span><strong>${escapeHtml(resolvedTitle)}</strong><small>${escapeHtml(input.visualTheme)}</small></div><b>Попитай.Лом</b></div>`;
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

    return `<section class="social-card-preview social-card-preview--${escapeHtml(input.composition)}" aria-label="Social Card preview">
      <h3>Social Card — UX прототип</h3>
      <div class="facebook-human-text"><strong>Facebook текст над линка — пише се от човека</strong><p>${escapeHtml(input.facebookText)}</p></div>
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

  window.PopitaiSocialCardComposer=Object.freeze({
    render,
    validate,
    titleFor,
    imageMode
  });
})();