import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiService } from '../services/api';

const articleSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  category: Yup.string().required('Category is required'),
  tags: Yup.array().of(Yup.string()),
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

 export const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get article ID from URL if editing
  const isEditMode = Boolean(id);
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      category: '',
      tags: [] as string[],
    },
    validationSchema: articleSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('content', values.content);
        formData.append('category', values.category);
        values.tags.forEach((tag) => formData.append('tags[]', tag));
        if (image) {
          formData.append('image', image);
        }

        if (isEditMode) {
          await apiService.updateArticle(id as string, formData);
        } else {
          await apiService.createArticle(formData);
        }
        
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    },
  });

  // Fetch article data if in edit mode
  useEffect(() => {
    const fetchArticleData = async () => {
      if (!isEditMode) return;
      
      try {
        setIsLoading(true);
        const articleData = await apiService.getArticleById(id as string) as any;
        console.log("first",articleData)
       
        // Prefill form with existing data
        formik.setValues({
          title: articleData.data.title || '',
          content: articleData.data.content || '',
          category: articleData.data.category || '',
          tags: articleData.data.tags || [],
        });
        
        // Set image preview if exists
        if (articleData.data.imageUrl) {
          setImagePreview(articleData.data.imageUrl);
        }
        
        setIsLoading(false);
      } catch (err: any) {
        setError('Failed to load article data');
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [id, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin mx-auto h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-indigo-600 font-medium">Loading article data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {isEditMode ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Article Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter a compelling title for your article"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.title}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <select
                      id="category"
                      name="category"
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-none"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.category}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags (comma separated)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="news, trending, tech, etc."
                      value={formik.values.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean);
                        formik.setFieldValue('tags', tags);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Article Content
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="content"
                    name="content"
                    rows={12}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Write your article content here..."
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                </div>
                {formik.touched.content && formik.errors.content && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.content}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Featured Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                  <div className="space-y-2 text-center">
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-48 max-w-full rounded-md object-contain mb-4" 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input 
                              id="image" 
                              name="image" 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Publishing...'}
                    </div>
                  ) : (
                    isEditMode ? 'Update Article' : 'Publish Article'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
