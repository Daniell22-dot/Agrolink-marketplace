# Contributing to AgroLink

Thank you for your interest in contributing to AgroLink! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- **Be respectful**: Treat all contributors with respect and dignity
- **Be inclusive**: Welcome people of all backgrounds and skill levels
- **Be constructive**: Provide helpful feedback and support
- **Be professional**: Keep discussions focused on the project

## Getting Started

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/daniell22-dot/agrolink.git
   cd agrolink
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/agrolink.git
   ```

### Set Up Development Environment

1. Follow the setup instructions in [README.md](README.md)
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make sure all tests pass before starting work:
   ```bash
   npm test
   ```

## Development Workflow

### Before You Start

1. Check existing issues and pull requests to avoid duplicate work
2. Create an issue describing your planned changes (for major features)
3. Discuss your approach with maintainers to ensure alignment

### Writing Code

#### Code Style

- Use consistent indentation (2 spaces for JavaScript/YAML, 4 for Python)
- Follow existing code patterns in the repository
- Use meaningful variable and function names
- Add comments for complex logic

#### JavaScript/Node.js
- Use ES6+ syntax
- Follow the existing code style (check `.eslintrc`)
- Use async/await instead of callbacks
- Add JSDoc comments to functions

```javascript
/**
 * @desc    Get trending products
 * @param   {number} limit - Number of products to return
 * @returns {Promise<Array>} Array of product objects
 */
async function getTrendingProducts(limit = 10) {
    // Implementation
}
```

#### Python
- Follow PEP 8 style guide
- Use type hints for function parameters
- Add docstrings to functions and classes

```python
def get_trending_products(limit: int = 10) -> List[dict]:
    """
    Get trending products based on sales and interactions.
    
    Args:
        limit: Number of products to return
        
    Returns:
        List of product dictionaries with trending scores
    """
    # Implementation
```

#### React/Frontend
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Extract reusable logic to custom hooks

```jsx
/**
 * ProductCard component displaying product information
 * @param {Object} product - Product data object
 * @param {Function} onSelect - Callback when product is selected
 */
function ProductCard({ product, onSelect }) {
    return (
        // JSX
    );
}
```

### Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage on new code

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run Python tests
python -m pytest
```

### Commit Messages

Use clear, descriptive commit messages following this format:

```
[Type] Brief description

Detailed explanation of changes (if needed)

- Point 1
- Point 2

Fixes #issue-number (if applicable)
```

Types:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring without feature changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Dependency updates, build changes, etc.

Examples:
```
feat: Add price prediction endpoint for farmers

- Integrate Python ML service for price forecasting
- Add endpoint /api/pricing/predict
- Include form validation and error handling

Fixes #123
```

```
fix: Correct email case sensitivity in login

- Normalize email to lowercase before database lookup
- Add toLowerCase() to auth validator
- Update authController to use LOWER() SQL function
```

## Submitting Changes

### Before Creating a Pull Request

1. Update your branch with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Run all tests and linters:
   ```bash
   npm test
   npm run lint
   ```

3. Build the project to ensure no errors:
   ```bash
   npm run build
   ```

### Creating a Pull Request

1. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create Pull Request on GitHub with:
   - Clear, descriptive title
   - Description of changes made
   - Reference to related issues
   - Screenshots/videos if UI changes
   - Testing instructions

3. PR Template:
   ```markdown
   ## Description
   Brief description of the changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Related Issues
   Fixes #(issue number)
   
   ## Testing
   - [ ] Tested on development environment
   - [ ] Added/updated tests
   - [ ] All tests passing
   
   ## Screenshots (if applicable)
   Add images showing UI changes
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

### Pull Request Review Process

1. At least one maintainer review is required
2. All CI checks must pass
3. Address review feedback or discuss concerns
4. Squash commits before merging (if requested)
5. Update branch before merging if conflicts exist

## Project Structure Guidelines

When adding new features, follow this structure:

### Backend (Node.js)
```
backend/src/
├── api/
│   ├── controllers/     # Route handlers
│   ├── routes/          # Route definitions
│   ├── middleware/      # Express middleware
│   └── validators/      # Input validation
├── models/              # Sequelize models
├── services/            # Business logic
├── utils/               # Helper functions
├── config/              # Configuration
└── jobs/                # Background jobs
```

### Frontend (React)
```
frontend/src/
├── components/          # Reusable components
├── pages/               # Page components/routes
├── hooks/               # Custom hooks
├── services/            # API calls
├── redux/               # State management
├── utils/               # Helper functions
└── assets/              # Images, icons, etc.
```

### Python Services
```
python-services/
├── app.py               # Main FastAPI app
├── services/            # Business logic
│   ├── recommendations.py
│   ├── analytics.py
│   ├── price_predictor.py
│   └── image_processor.py
├── models/              # ML models (git-ignored)
└── requirements.txt     # Dependencies
```

## Documentation

When contributing, please update relevant documentation:

1. **Code Comments**: Add comments for complex logic
2. **README.md**: Update if adding major features
3. **API Docs**: Document new endpoints in `docs/api/`
4. **Docstrings**: Add function/class documentation
5. **CHANGELOG**: Add entry for significant changes

## Bug Reports

When reporting bugs, include:

1. **Environment**: OS, Node/Python version, npm/pip version
2. **Steps to Reproduce**: Clear steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots/Logs**: Error messages or console output
6. **Code Snippet**: Code that triggers the issue (if applicable)

Example:
```markdown
## Bug Report: Login fails with correct credentials

**Environment:**
- Windows 10
- Node.js v16.13.0
- npm 8.1.0

**Steps to Reproduce:**
1. Go to login page
2. Enter email: test@example.com
3. Enter password: correct_password
4. Click login button

**Expected Behavior:**
User should be logged in and redirected to dashboard

**Actual Behavior:**
Shows "Invalid credentials" error

**Error Log:**
```
Error: LOWER() is not a function in mysql query
```

**Screenshots:**
[Attach image]
```

## Feature Requests

When suggesting features, include:

1. **Description**: Clear description of the feature
2. **Use Case**: Why this feature is needed
3. **Proposed Solution**: How you envision it working
4. **Alternatives**: Other approaches considered

Example:
```markdown
## Feature Request: Export Sales Report to CSV

**Description:**
Add ability to export sales reports as CSV files for external analysis

**Use Case:**
Admins want to analyze sales data in Excel for detailed reporting

**Proposed Solution:**
Add "Export CSV" button to sales report dashboard that downloads data

**Alternatives:**
- JSON export (less common for non-technical users)
- PDF export (less flexible for analysis)
```

## Performance & Accessibility

### Performance Considerations
- Minimize database queries (use eager loading)
- Cache frequently accessed data (Redis)
- Lazy load images and components
- Optimize bundle size
- Monitor API response times

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML
- Add alt text to images
- Ensure keyboard navigation
- Test with screen readers

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [JavaScript Style Guide](https://standardjs.com/)
- [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Questions or Need Help?

- Open an issue with the `question` label
- Join our Discord community (if available)
- Contact maintainers directly
- Check existing issues and discussions

## License

By contributing to AgroLink, you agree that your contributions will be licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.

---

Thank you for contributing to AgroLink! We appreciate your effort in making this project better. 🙏

*Last Updated: April 2026*
