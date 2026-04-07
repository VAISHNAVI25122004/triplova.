const BASE_URL = import.meta.env.DEV ? '/triplova-project/api' : 'https://triplova.com/triplova-project/api';
const CUSTOM_BACKEND_URL = '/api';
export const IMG_BASE = 'https://triplova.com/triplova-project/api/admin/';

// Helper for standard JSON GET requests
const getJSON = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Helper for Form-Data requests (POST, PUT, DELETE)
const sendFormData = async (endpoint, formData, methodOverride) => {
    try {
        if (methodOverride) {
            formData.append('_method', methodOverride);
        }
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST', // Always POST for form-data as per requirements
            body: formData,
            // DO NOT set Content-Type to undefined or 'multipart/form-data', 
            // the browser sets it automatically with the correct boundary when passing FormData
        });

        let data;
        const text = await response.text();
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("Non-JSON response:", text);
            throw new Error("Invalid JSON response from server");
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const categoryAPI = {
    getAll: () => getJSON('/admin/category.php'),
    create: (formData) => sendFormData('/admin/category.php', formData),
    update: (formData) => sendFormData('/admin/category.php', formData, 'PUT'),
    delete: (formData) => sendFormData('/admin/category.php', formData, 'DELETE'),
};

export const subCategoryAPI = {
    getAll: () => getJSON('/admin/subcategory.php'),
    create: (formData) => sendFormData('/admin/subcategory.php', formData),
    update: (formData) => sendFormData('/admin/subcategory.php', formData, 'PUT'),
    delete: (formData) => sendFormData('/admin/subcategory.php', formData, 'DELETE'),
};

export const childCategoryAPI = {
    getAll: () => getJSON('/admin/childcategory.php'),
    create: (formData) => sendFormData('/admin/childcategory.php', formData),
    update: (formData) => sendFormData('/admin/childcategory.php', formData, 'PUT'),
    delete: (formData) => sendFormData('/admin/childcategory.php', formData, 'DELETE'),
};

export const continentsAPI = {
    getAll: () => getJSON('/admin/continents.php'),
    create: (formData) => sendFormData('/admin/continents.php', formData),
    update: (formData) => sendFormData('/admin/continents.php', formData, 'PUT'),
    delete: (formData) => sendFormData('/admin/continents.php', formData, 'DELETE'),
    getByContinent: (continent) => getJSON(`/admin/continents.php?continent=${encodeURIComponent(continent)}`),
    getByCategory: (category) => getJSON(`/admin/continents.php?category=${encodeURIComponent(category)}`),
    getBySubCategory: (subCategory) => getJSON(`/admin/continents.php?subCategory=${encodeURIComponent(subCategory)}`),
    getByChildCategory: (childCategory) => getJSON(`/admin/continents.php?childCategory=${encodeURIComponent(childCategory)}`),
};



export const contactAPI = {
    getAllDetails: () => getJSON('/admin/contactdetail.php'),
    submitContact: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));

        const res = await fetch(`${BASE_URL}/api.php/contact`, {
            method: 'POST',
            body: formData
        });
        const text = await res.text();
        try {
            // Try to extract JSON if PHP warnings are prepended
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
            }
            return JSON.parse(text);
        } catch (e) {
            if (res.ok) {
                return { status: 'success', message: 'Message sent successfully.' };
            }
            console.error("Non-JSON response from Contact API:", text);
            throw new Error("Invalid JSON response from server");
        }
    }
};


export const userAPI = {
    getAll: async () => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/auth/users`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text.substring(0, 50)}`);
        }
        return res.json();
    },
    getProfile: async (email) => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/auth/profile/${email}`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text.substring(0, 50)}`);
        }
        return res.json();
    },
    deleteUser: async (id) => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/auth/users/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text.substring(0, 50)}`);
        }
        return res.json();
    },
    updateStatus: async (id, status) => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/auth/users/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API error ${res.status}: ${text.substring(0, 50)}`);
        }
        return res.json();
    }
};

export const bookingAPI = {
    logIntent: async (bookingData) => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        return res.json();
    }
};

export const whatsappAPI = {
    send: async (phone, message) => {
        const res = await fetch(`${CUSTOM_BACKEND_URL}/whatsapp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, message })
        });
        return res.json();
    }
};

const DB_URL = 'http://localhost:5000';
export const packageAPI = {
    getAll: async () => {
        try {
            const response = await fetch(`${DB_URL}/packages`);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            return { status: 'success', data };
        } catch (error) {
            console.log('json-server not responding, falling back to localStorage');
            const localData = localStorage.getItem('triplova_packages');
            const data = localData ? JSON.parse(localData) : [];
            return { status: 'success', data };
        }
    },
    create: async (packageData) => {
        try {
            const response = await fetch(`${DB_URL}/packages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageData)
            });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            return { status: 'success', data };
        } catch (error) {
            console.log('json-server not responding, falling back to localStorage');
            const localData = localStorage.getItem('triplova_packages');
            const packages = localData ? JSON.parse(localData) : [];
            packages.push(packageData);
            localStorage.setItem('triplova_packages', JSON.stringify(packages));
            return { status: 'success', data: packageData };
        }
    },
    delete: async (id) => {
        try {
            const response = await fetch(`${DB_URL}/packages/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Network error');
            return { status: 'success' };
        } catch (error) {
            console.log('json-server not responding, falling back to localStorage');
            const localData = localStorage.getItem('triplova_packages');
            const packages = localData ? JSON.parse(localData) : [];
            const remaining = packages.filter(p => p.id !== id && p.id !== Number(id));
            localStorage.setItem('triplova_packages', JSON.stringify(remaining));
            return { status: 'success' };
        }
    }
};
