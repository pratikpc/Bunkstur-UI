import { useEffect, useState } from "react";

export default function Subjects(sendRequest: (url: string)=>any){
   const [subjects, setSubjects] = useState<string[]>([]);
   useEffect(() => {
    async function PerformAsync() {
       try {
          const subjects = await sendRequest(`subjects`);
          setSubjects(subjects);
       } catch (err) {
          console.error(err);
       }
    }
    PerformAsync();
 }, []);
   return subjects;
}
