import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import './App.css';

const App = () => {
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const contactsPerPage = 10;

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/contacts?page=${currentPage}&limit=${contactsPerPage}`);
            setContacts(response.data.contacts);
            setTotalPages(Math.ceil(response.data.totalCount / contactsPerPage));
        } catch (error) {
            console.error('Error fetching contacts:', error);
            alert('Failed to fetch contacts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleAddContact = async (contactData) => {
        try {
            await axios.post('/api/contacts', contactData);
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchContacts();
            }
        } catch (error) {
            console.error('Error adding contact:', error);
            const errorMessage = error.response?.data?.error || 'Failed to add contact.';
            alert(errorMessage);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            await axios.delete(`/api/contacts/${id}`);
            if (contacts.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchContacts();
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact.');
        }
    };
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app-container">
            <h1>Contact Book</h1>
            <div className="main-content">
                <ContactForm onAddContact={handleAddContact} />
                <div className="card list-container">
                    <h2>Contacts</h2>
                    {isLoading ? (
                        <p className="loading">Loading...</p>
                    ) : (
                        <ContactList contacts={contacts} onDeleteContact={handleDeleteContact} />
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;