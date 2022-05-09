# Attractions Map Interface


## Components
- Material UI
- [Date-fns](https://date-fns.org/): Date Formatting
- React Google Maps
- Google Map React: Render map component
- [Rapid Travel Advisor API](https://rapidapi.com/apidojo/api/travel-advisor/): Gets a list of attractions


## Supported Device Types
- Desktop
- Mobile


## Future Enhancements
- Implement a filter for the attraction types. (State Parks, National Parks, Museums, Landmarks, ...)


## Features
### Login
- User is able to input an email address
- User is able to input a password
- User can toggle between show and hide password
- User can reset password
- User can go to Sign Up page to register
- Upon successful login user will be redirected to correct landing page based on user role

### SignUp
- User is able to enter Display Name and Email
- User is able to choose a password
- User is made aware of password requirements
- User is made aware if the inputs doesn't meet criteria
- Upon successful login user is redirected to user page

### User Home
- User is able to request a password change
- User is able to see their Display Name and Email listed
- User is able see account age, which is showing how old the account is
- User is able to see a Security section that shows the last time account was updated
- User sees a logout button and upon pressing is redirected back to the login page

### Attraction Map
- User is able to see nearby attractions on a map and in a list view
- User is able to search attractions around any given location string
- User is able to click on the map marker to see the attraction details
