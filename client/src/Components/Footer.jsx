import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <p className="site-footer__text">© 2023 Tripp NYC. All rights reserved.</p>
        <p className="site-footer__text">Follow us on social media!</p>
        <ul className="site-footer__social-links">
          <li className="site-footer__social-item">
            <a className="site-footer__link" href="https://www.instagram.com/trippnyc/">
              Instagram
            </a>
          </li>
          <li className="site-footer__social-item">
            <a className="site-footer__link" href="https://www.facebook.com/trippnyc">
              Facebook
            </a>
          </li>
          <li className="site-footer__social-item">
            <a className="site-footer__link" href="https://twitter.com/trippnyc">
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
