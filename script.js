// Modal Functions
function openPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'modal_open', {
            'event_category': 'engagement',
            'event_label': 'purchase_modal'
        });
    }
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Limpa o formulário
    const form = document.getElementById('purchaseForm');
    if (form) {
        form.reset();
    }
}

// WhatsApp Integration
function openWhatsApp(message) {
    const phoneNumber = "5561992057130"; // WhatsApp da Caninos
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abre o WhatsApp Web no desktop ou app no mobile
    window.open(whatsappUrl, '_blank');
    
    // Analytics tracking (opcional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': message
        });
    }
}

// Smooth scrolling para links internos
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Ajuste para navbar fixa
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mobile navigation toggle
function toggleMobileNav() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fecha todos os outros FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abre o FAQ clicado se não estava ativo
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Animated counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer para animações
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Anima contadores quando a seção hero entra na viewport
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem ser animados
    const elementsToAnimate = document.querySelectorAll('.hero-stats, .benefit-item, .dosage-card, .testimonial-card, .step');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Parallax effect para shapes do hero
function setupParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Form validation e envio
function setupFormHandling() {
    // Formulário de contato (se existir)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const product = formData.get('product');
            const message = formData.get('message');
            
            // Validação básica
            if (!name || !email || !phone || !product) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Cria mensagem para WhatsApp
            const whatsappMessage = `Olá! Gostaria de fazer um pedido:

*Dados do Cliente:*
Nome: ${name}
Email: ${email}
Telefone: ${phone}

*Produto:*
${product}

*Mensagem:*
${message || 'Sem mensagem adicional'}

Obrigado!`;
            
            // Abre WhatsApp
            openWhatsApp(whatsappMessage);
            
            // Mostra confirmação
            showNotification('Redirecionando para o WhatsApp...', 'success');
            
            // Limpa o formulário
            contactForm.reset();
        });
    }
    
    // Formulário de compra (modal)
    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(purchaseForm);
            const customerName = formData.get('customerName');
            const customerPhone = formData.get('customerPhone');
            const petWeight = formData.get('petWeight');
            const paymentMethod = formData.get('paymentMethod');
            const additionalInfo = formData.get('additionalInfo');
            
            // Validação básica
            if (!customerName || !customerPhone || !petWeight || !paymentMethod) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Determina a dosagem baseada no peso
            let dosage = '';
            const weight = parseFloat(petWeight);
            
            if (weight >= 2 && weight <= 4.5) {
                dosage = 'Defenza 45mg';
            } else if (weight > 4.5 && weight <= 10) {
                dosage = 'Defenza 100mg';
            } else if (weight > 10 && weight <= 20) {
                dosage = 'Defenza 200mg';
            } else if (weight > 20 && weight <= 40) {
                dosage = 'Defenza 400mg';
            } else if (weight > 40 && weight <= 56) {
                dosage = 'Defenza 560mg';
            } else {
                showNotification('Peso fora da faixa recomendada. Consulte um veterinário.', 'error');
                return;
            }
            
            // Cria mensagem para WhatsApp
            const whatsappMessage = `🛒 *NOVO PEDIDO - DEFENZA*

*Dados do Cliente:*
👤 Nome: ${customerName}
📱 Telefone: ${customerPhone}

*Informações do Pet:*
🐕 Peso: ${petWeight}kg
💊 Dosagem Recomendada: ${dosage}

*Forma de Pagamento:*
💰 ${paymentMethod}

*Observações:*
${additionalInfo || 'Nenhuma observação adicional'}

---
*Pedido realizado através do site Caninos*`;
            
            // Abre WhatsApp
            openWhatsApp(whatsappMessage);
            
            // Mostra confirmação
            showNotification('Pedido enviado! Redirecionando para o WhatsApp...', 'success');
            
            // Fecha o modal
            closePurchaseModal();
        });
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adiciona estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Adiciona ao DOM
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Lazy loading para imagens (se houver)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para browsers antigos
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }
}

// Otimizações para dispositivos touch
function setupTouchOptimizations() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Adiciona classe para elementos interativos
        const interactiveElements = document.querySelectorAll('button, .btn-whatsapp, .nav-link');
        interactiveElements.forEach(el => {
            el.style.minHeight = '44px'; // Tamanho mínimo recomendado para touch
            el.style.touchAction = 'manipulation';
        });
    }
}

// Performance: Debounce para scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    const handleScroll = debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// Modal handling
function setupModalHandling() {
    const modal = document.getElementById('purchaseModal');
    if (!modal) return;
    
    // Fecha modal ao clicar fora dele
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePurchaseModal();
        }
    });
    
    // Fecha modal com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closePurchaseModal();
        }
    });
}

// Click tracking para analytics
function setupClickTracking() {
    // Track purchase button clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = btn.textContent.trim();
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase_button_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'value': 1
                });
            }
            
            // Facebook Pixel tracking (se disponível)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout');
            }
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const linkText = link.textContent.trim();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'event_category': 'navigation',
                    'event_label': linkText
                });
            }
        });
    });
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Setup mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Fecha menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Setup todas as funcionalidades
    setupScrollAnimations();
    setupParallax();
    setupFormHandling();
    setupLazyLoading();
    setupTouchOptimizations();
    setupNavbarScroll();
    setupClickTracking();
    setupModalHandling();
    
    // Adiciona classe de carregamento completo
    document.body.classList.add('loaded');
    
    console.log('🚀 Defenza Landing Page carregada com sucesso!');
});

// Prevenção de zoom duplo-tap em iOS
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado: ', registration);
            })
            .catch(registrationError => {
                console.log('SW falhou: ', registrationError);
            });
    });
}

// Exporta funções para uso global
window.openPurchaseModal = openPurchaseModal;
window.closePurchaseModal = closePurchaseModal;
window.openWhatsApp = openWhatsApp;
window.scrollToSection = scrollToSection;
window.toggleFAQ = toggleFAQ;