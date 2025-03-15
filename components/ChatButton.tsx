"use client"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

export default function ChatButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/chat');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'k') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Button onClick={handleClick} variant="custom" size="sm">
      New Chat
    </Button>
  );
}