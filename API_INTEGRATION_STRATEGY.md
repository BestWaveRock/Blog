# API Integration Strategy

## Base API Configuration

- **Base URL**: http://localhost:3000 (development) / deployed URL (production)
- **API Prefix**: All endpoints are prefixed with their respective modules
- **Authentication**: JWT tokens in Authorization header

## API Endpoints Mapping

### Authentication Module (`/auth`)
1. **POST `/auth/register`**
   - Request: CreateUserDto
   - Response: JWT token and user info
   
2. **POST `/auth/login`**
   - Request: LoginDto (email, password)
   - Response: JWT token and user info

### Users Module (`/users`)
1. **GET `/users/profile`** (JWT protected)
   - Response: Current user information
   
2. **GET `/users`** (Admin only)
   - Response: List of all users

### Articles Module (`/articles`)
1. **POST `/articles`** (JWT protected)
   - Request: CreateArticleDto
   - Response: Created article object
   
2. **GET `/articles`**
   - Query params: page, limit, status
   - Response: Paginated list of articles
   
3. **GET `/articles/:id`**
   - Response: Single article details
   
4. **PUT `/articles/:id`** (JWT protected)
   - Request: UpdateArticleDto
   - Response: Updated article object
   
5. **DELETE `/articles/:id`** (JWT protected)
   - Response: Success message
   
6. **POST `/articles/:id/publish`** (JWT protected)
   - Response: Published article object
   
7. **POST `/articles/:id/unpublish`** (JWT protected)
   - Response: Unpublished article object
   
8. **GET `/articles/search/:keyword`**
   - Query params: page, limit
   - Response: Paginated search results
   
9. **POST `/articles/:id/categories-tags`** (JWT protected)
   - Request: AddCategoriesTagsDto
   - Response: Updated article object

### Categories Module (`/categories`)
1. **POST `/categories`** (JWT protected)
   - Request: CreateCategoryDto
   - Response: Created category object
   
2. **GET `/categories`**
   - Response: List of all categories
   
3. **GET `/categories/:id`**
   - Response: Single category details
   
4. **PUT `/categories/:id`** (JWT protected)
   - Request: UpdateCategoryDto
   - Response: Updated category object
   
5. **DELETE `/categories/:id`** (JWT protected)
   - Response: Success message

### Tags Module (`/tags`)
1. **POST `/tags`** (JWT protected)
   - Request: CreateTagDto
   - Response: Created tag object
   
2. **GET `/tags`**
   - Response: List of all tags
   
3. **GET `/tags/:id`**
   - Response: Single tag details
   
4. **PUT `/tags/:id`** (JWT protected)
   - Request: UpdateTagDto
   - Response: Updated tag object
   
5. **DELETE `/tags/:id`** (JWT protected)
   - Response: Success message

## Authentication Strategy

1. **Login Flow**:
   - User submits login form
   - Call `/auth/login` endpoint
   - Store JWT token in localStorage/cookies
   - Set authentication state in context

2. **Request Interception**:
   - Add JWT token to Authorization header for protected routes
   - Handle 401 responses by redirecting to login

3. **Token Refresh**:
   - Implement automatic token refresh before expiration
   - Redirect to login on refresh failure

## Error Handling

1. **Network Errors**:
   - Display generic connection error messages
   - Implement retry mechanisms for critical requests

2. **API Errors**:
   - Parse and display validation error messages
   - Show appropriate error messages for different HTTP status codes
   - Log errors for debugging in development

3. **Loading States**:
   - Show loading indicators during API requests
   - Implement skeleton screens for better UX

## Data Caching Strategy

1. **SWR Implementation**:
   - Cache GET requests automatically
   - Implement revalidation on focus, interval, and mutation
   - Background updates for stale data

2. **Cache Keys**:
   - Use consistent key naming: `["resource", "id"]`
   - Invalidate cache on mutations

## File Structure for API Services

```
src/
  services/
    api.js              # Base API configuration
    auth.service.js     # Authentication endpoints
    articles.service.js # Articles endpoints
    categories.service.js # Categories endpoints
    tags.service.js     # Tags endpoints
    users.service.js    # Users endpoints
  hooks/
    useAuth.js          # Authentication hooks
    useArticles.js      # Articles data hooks
    useCategories.js    # Categories data hooks
    useTags.js          # Tags data hooks
  utils/
    http.client.js      # HTTP client wrapper
    error.handler.js    # Error handling utilities
```