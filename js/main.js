// ============================================================
//  Site Dra. Beatriz Aroeira — main.js
//  Inicializa dataLayer ANTES de qualquer outra coisa para
//  garantir que o tracking funcione mesmo se o GTM ainda nao
//  tiver carregado.
// ============================================================
window.dataLayer = window.dataLayer || [];

// ------------------------------------------------------------
// 1) TRACKING DE CLIQUES EM WHATSAPP
//    - Cobre wa.me, api.whatsapp.com/send e whatsapp://
//    - Usa delegacao de eventos no document (resiliente a
//      mudancas dinamicas e SPAs)
//    - Detecta button_location automaticamente
//    - Anexado fora do DOMContentLoaded para ser registrado o
//      mais cedo possivel; a delegacao no document funciona
//      mesmo antes do DOM estar totalmente parseado
// ------------------------------------------------------------
(function () {
  var WHATSAPP_REGEX = /(?:wa\.me|api\.whatsapp\.com\/send|whatsapp:\/\/)/i;

  function isWhatsAppLink(href) {
    return !!href && WHATSAPP_REGEX.test(href);
  }

  // Mapeia o link clicado para uma "localizacao" semantica.
  // A ordem importa: a primeira regra que casar vence.
  function detectButtonLocation(el) {
    if (!el || typeof el.closest !== 'function') return 'unknown';

    if (el.closest('.whatsapp-float-group, .whatsapp-float'))     return 'floating';
    if (el.closest('.site-header'))                               return 'header';
    if (el.closest('.hero-cta'))                                  return 'hero';
    if (el.closest('.cta-strip'))                                 return 'cta_strip';
    if (el.closest('.service-cta'))                               return 'service_cta';
    if (el.closest('.faq-intro, .faq-section, .faq-grid'))        return 'faq';
    if (el.closest('.contact-method, .contact-section, .contact-grid, .contact-page-grid, .contact-info-block'))
      return 'contact_section';
    if (el.closest('.article, .article-content'))                 return 'blog_post';
    if (el.closest('.site-footer'))                               return 'footer';
    return 'other';
  }

  document.addEventListener(
    'click',
    function (event) {
      // event.target pode ser um <svg>/<span> dentro do <a>, entao
      // sobe ate achar o <a> mais proximo.
      var anchor = event.target && event.target.closest
        ? event.target.closest('a')
        : null;
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (!isWhatsAppLink(href)) return;

      // dataLayer.push e sincrono — dispara ANTES do navegador
      // abrir o link. Nao usamos preventDefault.
      window.dataLayer.push({
        event: 'whatsapp_click',
        button_location: detectButtonLocation(anchor),
        page_path: window.location.pathname
      });
    },
    true // capture: roda antes de handlers que nao sao em capture
  );
})();

// ------------------------------------------------------------
// 2) GCLID -> link WhatsApp
//    Captura o gclid do Google Ads (param da URL) e anexa na
//    mensagem que abre no WhatsApp como [ref: gclid]. Assim,
//    quando a paciente abre conversa, voce sabe qual anuncio
//    do Google Ads trouxe a conversao.
//    - Salva em sessionStorage para sobreviver a cliques
//      internos no site (manter o gclid durante a sessao)
//    - Reescreve todos os links de wa.me, api.whatsapp.com,
//      web.whatsapp.com com o numero correto da Dra. Beatriz
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  (function () {
    var NUMERO   = "5531984536446"; // (31) 98453-6446
    var MENSAGEM = "Olá! Vim pelo site e gostaria de agendar uma consulta com a Dra. Beatriz Aroeira";

    var gclid = new URLSearchParams(location.search).get("gclid");
    try {
      if (gclid) sessionStorage.setItem("gclid", gclid);
      else gclid = sessionStorage.getItem("gclid");
    } catch (e) { /* sessionStorage pode estar bloqueado em modo privado */ }

    var ref  = gclid ? " [ref: " + gclid + "]" : "";
    var href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(MENSAGEM + ref);

    document.querySelectorAll(
      'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]'
    ).forEach(function (a) { a.href = href; });
  })();

  // ------------------------------------------------------------
  // 3) RESTANTE DO SITE
  // ------------------------------------------------------------
  // Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Testimonials carousel
  const carousel = document.querySelector('.testimonials-track');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let current = 0;
    let timer;

    const goTo = (i) => {
      current = (i + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    };

    dots.forEach((dot, idx) => dot.addEventListener('click', () => { goTo(idx); reset(); }));

    const reset = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6000);
    };
    reset();
  }

  // ------------------------------------------------------------
  // 3) Outros eventos de tracking (Instagram, telefone, e-mail,
  //    cards de servico, cards de blog, scroll depth).
  //    OBS: WhatsApp ja eh tratado por delegacao acima — nao
  //    duplicar aqui.
  // ------------------------------------------------------------
  const trackEvent = (eventName, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  };

  document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('instagram_click', { event_category: 'social', event_label: 'Instagram' });
    });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('phone_click', { event_category: 'contato', event_label: link.getAttribute('href') });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('email_click', { event_category: 'contato', event_label: link.getAttribute('href') });
    });
  });

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent || 'Serviço';
      trackEvent('service_click', { event_category: 'navegacao', event_label: title });
    });
  });

  document.querySelectorAll('.blog-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3, .blog-card-title')?.textContent || 'Artigo';
      trackEvent('blog_click', { event_category: 'navegacao', event_label: title });
    });
  });

  const scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', () => {
    const pct = Math.round(((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100);
    [25, 50, 75, 100].forEach((mark) => {
      if (!scrollMarks[mark] && pct >= mark) {
        scrollMarks[mark] = true;
        trackEvent('scroll_depth', {
          event_category: 'engagement',
          event_label: `${mark}%`,
          value: mark,
        });
      }
    });
  }, { passive: true });
});
