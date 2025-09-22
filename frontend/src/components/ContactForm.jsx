import React, { useState } from 'react';

const ContactForm = ({ onAddContact }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format.';
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAddContact(formData);
            setFormData({ name: '', email: '', phone: '' });
            setErrors({});
        }
    };

    return (
        <div className="card form-container">
            <h2>Add Contact</h2>
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
                <button type="submit">Add Contact</button>
            </form>
        </div>
    );
};

export default ContactForm;