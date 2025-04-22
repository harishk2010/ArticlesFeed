import { useState, useEffect } from 'react';
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
    firstName: string;
    lastName: string;
  };
  likes: string[];
  dislikes: string[];
  blocks: string[];
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articlesData, setArticlesData] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getFeed();
        console.log(response,"response")
        setArticlesData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleReaction = async (articleId: string, type: 'likes' | 'dislikes' | 'blocks') => {
    try {
      const article = articlesData?.find((a) => a._id === articleId);
      if (!article || !user?._id) return;

      const hasReaction = article[type].includes(user._id);
      
      // Optimistically update UI
      setArticlesData(prevArticles => 
        prevArticles.map(a => {
          if (a._id !== articleId) return a;
          
          const updatedReactions = [...a[type]];
          if (hasReaction) {
            // Remove user ID from reaction array
            const index = updatedReactions.indexOf(user._id);
            if (index > -1) updatedReactions.splice(index, 1);
          } else {
            // Add user ID to reaction array
            updatedReactions.push(user._id);
          }
          
          return { ...a, [type]: updatedReactions };
        })
      );
      
      // Send API request
      if (hasReaction) {
        await apiService.removeReaction(articleId, type);
      } else {
        await apiService.addReaction(articleId, type);
      }
      
      // Refresh data to ensure consistency
      const response = await apiService.getFeed();
      setArticlesData(response.data);
    } catch (error) {
      console.error('Error handling reaction:', error);
      // Revert optimistic update if request fails
      const response = await apiService.getFeed();
      setArticlesData(response.data);
    }
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
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Feed</h1>
          
          {articlesData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found in your feed.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articlesData.map((article) => (
                <div
                  key={article._id}
                  className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.category}</span>
                      <span>
                        {format(new Date(article.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(article._id, 'likes');
                        }}
                        className={`flex items-center space-x-1 ${
                          user?._id && article.likes.includes(user._id)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>👍</span>
                        <span>{article.likes.length}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(article._id, 'dislikes');
                        }}
                        className={`flex items-center space-x-1 ${
                          user?._id && article.dislikes.includes(user._id)
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>👎</span>
                        <span>{article.dislikes.length}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(article._id, 'blocks');
                        }}
                        className={`flex items-center space-x-1 ${
                          user?._id && article.blocks.includes(user._id)
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>🚫</span>
                        <span>Block</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedArticle.title}
                </h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedArticle.content}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>By {selectedArticle.author.firstName} {selectedArticle.author.lastName}</span>
                <span>
                  {format(new Date(selectedArticle.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};