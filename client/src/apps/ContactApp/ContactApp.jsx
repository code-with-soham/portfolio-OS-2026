import { lazy } from 'react';

// ContactApp uses a standard layout, we'll build it.
const ContactApp = lazy(() => import('./index'));

export default ContactApp;
