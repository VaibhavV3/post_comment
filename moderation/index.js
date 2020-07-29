const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }

  res.send({});
});

app.listen(4003, async () => {
  console.log('Listening on 4003');

  const res = await axios.get('http://localhost:4005/events');

  for (let event of res.data) {
    console.log('Processing event:', event.type);

    if (event.type === 'CommentCreated') {
      const status = event.data.content.includes('orange') ? 'rejected' : 'approved';
  
      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: event.data.id,
          postId: event.data.postId,
          status,
          content: event.data.content
        }
      });
  }

}

});
