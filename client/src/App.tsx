import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { CreateArticle } from './pages/CreateArticle'
import { Settings } from './pages/Settings'
import { ArticleList } from './pages/ArticleList'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/articles/create" element={<CreateArticle />} />
          <Route path="/articles/edit/:id" element={<CreateArticle />} />
          <Route path="/articles/my" element={<ArticleList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App 