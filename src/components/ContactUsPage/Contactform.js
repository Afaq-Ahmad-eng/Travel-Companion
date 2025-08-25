import "./contactform.css";
import React from 'react';

export default function Contactform() {
  return (
    <div className="form-container">
      <h1>Send a message to us</h1>
      <form>
        <input placeholder="Name" />
        <input placeholder="Email" />
        <input placeholder="Subject" />
        <textarea placeholder="Message" rows={5}></textarea>
        <button>Send Message</button>
      </form>
    </div>
  );
}

