/**
 * SIMPLIFIED JavaScript - NO NAVIGATION BUTTONS NEEDED
 * Since reports now stay within the main interface with sidebar navigation
 */

// Initialize when page loads - but don't add navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing navigation buttons since we're staying in the main interface
    removeNavigationButtons();
    
    // Add any report-specific functionality here if needed
    initializeReportView();
});

/**
 * Remove navigation buttons if they exist (cleanup)
 */
function removeNavigationButtons() {
    const backButton = document.querySelector('.back-to-dashboard');
    const printButton = document.querySelector('.print-button');
    
    if (backButton) {
        backButton.remove();
    }
    
    if (printButton) {
        printButton.remove();
    }
}

/**
 * Initialize report view functionality
 */
function initializeReportView() {
    // Add any report-specific enhancements here
    // For example: adjust table styling, add tooltips, etc.
    
    // Enhance table readability
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.style.width = '100%';
        table.style.maxWidth = '100%';
    });
    
    // Make the page more responsive
    document.body.style.maxWidth = '100%';
    document.body.style.overflow = 'auto';
}

/**
 * Print function that can be called from the main interface
 */
function printReport() {
    window.print();
}

/**
 * Function to go back - but since we're embedded, this isn't needed
 * Keeping it for compatibility
 */
function goBackToDashboard() {
    // This function is no longer needed since reports stay in the main interface
    // But keeping it for compatibility with any existing calls
    if (window.parent && window.parent !== window) {
        window.parent.postMessage('goBack', '*');
    }
}