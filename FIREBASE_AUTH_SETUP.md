# Firebase Auth Setup Guide

## Overview

This application uses Firebase Authentication with custom handling for password reset and email verification flows. The setup includes:

1. **Firebase Auth Handler Component** - Handles Firebase Auth action URLs
2. **Custom Reset Password Page** - Processes password reset codes
3. **Proper URL Configuration** - Ensures Firebase Auth redirects work correctly

## How It Works

### 1. Password Reset Flow

1. User requests password reset from `/forgot-password`
2. Firebase sends email with reset link to `/__/auth/action`
3. `FirebaseAuthHandler` component intercepts the action
4. For password reset, it redirects to `/reset-password` with the code
5. `ResetPassword` component processes the code and allows password change

### 2. Email Verification Flow

1. User signs up and receives verification email
2. Email contains link to `/__/auth/action`
3. `FirebaseAuthHandler` processes the verification
4. User is redirected to login with success message

## Configuration Files

### Firebase Config (`src/firebase/config.ts`)
- Configures Firebase Auth to use the app directly
- Sets up language preferences
- Includes development emulator support

### Firebase Hosting (`firebase.json`)
- Handles `/__/auth/action` rewrites
- Sets proper cache headers for auth actions

### Netlify Redirects (`public/_redirects`)
- Ensures Firebase Auth URLs work on Netlify
- Redirects all routes to `index.html` for SPA

### Vite Config (`vite.config.ts`)
- Configures development server for Firebase Auth
- Sets up proxy for auth action URLs

## URL Structure

### Firebase Auth Action URLs
```
/__/auth/action?mode=resetPassword&oobCode=...&apiKey=...&continueUrl=...
/__/auth/action?mode=verifyEmail&oobCode=...&apiKey=...&continueUrl=...
```

### Custom App URLs
```
/reset-password?oobCode=...
/verify-email
/forgot-password
```

## Troubleshooting

### Common Issues

1. **"Invalid verification code" error**
   - Check if Firebase Auth action URL is being handled correctly
   - Verify `FirebaseAuthHandler` component is properly configured
   - Ensure redirects are set up in hosting configuration

2. **Code not found in URL**
   - Check URL parameter extraction logic in `ResetPassword` component
   - Verify Firebase is sending the correct URL format
   - Test with different parameter names (oobCode, code, actionCode)

3. **Firebase Auth action not working**
   - Ensure `/__/auth/action` route is properly configured
   - Check that `FirebaseAuthHandler` is imported and used
   - Verify hosting redirects are in place

### Debug Information

The application includes extensive debug logging in development mode:

- Full URL logging
- Parameter extraction details
- Firebase Auth action detection
- Code verification steps

### Testing

1. **Development Testing**
   - Use Firebase Auth emulator for testing
   - Check browser console for debug information
   - Test with different email providers

2. **Production Testing**
   - Deploy to staging environment first
   - Test with real Firebase Auth
   - Verify redirects work on hosting platform

## Security Considerations

1. **Code Expiration**
   - Firebase Auth codes expire automatically
   - Handle expired codes gracefully
   - Provide clear error messages

2. **URL Validation**
   - Validate all parameters before processing
   - Check operation type matches expected action
   - Sanitize user inputs

3. **Error Handling**
   - Don't expose sensitive information in error messages
   - Log errors for debugging but show user-friendly messages
   - Handle all possible Firebase Auth error codes

## Future Improvements

1. **Enhanced Error Handling**
   - More specific error messages
   - Better user guidance for common issues
   - Retry mechanisms for failed operations

2. **Analytics Integration**
   - Track successful/failed auth operations
   - Monitor user flow through auth process
   - Identify common failure points

3. **Accessibility**
   - Screen reader support for auth flows
   - Keyboard navigation improvements
   - High contrast mode support 