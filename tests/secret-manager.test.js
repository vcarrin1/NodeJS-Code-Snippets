const { getSecret } = require('../google-cloud-provider/secret-manager');
let gcpMetadata = require('gcp-metadata');

jest.mock('gcp-metadata');

const versions = [
    {
        name: 'projects/74390034/secrets/ACCESS_KEY/versions/2',
        createTime: { seconds: '1725653856', nanos: 943110000 },
        state: 'DISABLED'
    },
    {
        name: 'projects/74390034/secrets/ACCESS_KEY/versions/1',
        createTime: { seconds: '1709052491', nanos: 685270000 },
        state: 'ENABLED'
    }
];

jest.mock('@google-cloud/secret-manager', () => {
    return {
        SecretManagerServiceClient: jest.fn().mockImplementation(() => {
            return {
                accessSecretVersion: jest.fn().mockResolvedValue([{
                    payload: { data: Buffer.from('mocked-secret') }
                }
            ]),
            listSecretVersions: jest.fn().mockResolvedValue([versions])
            };
        })
    };
});

describe('Secret Manager', () => {
    beforeEach(() => {
        gcpMetadata.project = jest.fn().mockResolvedValueOnce('74390034');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should access secret', async () => {
        const secret = await getSecret('ACCESS_KEY');
        expect(secret).toEqual('mocked-secret');
    });
});