/* global it describe */

/**
 * Test file for checking train delay functions
 */

process.env.NODE_ENV = 'test';

import { should, use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { getDelayedTrains } from '../models/delayed.js';
import { getCodes } from '../models/codes.js';

should();
use(chaiHttp);

describe('delays', () => {
    describe('related functions', () => {
        it('getDelayedTrains should return delayed trains', async function() {
            let delayedTrains = await getDelayedTrains();

            expect(delayedTrains).to.be.an('array');
            expect(delayedTrains[0]).to.have.property("OperationalTrainNumber");
            expect(delayedTrains[0]).to.have.property("AdvertisedTimeAtLocation");
            expect(delayedTrains[0]).to.have.property("EstimatedTimeAtLocation");
            expect(delayedTrains[0]).to.have.property("ActivityId");
            expect(delayedTrains[0]).to.have.property("ActivityType");
            expect(Number(delayedTrains[0].OperationalTrainNumber)).to.be.a('number');
        });

        it('getCodes should return reason codes', async function() {
            let reasonCodes = await getCodes();

            expect(reasonCodes).to.be.an('array');
            expect(reasonCodes[0]).to.have.property("Code");
            expect(reasonCodes[0]).to.have.property("Level1Description");
            expect(reasonCodes[0]).to.have.property("Level2Description");
            expect(reasonCodes[0]).to.have.property("Level3Description");
            expect(reasonCodes[0].Code).to.not.be.an("undefined");
            expect(reasonCodes[0].Code).to.be.equal("ANA002");
        });
    });
});
