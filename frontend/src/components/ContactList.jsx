import React from 'react';

const ContactList = ({ contacts = [], onDeleteContact }) => {
    if (contacts.length === 0) {
        return <p className="no-contacts">No contacts found. Add one to get started!</p>;
    }

    return (
        <ul className="contact-list">
            {contacts.map((contact) => (
                <li key={contact.id} className="contact-item">
                    <div className="info">
                        <span className="name">{contact.name}</span>
                        <span className="details">{contact.email} | {contact.phone}</span>
                    </div>
                    <button onClick={() => onDeleteContact(contact.id)} className="delete-btn">
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ContactList;