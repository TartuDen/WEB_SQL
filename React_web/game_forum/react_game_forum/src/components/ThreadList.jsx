// Example: ThreadList component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      const res = await axios.get('/api/threads');
      setThreads(res.data);
    };

    fetchThreads();
  }, []);

  return (
    <div>
      {threads.map(thread => (
        <div key={thread.id}>
          <h2>{thread.title}</h2>
          <p>{thread.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
