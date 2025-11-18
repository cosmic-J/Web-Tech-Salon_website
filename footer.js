// Define the CustomFooter web component
class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .footer {
          background: #973c3b;
          color: #fff;
          padding: 3rem 2rem;
          font-family: 'Montserrat', sans-serif;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .footer-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #ede1d5;
        }
        .footer-section p, .footer-section a {
          color: #fff;
          line-height: 1.6;
          margin-bottom: 0.5rem;
          text-decoration: none;
        }
        .footer-section a:hover {
          color: #ede1d5;
          text-decoration: underline;
        }
        .footer-bottom {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: #ede1d5;
        }
      </style>

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Glow & Bloom Beauty</h3>
            <p>Your destination for premium beauty products and exceptional braiding services.</p>
          </div>
          <div class="footer-section">
            <h3>Contact Info</h3>
            <p>📞 310-954-8607</p>
            <p>📍 1363 Sunset Boulevard LA</p>
            <p>✉️ info@glowandbloom.com</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <p><a href="index.html">Home</a></p>
            <p><a href="products.html">Products</a></p>
            <p><a href="#">Services</a></p>
            <p><a href="#">Contact</a></p>
          </div>
          <div class="footer-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9AM - 7PM</p>
            <p>Saturday: 10AM - 6PM</p>
            <p>Sunday: 11AM - 5PM</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Glow & Bloom Beauty Emporium & CrownBraids. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}

// Register the custom element
customElements.define('custom-footer', CustomFooter);