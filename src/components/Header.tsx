'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <h1 className="text-xl font-semibold">NBA Teams App</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Welcome, {username}</span>
          <Button variant="outline" onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
