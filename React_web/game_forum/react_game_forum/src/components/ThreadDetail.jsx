import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);

  useEffect(() => {
    fetch(`/api/thread/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.json())
    .then(data => setThread(data));
  }, [id]);

  if (!thread) return <div>Loading...</div>;

  return (
    <div>
      <h2>{thread.title}</h2>
      <p>{thread.content}</p>
    </div>
  );
};

export default ThreadDetail;
