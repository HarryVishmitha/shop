import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import AdminDashboard from '../../Layouts/AdminDashboard';
import Breadcrumb from "@/components/Breadcrumb";
import CookiesV from '@/Components/CookieConsent';
import axios from 'axios';

const Profile = ({ userDetails }) => {
    const [imagePreview, setImagePreview] = useState('/assets/images/user.png');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: userDetails.name,
        email: userDetails.email,
        phone_number: userDetails.phone_number || '',
        description: userDetails.description || '',
        newPassword: '',
        confirmPassword: '',
        profileImage: null
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setFormData({ ...formData, profileImage: input.target.files[0] });
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            setErrorMessage('');
            setSuccessMessage('');


            try {
                // Send data to the backend using Axios
                const response = await axios.post('/admin/api/update-profile', formData);
                console.log(formData);
                // If the request is successful
                setLoading(false);
                setSuccessMessage('Profile updated successfully!');
                console.log('Success:', response.data);
            } catch (error) {
                // If an error occurs
                setLoading(false);
                setErrorMessage('An error occurred while updating the profile.');

                // Optionally log the full error object for debugging
                console.error('Error:', error.response ? error.response.data : error.message);
            }
        }
    };


    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminDashboard userDetails={userDetails}>
                <Breadcrumb title="Edit Profile" />
                <div className="row gy-4">
                    <div className="col-lg-4">
                        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                            <img
                                src="/assets/images/user-grid/user-grid-bg1.png"
                                alt="profile banner image"
                                className="w-100 object-fit-cover"
                            />
                            <div className="pb-24 ms-16 mb-24 me-16 mt--100">
                                <div className="text-center border border-top-0 border-start-0 border-end-0">
                                    <img
                                        src={imagePreview}
                                        alt={`Profile picture of ${userDetails.name}`}
                                        className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover mx-auto"
                                    />
                                    <h6 className="mb-0 mt-16">{userDetails.name}</h6>
                                    <span className="text-secondary-light mb-16">{userDetails.email}</span>
                                </div>
                                <div className="mt-24">
                                    <h6 className="text-xl mb-16">Personal Info</h6>
                                    <ul>
                                        <li className="d-flex align-items-center gap-1 mb-12">
                                            <span className="w-30 text-md fw-semibold text-primary-light">
                                                Full Name
                                            </span>
                                            <span className="w-70 text-secondary-light fw-medium">
                                                : {userDetails.name}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-center gap-1 mb-12">
                                            <span className="w-30 text-md fw-semibold text-primary-light">
                                                {" "}Email
                                            </span>
                                            <span className="w-70 text-secondary-light fw-medium">
                                                : {userDetails.email}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-center gap-1 mb-12">
                                            <span className="w-30 text-md fw-semibold text-primary-light">
                                                {" "}Phone Number
                                            </span>
                                            <span className="w-70 text-secondary-light fw-medium">
                                                : {userDetails.phone_number || 'Not Set'}
                                            </span>
                                        </li>
                                        <li className="d-flex align-items-center gap-1 mb-12">
                                            <span className="w-30 text-md fw-semibold text-primary-light">
                                                {" "}Account
                                            </span>
                                            <span className="w-70 text-secondary-light fw-medium tw-capitalize">
                                                : {userDetails.role.name}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card h-100">
                            <div className="card-body p-24">

                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                <form onSubmit={handleSubmit}>
                                    <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                    {/* Upload Image Start */}
                                    <div className="mb-24 mt-16">
                                        <div className="avatar-upload">
                                            <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept=".png, .jpg, .jpeg"
                                                    hidden
                                                    onChange={readURL}
                                                />
                                                <label
                                                    htmlFor="imageUpload"
                                                    className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                                >
                                                    <Icon icon="solar:camera-outline" className="icon"></Icon>
                                                </label>
                                            </div>
                                            <div className="avatar-preview">
                                                <div
                                                    id="imagePreview"
                                                    style={{
                                                        backgroundImage: `url(${imagePreview})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Upload Image End */}
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                    Full Name <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control radius-8 tw-rounded ${errors.name ? 'is-invalid' : ''}`}
                                                    id="name"
                                                    placeholder="Enter Full Name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control radius-8 tw-rounded ${errors.email ? 'is-invalid' : ''}`}
                                                    id="email"
                                                    placeholder="Enter email address"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label htmlFor="phone_number" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8 tw-rounded"
                                                    id="phone_number"
                                                    placeholder="Enter phone number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-20">
                                            <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                New Password <span className="text-danger-600">*</span>
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type={passwordVisible ? "text" : "password"}
                                                    className="form-control radius-8 tw-rounded"
                                                    id="your-password"
                                                    placeholder="Enter New Password*"
                                                />
                                                <span
                                                    className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                    onClick={togglePasswordVisibility}
                                                ></span>
                                            </div>
                                        </div>
                                        <div className="mb-20">
                                            <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                Confirm Password <span className="text-danger-600">*</span>
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type={confirmPasswordVisible ? "text" : "password"}
                                                    className="form-control radius-8 tw-rounded tw-bg-none"
                                                    id="confirm-password"
                                                    placeholder="Confirm Password*"
                                                />
                                                <span
                                                    className={`toggle-password ${confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                    onClick={toggleConfirmPasswordVisibility}
                                                ></span>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="mb-20">
                                                <label htmlFor="description" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="form-control radius-8"
                                                    id="description"
                                                    placeholder="Write description..."
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminDashboard>
            <CookiesV />
        </>
    );
}

export default Profile;
