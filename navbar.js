// navbar.js
// Define the CustomNavbar web component
class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .navbar {
                    background: #c49d03ff;
                    color: #333;
                    font-family: 'Montserrat', sans-serif;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 100; /* Reduced from 1000 to allow modals to appear above */
                    border-bottom: 2px solid #000;
                }

                .navbar-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: #eaddcd;
                    color: #9c2c2a;
                }

                .brand {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: 2.5rem;
                    color: #9c2c2a;
                    text-align: center;
                    flex: 1;
                }

                .contact-section {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.3rem;
                }

                .contact-line {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .contact-label {
                    font-size: 0.9rem;
                    color: #333;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .contact-detail {
                    font-size: 1rem;
                    color: #000;
                    font-weight: 600;
                }

                .navbar-main {
                    border-top: 1px solid #000;
                    padding: 0.8rem 2rem;
                    background: #9c2c2a;
                    color: #fff;
                }

                .nav-menu {
                    display: flex;
                    justify-content: center;
                    gap: 3rem;
                    align-items: center;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .nav-link {
                    color: #fff;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    padding: 0.3rem 0;
                    position: relative;
                    transition: color 0.3s ease;
                }

                .nav-link:hover {
                    color: #eaddcd;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #eaddcd;
                    transition: width 0.3s ease;
                }

                .nav-link:hover::after,
                .nav-link.active::after {
                    width: 100%;
                }

                .nav-link.active {
                    color: #eaddcd;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .navbar-top {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 1rem;
                    }

                    .brand {
                        font-size: 2rem;
                    }

                    .contact-section {
                        align-items: center;
                        text-align: center;
                    }

                    .nav-menu {
                        flex-wrap: wrap;
                        gap: 1.5rem;
                    }

                    .nav-link {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .navbar-top {
                        padding: 0.8rem;
                    }

                    .brand {
                        font-size: 1.8rem;
                    }

                    .nav-menu {
                        gap: 1rem;
                    }

                    .nav-link {
                        font-size: 0.8rem;
                    }
                }
            </style>

            <nav class="navbar">
                <!-- Top Section with Brand and Contact -->
                <div class="navbar-top">
                    <!-- Left Contact Info -->
                    <div class="contact-section">
                        <div class="contact-line">
                            <span class="contact-label">Book your haircut:</span>
                            <span class="contact-detail">310-954-8607</span>
                        </div>
                    </div>

                    <!-- Center Brand -->
                    <div class="brand">Glow & Bloom Beauty</div>

                    <!-- Right Contact Info -->
                    <div class="contact-section">
                        <div class="contact-line">
                            <span class="contact-label">Find us anytime:</span>
                            <span class="contact-detail">1363 SUNSET BLYD LA</span>
                        </div>
                    </div>
                </div>

                <!-- Main Navigation Menu -->
                <div class="navbar-main">
                    <ul class="nav-menu">
                        <li><a href="index.html" class="nav-link">Home</a></li>
                        <li><a href="about.html" class="nav-link">About us</a></li>
                        <li><a href="services.html" class="nav-link">Service</a></li>
                        <li><a href="testimonials.html" class="nav-link">Testimonials</a></li>
                        <li><a href="blog.html" class="nav-link">Blog</a></li>
                        <li><a href="products.html" class="nav-link">Products</a></li>
                        <li><a href="contact.html" class="nav-link">Contact</a></li>
                    </ul>
                </div>
            </nav>
        `;

        // Highlight current page after the DOM is rendered
        setTimeout(() => {
            this.highlightCurrentPage();
        }, 0);
    }

    highlightCurrentPage() {
        try {
            // Get current page filename
            const currentPath = window.location.pathname;
            const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
            
            // Default to index.html if we're at the root
            const pageToCheck = currentPage || 'index.html';
            
            // Find all nav links in shadow DOM
            const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
            
            // Remove active class from all links first
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current page link
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                // Check if this link matches current page
                if (linkHref === pageToCheck) {
                    link.classList.add('active');
                }
                // Also handle cases where we might be at root and link is index.html
                else if (pageToCheck === '' && linkHref === 'index.html') {
                    link.classList.add('active');
                }
            });
            
        } catch (error) {
            console.error('Error highlighting current page:', error);
        }
    }
}

// Register the custom element
customElements.define('custom-navbar', CustomNavbar);

// Re-highlight when navigating (for single page applications or dynamic content)
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('custom-navbar');
    if (navbar) {
        navbar.highlightCurrentPage();
    }
});

// Also highlight when URL changes (for single page apps)
window.addEventListener('popstate', function() {
    const navbar = document.querySelector('custom-navbar');
    if (navbar) {
        setTimeout(() => {
            navbar.highlightCurrentPage();
        }, 100);
    }
});