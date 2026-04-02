# Frontend Routing Structure

## Public Routes

### Home Route
- **Path**: `/`
- **Component**: HomePage
- **Description**: Landing page with featured articles, recent posts, and newsletter signup

### Article Routes
- **Path**: `/articles`
- **Component**: ArticlesPage
- **Description**: Listing page for all published articles with filtering capabilities

- **Path**: `/articles/:id`
- **Component**: ArticleDetailPage
- **Description**: Individual article page with full content, author info, and comments

### Search Routes
- **Path**: `/search/:keyword`
- **Component**: SearchResultsPage
- **Description**: Search results page showing articles matching the keyword

### Authentication Routes
- **Path**: `/login`
- **Component**: LoginPage
- **Description**: User login form

- **Path**: `/register`
- **Component**: RegisterPage
- **Description**: User registration form

## Protected Routes (User)

### Profile Routes
- **Path**: `/profile`
- **Component**: UserProfilePage
- **Description**: User profile management page

- **Path**: `/profile/articles`
- **Component**: UserArticlesPage
- **Description**: User's own articles listing

- **Path**: `/profile/articles/new`
- **Component**: ArticleEditorPage
- **Description**: Create new article page

- **Path**: `/profile/articles/:id/edit`
- **Component**: ArticleEditorPage
- **Description**: Edit existing article page

## Protected Routes (Admin)

### Admin Dashboard
- **Path**: `/admin`
- **Component**: AdminDashboard
- **Description**: Administrative dashboard with site statistics and quick actions

### User Management
- **Path**: `/admin/users`
- **Component**: UserManagementPage
- **Description**: Manage all registered users

### Category Management
- **Path**: `/admin/categories`
- **Component**: CategoryManagementPage
- **Description**: Manage article categories

### Tag Management
- **Path**: `/admin/tags`
- **Component**: TagManagementPage
- **Description**: Manage article tags

## Error Routes

### Not Found
- **Path**: `*`
- **Component**: NotFoundPage
- **Description**: Page not found error page

### Unauthorized
- **Path**: `/unauthorized`
- **Component**: UnauthorizedPage
- **Description**: Access denied page for unauthorized users

## Route Protection Strategy

1. **Public Routes**: Accessible to all users
2. **Authenticated Routes**: Require valid JWT token
3. **Admin Routes**: Require valid JWT token with admin privileges
4. **Role-based Guards**: Implemented at the route level to check user permissions

## Implementation Approach

Using Next.js, the routing will be implemented through the file-based routing system:

```
pages/
  index.tsx                    # Home page
  articles/
    index.tsx                  # Articles listing
    [id].tsx                   # Individual article
  search/
    [keyword].tsx              # Search results
  login.tsx                    # Login page
  register.tsx                 # Registration page
  profile/
    index.tsx                  # User profile
    articles/
      index.tsx                # User's articles
      new.tsx                  # New article
      [id]/
        edit.tsx               # Edit article
  admin/
    index.tsx                  # Admin dashboard
    users.tsx                  # User management
    categories.tsx             # Category management
    tags.tsx                   # Tag management
  404.tsx                      # Not found page
  unauthorized.tsx             # Unauthorized page
  _app.tsx                     # Application wrapper with layout
  _document.tsx                # Custom document
```

## Middleware for Route Protection

1. **Authentication Check**: Verify JWT token validity
2. **Role Verification**: Check user roles for admin routes
3. **Redirect Logic**: 
   - Unauthenticated users attempting to access protected routes → redirect to login
   - Authenticated users accessing auth routes (login/register) → redirect to home
   - Unauthorized access to admin routes → redirect to unauthorized page