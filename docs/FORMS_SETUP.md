# 🛠️ Signal Forms Setup Guide

This guide walks you through setting up Angular Signal Forms in your project and configuring the workshop environment.

## 📋 Prerequisites

### System Requirements
- Node.js 18+ 
- Angular CLI 18+
- Modern browser with JavaScript enabled
- Code editor (VS Code recommended)

### Angular Version
Signal Forms are experimental and require Angular 18.0.0 or later with the experimental forms package.

## 🚀 Project Setup

### 1. Install Dependencies

```bash
# Navigate to project root
cd shopping-cart-workshop

# Install all dependencies
npm install

# Install Signal Forms experimental package (if not already included)
npm install @angular/forms@experimental
```

### 2. Configure Angular Application

Update your `angular.json` to include Signal Forms:

```json
{
  "projects": {
    "shopping-cart-workshop": {
      "architect": {
        "build": {
          "options": {
            "experimentalSignalForms": true
          }
        }
      }
    }
  }
}
```

### 3. Enable Signal Forms in App Module

Update your main application configuration:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessSignalForms } from '@angular/forms/signals';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // Enable Signal Forms
    provideExperimentalZonelessSignalForms(),
    // ... other providers
  ]
});
```

### 4. Add Signal Forms Route

Update your application routes:

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... existing routes
  {
    path: 'signal-forms',
    loadChildren: () => import('./signal-forms/signal-forms.routes').then(m => m.signalFormsRoutes)
  }
];
```

### 5. Update Navigation

Add Signal Forms to your main navigation:

```typescript
// src/app/components/navigation/navigation.component.ts
export class NavigationComponent {
  navItems = [
    // ... existing items
    {
      path: '/signal-forms',
      label: 'Signal Forms Workshop',
      icon: '🔥'
    }
  ];
}
```

## 🔧 Development Environment

### VS Code Extensions

Recommended extensions for the best development experience:

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "angular.experimental-ivy": true,
  "angular.enable-strict-mode-prompt": false,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## 📦 Project Structure

The Signal Forms workshop follows this structure:

```
src/app/signal-forms/
├── components/              # Workshop task components
│   ├── product-form.component.ts
│   ├── checkout-form.component.ts
│   ├── user-profile-form.component.ts
│   └── review-form.component.ts
├── custom-controls/         # Reusable custom controls
│   ├── rating-control.component.ts
│   ├── quantity-selector.component.ts
│   └── price-input.component.ts
├── services/               # Form-related services
│   ├── signal-form.service.ts
│   ├── form-validation.service.ts
│   └── form-submission.service.ts
├── validators/             # Custom validators
│   ├── async-validators.ts
│   └── custom-validators.ts
├── signal-forms.component.ts    # Main workshop component
├── signal-forms.routes.ts       # Workshop routes
└── README.md              # Workshop-specific docs
```

## 🧪 Verification Steps

### 1. Start Development Server

```bash
npm start
```

The application should start on `http://localhost:4200`

### 2. Navigate to Signal Forms

Visit `http://localhost:4200/signal-forms` - you should see the workshop interface.

### 3. Check Browser Console

Look for these confirmation messages:
```
✅ Signal Forms enabled
📝 Workshop components loaded
🔧 Services initialized
```

### 4. Test Basic Functionality

1. Click through each workshop tab
2. Verify components load without errors
3. Check that form fields are interactive
4. Confirm validation messages appear

## ⚠️ Common Setup Issues

### Issue: "Cannot find module '@angular/forms/signals'"

**Solution**: 
```bash
npm install @angular/forms@next
# or 
npm install @angular/forms@experimental
```

### Issue: "Signal Forms not enabled"

**Solution**: Ensure you've added the provider:
```typescript
provideExperimentalZonelessSignalForms()
```

### Issue: Components not loading

**Solution**: Check import paths in `signal-forms.component.ts`:
```typescript
import { ProductFormComponent } from './components/product-form.component';
```

### Issue: Routing not working

**Solution**: Verify route configuration in `app.routes.ts` and ensure lazy loading is set up correctly.

## 🎯 Development Workflow

### 1. Before Starting Workshop

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Start development server
npm start

# Open workshop in browser
open http://localhost:4200/signal-forms
```

### 2. During Development

```bash
# Run tests in watch mode
npm run test:watch

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### 3. Completing Tasks

1. Navigate to the specific component file
2. Look for `TODO:` comments for guidance
3. Implement the required functionality
4. Test in browser
5. Run tests to verify implementation

## 📊 Performance Configuration

### Enable Ivy Renderer

Ensure Ivy is enabled in `angular.json`:

```json
{
  "projects": {
    "shopping-cart-workshop": {
      "architect": {
        "build": {
          "options": {
            "aot": true,
            "buildOptimizer": true
          }
        }
      }
    }
  }
}
```

### Optimize for Development

Add development optimizations in `angular.json`:

```json
{
  "serve": {
    "options": {
      "hmr": true,
      "liveReload": true,
      "poll": 1000
    }
  }
}
```

## 🔐 Security Considerations

### Content Security Policy

If using CSP, allow inline styles for workshop components:

```html
<meta http-equiv="Content-Security-Policy" 
      content="style-src 'self' 'unsafe-inline';">
```

### Local Storage

The workshop uses localStorage for form persistence. Ensure it's enabled in your browser.

## 📱 Mobile Development

### Responsive Testing

Test the workshop on different screen sizes:

```bash
# Install mobile testing tools
npm install -g device-simulator-cli

# Start with mobile simulation
device-simulator start --device="iPhone 12"
```

### Touch Support

Ensure touch events work correctly on custom controls by testing on actual mobile devices or browser dev tools.

## 🚀 Production Deployment

### Build for Production

```bash
# Build with production optimizations
npm run build:prod

# Verify build output
ls -la dist/shopping-cart-workshop/
```

### Environment Configuration

Configure different environments in `src/environments/`:

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  signalFormsEnabled: true,
  apiUrl: 'https://api.yourapp.com'
};
```

## 📋 Troubleshooting Checklist

Before starting the workshop, verify:

- [ ] Angular CLI is version 18+
- [ ] Project dependencies are installed
- [ ] Development server starts without errors
- [ ] Signal Forms route is accessible
- [ ] Browser console shows no critical errors
- [ ] All workshop components load correctly
- [ ] Form interactions work as expected
- [ ] Custom controls render properly

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify your Angular and Node.js versions
3. Review the troubleshooting section
4. Check the [Angular Signal Forms documentation](https://angular.dev/guide/forms)
5. Post questions in the workshop discussion forum

## 📚 Additional Resources

- [Angular CLI Documentation](https://angular.io/cli)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [VS Code Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)
- [Signal Forms GitHub Repository](https://github.com/angular/angular/tree/main/packages/forms/signals)

---

You're now ready to start the Signal Forms workshop! 🎉