import './App.css';
import ListUserBlogs from './components/list_user_blogs';
import CreateBlogView from './components/create_blog';
import { AuthProvider } from './hooks/auth';
import { ProtectRoutes } from './components/protected_route';
import { Route, Routes, useLocation } from 'react-router';
import SignUpView from './routes/sign_up';
import LoginView from './routes/login';
import ProfileView from './components/profile_view';
import BlogView from './components/blog_view';
import HomePage from './routes/homepage';
import BlogsSection from './routes/blog_section';
import EditBlogView from './components/edit_blog';
import ManageBlogsView from './components/manage_blogs';
import BrowseBlogs from './routes/browse_blogs';
import BlogDetail from './components/blog_view';
import Navbar from './components/navbar';

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/sign-up" element={<SignUpView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path='/' element={<HomePage />} />

        <Route element={<ProtectRoutes />}>
          <Route path='/users/:id' element={<ProfileView />} />
          <Route path='/blogs' element={<BlogsSection />} />
          <Route path='/blogs/new' element={<CreateBlogView />} />
          <Route path='/blogs/manage' element={<ManageBlogsView />} />
          <Route path='/blogs/:id/edit' element={<EditBlogView />} />
          <Route path='/blogs/browse' element={<BrowseBlogs />} />
          <Route path='/blogs/:id' element={<BlogDetail />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
