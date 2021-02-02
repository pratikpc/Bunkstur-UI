import { useState } from 'react';

export default function Open(defaultV = false) {
   const [isOpen, setOpen] = useState(defaultV);
   const open = () => {
      setOpen(true);
   };
   const close = () => {
      setOpen(false);
   };
   return { isOpen, open, close };
}
