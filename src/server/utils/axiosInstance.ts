import axios from 'axios';

const axiosInstanceWithUserAdgent = axios.create({
  headers: {
    'User-Agent': 'github.com/vaTheo/Geonote-Backend/V0.1',
  },
});

export default axiosInstanceWithUserAdgent;
