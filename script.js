document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuColumns = document.querySelectorAll('.menu-column');
    const categoriesGrid = document.querySelector('.categories-grid');
    const navWrapper = document.getElementById('navWrapper');
    const categoryNav = document.getElementById('categoryNav');
    const navToggle = document.getElementById('navToggle');
    const pillArrow = document.getElementById('pillArrow');

    let navExpanded = true;
    // Guard: when the user manually taps the pill, scroll handler won't interfere for 1s
    let manualOverride = false;

    function openNav() {
        navExpanded = true;
        categoryNav.classList.remove('collapsed');
        pillArrow.style.transform = 'rotate(0deg)';
    }

    function closeNav() {
        navExpanded = false;
        categoryNav.classList.add('collapsed');
        pillArrow.style.transform = 'rotate(180deg)';
    }

    // ─── Pill toggle button ───────────────────────────────────
    navToggle.addEventListener('click', () => {
        // Set guard so scroll handler doesn't fight us
        manualOverride = true;
        clearTimeout(navToggle._overrideTimer);
        navToggle._overrideTimer = setTimeout(() => { manualOverride = false; }, 1000);

        if (navExpanded) {
            closeNav();
        } else {
            openNav();
        }
    });

    // ─── Auto-collapse on scroll; only auto-expand at the very top ───
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrolledDown = currentScrollY > lastScrollY;

        if (!manualOverride) {
            // Auto-collapse going down past 80px
            if (scrolledDown && currentScrollY > 80 && navExpanded) {
                closeNav();
            }
            // Auto-expand ONLY when fully back at the very top
            if (currentScrollY <= 10 && !navExpanded) {
                openNav();
            }
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // ─── Category buttons ────────────────────────────────────
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');

            // Update active button state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Handle grid layout state
            if (category === 'all') {
                categoriesGrid.classList.remove('focused');
            } else {
                categoriesGrid.classList.add('focused');
            }

            // Filter menu items
            menuColumns.forEach(column => {
                if (category === 'all' || column.getAttribute('data-category') === category) {
                    column.classList.remove('hidden');
                    column.style.animation = 'none';
                    column.offsetHeight; // force reflow
                    column.style.animation = '';
                } else {
                    column.classList.add('hidden');
                }
            });

            // Collapse nav after selecting a category (all screen sizes for tidiness)
            closeNav();

            // Scroll to menu content
            setTimeout(() => {
                document.querySelector('.categories-grid').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 150);
        });
    });
});