/**
 * MEDIA.JS - Mobile Responsive Functionality
 * For Asturi Accounting System
 * Link this file to your index.html with: <script src="media.js"></script>
 */

// Mobile menu state management
let isMobileSidebarOpen = false;
let mobileOverlay = null;

// Initialize mobile functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileFeatures();
    setupMobileEventListeners();
    handleOrientationChange();
});

// Initialize mobile-specific features
function initializeMobileFeatures() {
    createMobileOverlay();
    setupHamburgerMenu();
    optimizeForTouch();
}

// Create mobile overlay for sidebar
function createMobileOverlay() {
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-overlay';
        mobileOverlay.onclick = closeMobileSidebar;
        document.body.appendChild(mobileOverlay);
    }
}

// Setup hamburger menu functionality
function setupHamburgerMenu() {
    const contentHeader = document.querySelector('.content-header');
    
    if (contentHeader) {
        // Add click handler for mobile hamburger menu
        contentHeader.addEventListener('click', function(e) {
            // Only trigger on mobile screens and when clicking the hamburger area
            if (window.innerWidth <= 768) {
                const rect = contentHeader.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                // Check if click is in the hamburger menu area (left 50px)
                if (clickX <= 50) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMobileSidebar();
                }
            }
        });
    }
}

// Toggle mobile sidebar
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!sidebar || !mobileOverlay) return;
    
    if (isMobileSidebarOpen) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

// Open mobile sidebar
function openMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!sidebar || !mobileOverlay) return;
    
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('show');
    body.classList.add('mobile-sidebar-open');
    isMobileSidebarOpen = true;
    
    // Prevent body scrolling when sidebar is open
    body.style.overflow = 'hidden';
}

// Close mobile sidebar
function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!sidebar || !mobileOverlay) return;
    
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('show');
    body.classList.remove('mobile-sidebar-open');
    isMobileSidebarOpen = false;
    
    // Restore body scrolling
    body.style.overflow = '';
}

// Setup mobile event listeners
function setupMobileEventListeners() {
    // Close sidebar when clicking on report items (mobile only)
    const reportItems = document.querySelectorAll('.report-item, .sub-report-item');
    reportItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768 && isMobileSidebarOpen) {
                setTimeout(closeMobileSidebar, 150);
            }
        });
    });
    
    // Close sidebar when clicking on category headers that open reports
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            if (window.innerWidth <= 768 && isMobileSidebarOpen) {
                // Small delay to allow category expansion
                setTimeout(() => {
                    if (isMobileSidebarOpen) {
                        closeMobileSidebar();
                    }
                }, 200);
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(handleOrientationChange, 100);
    });
    
    // Close sidebar with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileSidebarOpen) {
            closeMobileSidebar();
        }
    });
}

// Handle window resize events
function handleWindowResize() {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    // Close sidebar if screen becomes larger than tablet
    if (window.innerWidth > 768 && isMobileSidebarOpen) {
        closeMobileSidebar();
    }
    
    // Ensure proper state when switching between mobile/desktop
    if (window.innerWidth > 768) {
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
        if (mobileOverlay) {
            mobileOverlay.classList.remove('show');
        }
        body.classList.remove('mobile-sidebar-open');
        body.style.overflow = '';
        isMobileSidebarOpen = false;
    }
}

// Handle orientation changes
function handleOrientationChange() {
    // Close sidebar on orientation change to avoid layout issues
    if (isMobileSidebarOpen) {
        closeMobileSidebar();
    }
    
    // Adjust iframe heights after orientation change
    setTimeout(function() {
        const iframes = document.querySelectorAll('.iframe-container iframe');
        iframes.forEach(iframe => {
            iframe.style.height = window.innerHeight > window.innerWidth ? 
                'calc(100vh - 140px)' : 'calc(100vh - 80px)';
        });
    }, 300);
}

// Optimize interface for touch devices
function optimizeForTouch() {
    // Add touch feedback for interactive elements
    const touchElements = document.querySelectorAll(
        '.report-item, .sub-report-item, .category-header, .sub-category-header, ' +
        '.system-menu-item, .report-link-card, .add-topic-btn, .header-btn'
    );
    
    touchElements.forEach(element => {
        // Add touch start feedback
        element.addEventListener('touchstart', function() {
            if (window.innerWidth <= 768) {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }
        });
        
        // Remove touch feedback
        element.addEventListener('touchend', function() {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.transition = '';
                }, 100);
            }
        });
        
        // Handle touch cancel
        element.addEventListener('touchcancel', function() {
            if (window.innerWidth <= 768) {
                this.style.transform = '';
                this.style.transition = '';
            }
        });
    });
}

// Detect if device is mobile
function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detect if device supports touch
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Mobile-specific report opening function
function openReportMobile(reportFunction) {
    if (window.innerWidth <= 768) {
        // Execute the report opening function
        if (typeof reportFunction === 'function') {
            reportFunction();
        }
        
        // Close sidebar after report opens
        setTimeout(closeMobileSidebar, 200);
    }
}

// Handle mobile print functionality
function handleMobilePrint() {
    const printBtn = document.querySelector('.print-btn');
    
    if (printBtn && window.innerWidth <= 768) {
        // Position print button for mobile
        printBtn.style.position = 'fixed';
        printBtn.style.bottom = '20px';
        printBtn.style.right = '20px';
        printBtn.style.zIndex = '100';
        printBtn.style.borderRadius = '50px';
        printBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
}

// Mobile swipe gesture support for sidebar
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    if (window.innerWidth > 768) return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Check if it's a horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        // Swipe right from left edge - open sidebar
        if (deltaX > 0 && touchStartX < 50 && !isMobileSidebarOpen) {
            openMobileSidebar();
        }
        // Swipe left - close sidebar
        else if (deltaX < 0 && isMobileSidebarOpen) {
            closeMobileSidebar();
        }
    }
}

// Enhance existing functions for mobile compatibility
function enhanceExistingFunctions() {
    // Override the showDashboard function to handle mobile
    const originalShowDashboard = window.showDashboard;
    window.showDashboard = function() {
        if (originalShowDashboard) {
            originalShowDashboard();
        }
        
        // Close mobile sidebar if open
        if (window.innerWidth <= 768 && isMobileSidebarOpen) {
            setTimeout(closeMobileSidebar, 100);
        }
    };
}

// Mobile-specific utility functions
function adjustMobileLayout() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        // Mobile layout adjustments
        if (sidebar) {
            sidebar.style.position = 'fixed';
            sidebar.style.left = isMobileSidebarOpen ? '0' : '-100%';
        }
        
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        }
    } else {
        // Desktop layout restoration
        if (sidebar) {
            sidebar.style.position = 'relative';
            sidebar.style.left = '0';
        }
        
        if (mainContent) {
            mainContent.style.marginLeft = '';
            mainContent.style.width = '';
        }
    }
}

// Handle mobile keyboard visibility
function handleMobileKeyboard() {
    if (isMobileDevice()) {
        // Adjust layout when virtual keyboard appears
        const viewport = window.visualViewport;
        
        if (viewport) {
            viewport.addEventListener('resize', function() {
                const sidebar = document.querySelector('.sidebar');
                const reportContent = document.querySelector('.report-content.active');
                
                if (sidebar && reportContent) {
                    // Adjust heights when keyboard is visible
                    const keyboardHeight = window.innerHeight - viewport.height;
                    
                    if (keyboardHeight > 150) { // Keyboard is visible
                        reportContent.style.height = `${viewport.height - 100}px`;
                    } else { // Keyboard is hidden
                        reportContent.style.height = '';
                    }
                }
            });
        }
    }
}

// Mobile performance optimizations
function optimizeMobilePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            adjustMobileLayout();
            handleMobilePrint();
        }, 150);
    });
    
    // Optimize touch scroll performance
    const scrollableElements = document.querySelectorAll('.reports-section, .content-body, .report-content');
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
        element.style.overflowScrolling = 'touch';
    });
}

// Initialize mobile features after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        enhanceExistingFunctions();
        adjustMobileLayout();
        handleMobilePrint();
        handleMobileKeyboard();
        optimizeMobilePerformance();
    }, 100);
});

// Export functions for global access (if needed)
window.mobileUtils = {
    toggleSidebar: toggleMobileSidebar,
    closeSidebar: closeMobileSidebar,
    openSidebar: openMobileSidebar,
    isMobile: isMobileDevice,
    isTouch: isTouchDevice
};