const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// --- МОДАЛЬНОЕ ОКНО ДЛЯ ПОДБОРА ТУРА ---
const modalOverlaySelect = document.getElementById('modal-overlay-select');
const modalCloseSelect = document.getElementById('modal-close-select');
const btnSelectTour = document.getElementById('btn-select-tour');

btnSelectTour.addEventListener('click', () => {
    modalOverlaySelect.classList.add('active');
    document.body.style.overflow = 'hidden';
});

modalCloseSelect.addEventListener('click', () => {
    modalOverlaySelect.classList.remove('active');
    document.body.style.overflow = '';
});

// --- МОДАЛЬНОЕ ОКНО ДЛЯ КАРТОЧКИ ТУРА ---
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const tourButtons = document.querySelectorAll('.tour-details-btn');

// Элементы модального окна
const modalTitle = document.getElementById('modal-title');
const modalDuration = document.getElementById('modal-duration');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalFeatures = document.getElementById('modal-features');
const modalDate = document.getElementById('modal-date');
const modalTourHidden = document.getElementById('modal-tour-hidden');
const modalDateHidden = document.getElementById('modal-date-hidden');

// Карусель
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselDots = document.getElementById('carousel-dots');
const modalImages = [
    document.getElementById('modal-img-0'),
    document.getElementById('modal-img-1'),
    document.getElementById('modal-img-2'),
    document.getElementById('modal-img-3'),
    document.getElementById('modal-img-4')
];

let currentImageIndex = 0;
let tourImages = [];

// Установка минимальной даты (сегодня)
const today = new Date().toISOString().split('T')[0];
modalDate.setAttribute('min', today);

// Обновление скрытого поля при выборе даты
modalDate.addEventListener('change', () => {
    modalDateHidden.value = modalDate.value;
});

function updateCarousel(index) {
    modalImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    
    // Обновление точек
    carouselDots.innerHTML = tourImages.map((_, i) => 
        `<span class="carousel-dot ${i === index ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    
    // Добавляем обработчики на точки
    carouselDots.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentImageIndex = parseInt(dot.dataset.index);
            updateCarousel(currentImageIndex);
        });
    });
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % tourImages.length;
    updateCarousel(currentImageIndex);
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + tourImages.length) % tourImages.length;
    updateCarousel(currentImageIndex);
}

carouselNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

carouselPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});

tourButtons.forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.tour-card');
        
        // Загрузка изображений
        tourImages = card.dataset.images.split(',');
        currentImageIndex = 0;
        
        modalImages.forEach((img, i) => {
            if (tourImages[i]) {
                img.src = tourImages[i];
                img.alt = card.dataset.tour;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
        
        // Заполнение данных
        modalTitle.textContent = card.dataset.tour;
        modalDuration.textContent = card.dataset.duration;
        modalDescription.textContent = card.dataset.description;
        modalPrice.textContent = `От ${card.dataset.price}`;
        
        // Список включенных услуг (разделитель |)
        const features = card.dataset.features.split('|');
        modalFeatures.innerHTML = features.map(f => `<li>${f}</li>`).join('');
        
        // Данные для формы
        modalTourHidden.value = card.dataset.tour;
        
        // Обновление карусели
        updateCarousel(currentImageIndex);
        
        // Показать модальное окно
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', closeModal);

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Валидация номера телефона
function initPhoneValidation(input) {
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        // Удаляем всё кроме цифр и плюса
        let value = e.target.value.replace(/[^\d+]/g, '');
        
        // Заменяем несколько плюсов на один в начале
        value = value.replace(/(?!^)\+/g, '');
        
        // Добавляем +7 если начинается с 8
        if (value.startsWith('8')) {
            value = '+7' + value.slice(1);
        } else if (value.startsWith('7') && !value.startsWith('+')) {
            value = '+' + value;
        }
        
        e.target.value = value;
    });

    input.addEventListener('blur', () => {
        validatePhone(input);
    });

    input.addEventListener('focus', () => {
        input.classList.remove('error');
    });
}

const contactForm = document.querySelector('.contact form');
const phoneInput = document.querySelector('input[name="user_phone"]');
const modalForm = document.querySelector('.modal-form');
const modalPhoneInput = modalForm?.querySelector('input[name="user_phone"]');

// Инициализация валидации для основной формы
initPhoneValidation(phoneInput);

// Инициализация валидации для формы в модальном окне
initPhoneValidation(modalPhoneInput);

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        if (!validatePhone(phoneInput)) {
            e.preventDefault();
        }
    });
}

if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        if (!validatePhone(modalPhoneInput)) {
            e.preventDefault();
        }
    });
}

function validatePhone(input) {
    if (!input) return true;
    
    const phonePattern = /^\+7\d{10}$/;
    
    if (!phonePattern.test(input.value)) {
        input.classList.add('error');
        return false;
    }
    
    input.classList.remove('error');
    return true;
}