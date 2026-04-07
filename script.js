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

    // ─── Collapse when nav reaches top of screen (goes sticky) ───
    // Measure the nav's natural position after page renders
    let navNaturalTop = navWrapper.getBoundingClientRect().top + window.scrollY;

    // Re-measure if window resizes (header might reflow)
    window.addEventListener('resize', () => {
        // Temporarily un-stick to get true natural position
        navWrapper.style.position = 'relative';
        navNaturalTop = navWrapper.getBoundingClientRect().top + window.scrollY;
        navWrapper.style.position = '';
    });

    window.addEventListener('scroll', () => {
        if (manualOverride) return;

        const currentScrollY = window.scrollY;

        // Nav becomes sticky exactly when scrollY >= its natural top position
        if (currentScrollY >= navNaturalTop && navExpanded) {
            closeNav();
        }

        // Expand only when user scrolls back above the nav's natural position
        if (currentScrollY < navNaturalTop && !navExpanded) {
            openNav();
        }
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