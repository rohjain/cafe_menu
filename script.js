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

    // ─── Native sticky collapse behavior ───
    window.addEventListener('scroll', () => {
        if (manualOverride) return;

        // Where is the first category in the viewport?
        const catTop = categoriesGrid.getBoundingClientRect().top;

        // If the first category has reached the top (sliding under the sticky nav)
        if (catTop <= 80) {
            // Collapse into a pill so we free up the screen
            if (navExpanded) closeNav();
        } else {
            // If scrolled back up, reveal the full categories
            if (!navExpanded) openNav();
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

            // Scroll to specifically selected category content
            setTimeout(() => {
                const targetColumn = category === 'all' 
                    ? categoriesGrid 
                    : document.querySelector(`.menu-column[data-category="${category}"]`);
                
                if (targetColumn) {
                    const yOffset = -70; // Offset for the sticky pill button
                    const y = targetColumn.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 250); // Small delay to let the menu collapse animation finish
        });
    });
});