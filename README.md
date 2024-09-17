# Geonote

## Overview

This project provides users with a comprehensive score (out of 100) for a specific address in France. The score is calculated using various relevant data retrieved from public and open source APIs. 

## Features

The system analyzes and visualizes the following data points:

1. Drinking Water Quality
2. Soil Quality
3. Natural Disaster Occurrence
4. Building Energy Class
5. Nearby Hazardous Installations (SEVESO)
6. Natural Park
7. Flood Risk

## Functionality

1. **Score Calculation**: The system calculates a score out of 100 for the entered address based on the collected data.

2. **Data Retrieval**: All data is sourced from public and open source APIs to ensure transparency and reliability.

3. **Data Visualization**: Users can visualize the collected data on the site, allowing for a deeper understanding of the scores and potential issues associated with the analyzed address.

## Purpose

The core functionality of this site is to provide users with a comprehensive understanding of various factors affecting a specific address. By visualizing the data and providing a clear score, users can make informed decisions about potential residences or properties.

## Getting Started
Application available [here](https://geonote.fly.dev)

## Technologies Used

- [Node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Back-end
- [Nest.js](https://nestjs.com/) 
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [geolib](https://github.com/manuelbieh/geolib)
- [axios](https://axios-http.com/)

### Front-end
- [React](https://react.dev/)
- [MUI](https://mui.com/)

## Hosting

- The application is hosted on [fly.io](https://fly.io/).
- The database is hosted on [neon.tech](https://neon.tech/).

## External APIs

1. Address Search API: https://adresse.data.gouv.fr/api-doc/adresse
2. DPE Building Information: https://data.ademe.fr/
3. Water Quality: https://hubeau.eaufrance.fr/page/api-qualite-eau-potable
4. API Carto IGN: https://apicarto.ign.fr/api/doc/
5. API Georisque: https://www.georisques.gouv.fr/doc-api

## Contributing

If you want to have more information or work on a similar project, feel free to contact me. I'm open to collaboration and happy to share insights about this project.

## License

This project is open source and is distributed under the MIT License. Feel free to use, modify, and distribute the code as per the terms of the license.