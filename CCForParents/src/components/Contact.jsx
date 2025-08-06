import React from "react";

/*React functional component, define a function called Home*/

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    // Custom validation with your own messages
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Success handling
    console.log("Form submitted!");
    alert("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="contact-page">
      <h1 className="HomepageHeaders">Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="contact-input" />
        </div>
                <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="contact-input" />
                </div>
                <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" className="contact-input" />
                </div>
                <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" className="contact-textarea"></textarea>
                </div>
        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;