/* =============================================================
   SCRIPT.JS — Workshop "Ansiedade e Sobrecarga Emocional"
   Laís Rodrigues, Psicóloga Clínica
   Vanilla JavaScript — sem dependências externas
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollReveal();
  initCountdown();
  initFaqAccordion();
  initSmoothAnchorFocus();
});

/* -------------------------------------------------------------
   1. NAVBAR — muda aparência ao rolar a página
   ------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* -------------------------------------------------------------
   2. SCROLL REVEAL — revela elementos com a classe .reveal
      conforme entram na viewport, usando IntersectionObserver
   ------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Fallback para navegadores sem suporte a IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeno atraso escalonado para elementos vizinhos, criando
          // um efeito de entrada suave e sequencial
          const delay = (entry.target.dataset.revealIndex || 0) * 60;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  // Atribui um índice sequencial dentro de cada seção para escalonar
  // a animação de elementos que aparecem juntos (ex: cards de grid)
  let currentParent = null;
  let indexInGroup = 0;

  revealElements.forEach((el) => {
    const parent = el.parentElement;
    if (parent !== currentParent) {
      currentParent = parent;
      indexInGroup = 0;
    }
    el.dataset.revealIndex = indexInGroup;
    indexInGroup += 1;
    observer.observe(el);
  });
}

/* -------------------------------------------------------------
   3. CONTADOR REGRESSIVO — até 25/07/2026 às 09h
   ------------------------------------------------------------- */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Data e horário do workshop: 25 de julho de 2026 às 09h00 (horário de Brasília)
  const targetDate = new Date('2026-07-25T09:00:00-03:00').getTime();

  const pad = (num) => String(num).padStart(2, '0');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  };

  updateCountdown();
  const intervalId = setInterval(updateCountdown, 1000);
}

/* -------------------------------------------------------------
   4. FAQ — acordeão de perguntas frequentes
   ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Fecha todos os outros itens abertos (comportamento tipo acordeão)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherQuestion = other.querySelector('.faq-item__question');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o item clicado
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* -------------------------------------------------------------
   5. ACESSIBILIDADE — melhora o foco ao navegar por âncoras
   ------------------------------------------------------------- */
function initSmoothAnchorFocus() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Move o foco para o elemento de destino após a rolagem,
      // beneficiando usuários de leitores de tela e navegação por teclado
      setTimeout(() => {
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }, 600);
    });
  });
}
