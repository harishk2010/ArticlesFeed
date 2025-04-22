import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  likes: string[];
  dislikes: string[];
  blocks: string[];
  createdAt: string;
}

export const ArticleList: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      console.log(user,"user")
      const response = await apiService.getArticlesByAuthor(user?._id || '');
      setArticles(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await apiService.deleteArticle(articleId);
      setArticles(articles.filter(article => article._id !== articleId));
      // setSelectedArticle(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleEdit = (articleId: string) => {
    navigate(`/articles/edit/${articleId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchArticles}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
          <button
            onClick={() => navigate('/articles/create')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create New Article
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't created any articles yet.</p>
            <button
              onClick={() => navigate('/articles/create')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Your First Article
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{article.category}</span>
                    <span>
                      {format(new Date(article.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <span>👍</span>
                      <span>{article.likes.length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👎</span>
                      <span>{article.dislikes.length}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🚫</span>
                      <span>{article.blocks.length}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(article._id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 