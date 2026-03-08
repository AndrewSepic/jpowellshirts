'use client';

import { useContactModal } from '@/providers/ContactModalContext';

interface ContactButtonProps {
  label?: string;
  className?: string;
}

export default function ContactButton({
  label = 'Contact Us',
  className = 'bg-sky-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-800 transition-colors cursor-pointer',
}: ContactButtonProps) {
  const { openContactModal } = useContactModal();
  return (
    <button onClick={openContactModal} className={className}>
      {label}
    </button>
  );
}
