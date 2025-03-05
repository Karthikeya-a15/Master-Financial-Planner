import { useState } from "react";


const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [editedData, setEditedData] = useState(null);
const handleEditClick = () => setIsEditing(true);
const handleCancelClick = (orgData) => {
    setEditedData(orgData); // Reset to original data
    setIsEditing(false);
};

const handleChange = (section, key, value) => {
    setEditedData((prev) => ({
        ...prev,
        [section]: {
            ...prev[section],
            [key]: value,
        },
    }));
};
