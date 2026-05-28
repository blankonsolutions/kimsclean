document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ri-menu-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-line');
            }
        });
    }

    // 2. Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.trust-card, .media-content, .service-col, .timeline-item, .contact-container');
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // 4. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu if open
            if(mobileBtn) {
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. File upload name display
    const fileInputs = document.querySelectorAll('.file-upload input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if(this.files && this.files.length > 0) {
                label.innerHTML = `<i class="ri-check-line"></i> ${this.files[0].name}`;
                label.style.borderColor = 'var(--primary)';
                label.style.color = '#fff';
            } else {
                label.innerHTML = `<i class="ri-image-add-line"></i> 사진 등록`;
                label.style.borderColor = '#444';
                label.style.color = '#a3a3a3';
            }
        });
    });

    // 6. Dynamic Gallery Auto-Loader
    // 사용법: index.html이 있는 폴더에 image/gallery/ 폴더를 만들고
    // 1.jpg, 2.png, 3.jpeg 등 숫자로 이름을 붙여서 저장하면 자동으로 불러옵니다.
    // 끊기지 않고 연속된 숫자로 올려야 하며 (예: 1, 2, 3...) 등록된 이미지가 없으면 기본 샘플 이미지가 표시됩니다.
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const basePath = 'image/gallery/';
        const maxImages = 50; // 최대 검사할 이미지 개수
        let loadedCount = 0;
        
        // 로컬 이미지가 없을 경우를 대비한 기존 정적 이미지 백업
        const fallbackItems = Array.from(galleryGrid.children);
        
        function checkAndAddImage(index) {
            if (index > maxImages) {
                if (loadedCount === 0) {
                    galleryGrid.innerHTML = '';
                    fallbackItems.forEach(item => galleryGrid.appendChild(item));
                }
                return;
            }

            const extensions = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
            let extIndex = 0;

            function tryNextExtension() {
                if (extIndex >= extensions.length) {
                    // 모든 확장자(jpg, png, jpeg 등)에 대해 파일이 없을 경우 로딩을 중단합니다.
                    if (loadedCount === 0) {
                        galleryGrid.innerHTML = '';
                        fallbackItems.forEach(item => galleryGrid.appendChild(item));
                    }
                    return;
                }

                const ext = extensions[extIndex];
                const imgSrc = `${basePath}${index}.${ext}`;
                const img = new Image();
                img.src = imgSrc;

                img.onload = function() {
                    // 첫 이미지를 성공적으로 불러오면 기존 샘플 이미지 비우기
                    if (loadedCount === 0) {
                        galleryGrid.innerHTML = '';
                    }
                    loadedCount++;

                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `
                        <img src="${imgSrc}" alt="현장사진 ${index}">
                        <div class="gallery-overlay"><span>현장 복원 작업 ${index}</span></div>
                    `;
                    
                    galleryGrid.appendChild(galleryItem);
                    
                    // 다음 이미지(index + 1) 검사 시작
                    checkAndAddImage(index + 1);
                };

                img.onerror = function() {
                    // 해당 확장자가 없으면 다음 확장자로 시도
                    extIndex++;
                    tryNextExtension();
                };
            }

            tryNextExtension();
        }

        // 1번 이미지부터 차례대로 탐색 시작
        checkAndAddImage(1);
    }
});
