import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';

// Define types for form values
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage: File | null;
  [key: string]: string | string[] | File | null; // Add index signature
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface PreferencesFormValues {
  preferences: string[];
}

// Define user type
// interface User {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phone?: string;
//   dateOfBirth?: string;
//   preferences?: string[];
//   profileImage?: string;
// }

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const preferencesSchema = Yup.object().shape({
  preferences: Yup.array().of(Yup.string()),
});

const categories = [
  'Sports',
  'Politics',
  'Technology',
  'Science',
  'Entertainment',
  'Business',
  'Health',
  'Education',
];

export const Settings: React.FC = () => {
  const { user: currentUser, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const profileFormik = useFormik<ProfileFormValues>({
    initialValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      dateOfBirth: currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '',
      profileImage: null as File | null,
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          console.log("first",values[key])
          if (key === 'profileImage' && values.profileImage) {
            formData.append('profileImage', values.profileImage);
          } else {
            const value = values[key];
            if (value !== null && value !== undefined && typeof value !== 'object') {
              formData.append(key, String(value));
            }
          }
        });
        console.log(formData,"formdata")
        const response = await apiService.updateProfile(formData);
        setUser(response.data);
        setSuccess('Profile updated successfully');
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
        setSuccess(null);
      }
    },
  });

  const passwordFormik = useFormik<PasswordFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        await apiService.updatePassword(values);
        setSuccess('Password updated successfully');
        setError(null);
        passwordFormik.resetForm();
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
        setSuccess(null);
      }
    },
  });

  const preferencesFormik = useFormik<PreferencesFormValues>({
    initialValues: {
      preferences: currentUser?.preferences || [],
    },
    validationSchema: preferencesSchema,
    onSubmit: async (values) => {
      try {
        // Submit the array of preferences
        const response = await apiService.updatePreferences(values.preferences);
        console.log(response.data,"is user??")
        setUser(response.data);
        setSuccess('Preferences updated successfully');
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
        setSuccess(null);
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      profileFormik.setFieldValue('profileImage', event.target.files[0]);
    }
  };

  const handlePreferenceChange = (category: string) => {
    const currentPreferences = [...preferencesFormik.values.preferences];
    const categoryIndex = currentPreferences.indexOf(category);
    
    if (categoryIndex >= 0) {
      // Remove if already selected
      currentPreferences.splice(categoryIndex, 1);
    } else {
      // Add if not selected
      currentPreferences.push(category);
    }
    
    // Update formik state
    preferencesFormik.setFieldValue('preferences', currentPreferences);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Settings
            </h3>

            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`${
                    activeTab === 'password'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Password
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`${
                    activeTab === 'preferences'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Preferences
                </button>
              </nav>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="mt-6">
              {activeTab === 'profile' && (
                <form onSubmit={profileFormik.handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-full"
                        src={profileFormik.values.profileImage 
                          ? URL.createObjectURL(profileFormik.values.profileImage)
                          : currentUser?.profileImage || '/default-avatar.png'}
                        alt="Profile"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="profileImage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Profile Image
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="input mt-1"
                        value={profileFormik.values.firstName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                      />
                      {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                        <div className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="input mt-1"
                        value={profileFormik.values.lastName}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                      />
                      {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                        <div className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.lastName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="input mt-1"
                        value={profileFormik.values.email}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                      />
                      {profileFormik.touched.email && profileFormik.errors.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="input mt-1"
                        value={profileFormik.values.phone}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                      />
                      {profileFormik.touched.phone && profileFormik.errors.phone && (
                        <div className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="input mt-1"
                        value={profileFormik.values.dateOfBirth}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                      />
                      {profileFormik.touched.dateOfBirth && profileFormik.errors.dateOfBirth && (
                        <div className="text-red-500 text-sm mt-1">
                          {profileFormik.errors.dateOfBirth}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={profileFormik.isSubmitting}
                    >
                      {profileFormik.isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="input mt-1"
                      value={passwordFormik.values.currentPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                    />
                    {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && (
                      <div className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.currentPassword}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="input mt-1"
                      value={passwordFormik.values.newPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                    />
                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                      <div className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.newPassword}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPasswordConfirm"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="newPasswordConfirm"
                      name="newPasswordConfirm"
                      className="input mt-1"
                      value={passwordFormik.values.newPasswordConfirm}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                    />
                    {passwordFormik.touched.newPasswordConfirm && passwordFormik.errors.newPasswordConfirm && (
                      <div className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.newPasswordConfirm}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={passwordFormik.isSubmitting}
                    >
                      {passwordFormik.isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'preferences' && (
                <form onSubmit={preferencesFormik.handleSubmit} className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Select your interests</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={preferencesFormik.values.preferences.includes(category)}
                            onChange={() => handlePreferenceChange(category)}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={preferencesFormik.isSubmitting}
                    >
                      {preferencesFormik.isSubmitting ? 'Updating...' : 'Update Preferences'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};