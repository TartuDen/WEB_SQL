import React from 'react';
import { Link } from 'react-router-dom';

const ThreadList = () => {
  const threads = [
    { id: 1, title: 'Thread 1' },
    { id: 2, title: 'Thread 2' },
  ];

  return (
    <div>
      <h2>Threads</h2>
      <ul>
        {threads.map(thread => (
          <li key={thread.id}>
            <Link to={`/thread/${thread.id}`}>{thread.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadList;
