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
            if (mobileBtn) {
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
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

                img.onload = function () {
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

                img.onerror = function () {
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

    // 7. Contact Form Phone Verification & UX Improvements
    const inquiryForm = document.querySelector('.inquiry-form');
    if (inquiryForm) {
        // Enforce numeric input & Auto-focus next input when max length is reached within the same group
        const phoneGroups = inquiryForm.querySelectorAll('.phone-inputs');
        phoneGroups.forEach(group => {
            const inputs = group.querySelectorAll('input');
            inputs.forEach((input, index) => {
                // Limit to numbers only
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');

                    // Auto-tab to next input within the group if max length is reached
                    if (e.target.value.length >= e.target.maxLength) {
                        const nextInput = inputs[index + 1];
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                });
            });
        });

        // Validate that both phone numbers match on form submission
        inquiryForm.addEventListener('submit', (e) => {
            const phone1 = inquiryForm.querySelector('input[name="phone1"]').value.trim();
            const phone2 = inquiryForm.querySelector('input[name="phone2"]').value.trim();
            const phone3 = inquiryForm.querySelector('input[name="phone3"]').value.trim();

            const confirm1 = inquiryForm.querySelector('input[name="phone_confirm1"]').value.trim();
            const confirm2 = inquiryForm.querySelector('input[name="phone_confirm2"]').value.trim();
            const confirm3 = inquiryForm.querySelector('input[name="phone_confirm3"]').value.trim();

            const fullPhone = `${phone1}-${phone2}-${phone3}`;
            const fullConfirm = `${confirm1}-${confirm2}-${confirm3}`;

            if (fullPhone !== fullConfirm) {
                e.preventDefault();
                alert('입력하신 연락처와 연락처 확인 번호가 일치하지 않습니다. 다시 확인해 주세요.');
                inquiryForm.querySelector('input[name="phone_confirm1"]').focus();
            }
        });
    }

    // 8. Media Play Simulation (In-place Ken Burns motion)
    const mediaVideos = document.querySelectorAll('.media-video');

    if (mediaVideos.length > 0) {
        mediaVideos.forEach((videoContainer) => {
            const playBtn = videoContainer.querySelector('.play-btn');
            
            const startSimulation = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Avoid double triggering
                if (videoContainer.classList.contains('is-moving')) return;
                
                videoContainer.classList.add('is-moving');
                
                // Stop and reset after 3 seconds
                setTimeout(() => {
                    videoContainer.classList.remove('is-moving');
                }, 3000);
            };

            if (playBtn) {
                playBtn.addEventListener('click', startSimulation);
            }
            videoContainer.addEventListener('click', startSimulation);
        });
    }

    // 9. PC Version Toggle
    const pcViewBtn = document.getElementById('pcViewBtn');
    if (pcViewBtn) {
        // Update button text depending on current preference on load
        const isPC = localStorage.getItem('prefer-pc-version') === 'true';
        if (isPC) {
            pcViewBtn.innerHTML = '<i class="ri-phone-line"></i> 모바일 버전으로 보기';
        } else {
            pcViewBtn.innerHTML = '<i class="ri-computer-line"></i> PC 버전으로 보기';
        }

        pcViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentlyPC = localStorage.getItem('prefer-pc-version') === 'true';
            if (currentlyPC) {
                localStorage.setItem('prefer-pc-version', 'false');
            } else {
                localStorage.setItem('prefer-pc-version', 'true');
            }
            // Reload to apply new viewport configuration immediately
            window.location.reload();
        });
    }
});
