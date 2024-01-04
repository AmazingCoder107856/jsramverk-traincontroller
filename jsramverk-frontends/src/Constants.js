const production = {
    url: 'https://jsbackend-deploy-glpa22.azurewebsites.net'
};
const development = {
    url: 'http://localhost:1337'
};

export const config = process.env.NODE_ENV === 'development' ? development : production;