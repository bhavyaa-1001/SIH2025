const request = require('supertest');
const app = require('../server');

describe('Rainfall API', () => {
    it('should return a rainfall prediction', async () => {
        const res = await request(app)
            .post('/api/rainfall/predict')
            .send({
                lat: 12.9716,
                lon: 77.5946
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('annual_rainfall');
    });
});