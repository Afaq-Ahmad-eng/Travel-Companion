import "./Footer.css"
import React from 'react'

export default function Footer() {
  return (
    <div className="footer">
        <div className="top">
            <div >
                <h1>Travel Companion</h1>
                <p>choose your favrite destination with us</p>
            </div>

            <div>
                <a href="/">
                <i className="fa-brands fa-facebook-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-instagram-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-behance-square"></i>
                </a>

                <a href="/">
                <i className="fa-brands fa-twitter-square"></i>
                </a>
            </div>

        </div>

        <div className="bottom">
            <div>
                <h4>Explore KPK</h4>
                <a href="/">Top destination</a>
                <a href="/">Adventure Tour </a>
                <a href="/">historical</a>
                
            </div>

            <div>
                <h4>Community</h4>
                <a href="/">Github</a>
                <a href="/">Issue</a>
                <a href="/">Project</a>
                <a href="/">Twitter</a>
            </div>
            
            
            
            <div>
                <h4>Other</h4>
                <a href="/">Term of service</a>
                <a href="/">license</a>
                <a href="/">privacy policy</a>
                
            </div>
            
            
        </div>
      
      
    </div>
  )
}
