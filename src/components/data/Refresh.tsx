import { useState } from 'react';

export default function useRefresh() {
   const [refresh, setRefresh] = useState(true);
   const refreshNow = () => {
      setRefresh(!refresh);
   };
   return {refresh, refreshNow};
}
