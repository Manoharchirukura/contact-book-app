import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import './App.css';

// Create an Axios instance that points to your live backend URL when deployed.
// It uses an empty string for local development to rely on the Vite proxy.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

const App = () => {
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const contactsPerPage = 10;

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Use 'api.get' instead of 'axios.get'
            const response = await api.get(`/api/contacts?page=${currentPage}&limit=${contactsPerPage}`);
            setContacts(response.data.contacts);
            setTotalPages(Math.ceil(response.data.totalCount / contactsPerPage));
        } catch (error) {
            console.error('Error fetching contacts:', error);
            alert('Failed to fetch contacts. Check the console for more details.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleAddContact = async (contactData) => {
        try {
            // Use 'api.post' instead of 'axios.post'
            await api.post('/api/contacts', contactData);
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
            // Use 'api.delete' instead of 'axios.delete'
            await api.delete(`/api/contacts/${id}`);
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