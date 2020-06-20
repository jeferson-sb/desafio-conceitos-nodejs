const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs: techs.split(',').map((str) => str.trim()),
    likes: 0,
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      error: 'Repository not found.',
    });
  }

  const { likes } = repositories.find((repo) => repo.id === id);
  const updatedRepo = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  repositories.splice(repoIndex, 1);

  return response.sendStatus(204);
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  const { title, url, techs, likes } = repositories.find(
    (repo) => repo.id === id
  );
  const incrementedLikes = likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: incrementedLikes,
  };

  repositories[repoIndex] = repository;
  return response.status(201).json(repository);
});

module.exports = app;
