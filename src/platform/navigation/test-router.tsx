/**
 * Test file to verify Router exports are working
 */

import { useNavigate, useLocation, Router, Routes, Route } from './Router';

// This should compile without errors if exports are correct
export function TestComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div>
      <button onClick={() => navigate('/')}>Home</button>
      <p>Current path: {location.pathname}</p>
    </div>
  );
}

// Verify all exports exist
export const testExports = {
  Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
};
