import './App.css';
import ListUserBlogs from './components/list_user_blogs';
import CreateBlogView from './components/create_blog';
import { AuthProvider } from './hooks/auth';
import { ProtectRoutes } from './components/protected_route';
import { Route, Routes } from 'react-router';
import SignUpView from './routes/sign_up';
import LoginView from './routes/login';
import ProfileView from './components/profile_view';
import BlogView from './components/blog_view';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<CreateBlogView />} />
        <Route path="/sign-up" element={<SignUpView />} />
        <Route path="/login" element={<LoginView />} />
        <Route element={ <ProtectRoutes /> }>
          <Route path='/' element={ <SignUpView /> } />
        </Route>
        <Route element={ <ProtectRoutes /> }>
          <Route path='/users/:id' element={ <ProfileView /> } />
        </Route>
        <Route element={ <ProtectRoutes /> }>
          <Route path='/blogs/:id' element={ <BlogView /> } />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App;
