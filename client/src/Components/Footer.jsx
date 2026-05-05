import React from "react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-container__content">
        <p className="footer-container__text">© 2023 Tripp NYC. All rights reserved.</p>
        <p className="footer-container__text">Follow us on social media!</p>
        <ul className="footer__container__social__links">
          <li className="footer__container__link">
            <a className="footer__link" href="https://www.instagram.com/trippnyc/">
              Instagram
            </a>
          </li>
          <li className="footer__container__link"> 
            <a className="footer__link" href="https://www.facebook.com/trippnyc">
              Facebook
            </a>
          </li>
          <li className="footer__container__link">
            <a className="footer__link" href="https://twitter.com/trippnyc">
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
