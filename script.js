function renderProducts(category = 'tractors') {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = productsData.filter(product => product.category === category);

    productsGrid.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-12';

    col.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <ul class="product-specs">
                    <li>
                        <i class="bi bi-speedometer2"></i>
                        <span>Потужність: <strong>${product.shortSpecs.power}</strong></span>
                    </li>
                    <li>
                        <i class="bi bi-gear-fill"></i>
                        <span>Привід: <strong>${product.shortSpecs.drive}</strong></span>
                    </li>
                    <li>
                        <i class="bi bi-tools"></i>
                        <span>КПП: <strong>${product.shortSpecs.gearbox}</strong></span>
                    </li>
                </ul>
            </div>
            <div class="product-footer">
                <button class="btn-call-price" onclick="callForPrice()">
                    <i class="bi bi-telephone-fill me-2"></i>Ціну уточнюйте за телефоном
                </button>
                <button class="btn-details" onclick="showProductModal(${product.id})">
                    Детальніше
                </button>
            </div>
        </div>
    `;

    return col;
}

function showProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modal = new bootstrap.Modal(document.getElementById('productModal'));

    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.name;
    document.getElementById('modalProductImage').onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600';
    };

    let specsHTML = '';

    const categoryTitles = {
        general: 'Загальна інформація',
        engine: 'Двигун',
        transmission: 'Трансмісія',
        wheels: 'Шини',
        hydraulics: 'Гідравліка',
        dimensions: 'Габарити',
        performance: 'Характеристики',
        cabin: 'Кабіна',
        additional: 'Додатково'
    };

    for (const [category, specs] of Object.entries(product.fullSpecs)) {
        specsHTML += `<h6 class="mt-3 mb-2 fw-bold text-danger">${categoryTitles[category] || category}</h6><ul class="list-unstyled">`;

        for (const [key, value] of Object.entries(specs)) {
            specsHTML += `<li class="mb-1"><span class="text-muted">${key}:</span> <strong>${value}</strong></li>`;
        }

        specsHTML += '</ul>';
    }

    document.getElementById('modalProductSpecs').innerHTML = specsHTML;

    modal.show();
}

function callForPrice() {
    window.location.href = 'tel:+380936346168';
}

document.addEventListener('DOMContentLoaded', function() {
    renderProducts('tractors');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
            }
        });
    });

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .product-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
