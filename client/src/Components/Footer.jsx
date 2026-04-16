import React from 'react'

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className='footer-container__content'>
                <p>© 2023 Tripp NYC. All rights reserved.</p>
                <p>Follow us on social media!</p>
                <ul className='footer-container__social-links'>
                    <li><a href="https://www.instagram.com/trippnyc/">Instagram</a></li>
                    <li><a href="https://www.facebook.com/trippnyc">Facebook</a></li>
                    <li><a href="https://twitter.com/trippnyc">Twitter</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer