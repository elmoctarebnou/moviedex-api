'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const data = require('./movies-data.json');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(function handleAuthorization (req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if(!apiToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request!'});
  }
  next();
});
const handleMovieSearch = (req, res) => {
  const {genre, country, avg_vote} = req.query;
  if(genre){
    const result = data.filter((movie) => movie.genre.toLowerCase() === genre.toLowerCase());
    res.send(result);
  }
  if(country){
    const result = data.filter((movie) => movie.country.toLowerCase().includes(country.toLowerCase()));
    res.send(result);
  }
  if(avg_vote){
    const rating = parseInt(avg_vote);
    const result = data.filter((movie) => movie.avg_vote >= rating);
    res.send(result);
  }
};
app.get('/movie', handleMovieSearch);

const PORT = 9000;
app.listen(PORT, console.log(`Server listen at http://localhost:${PORT}`));
