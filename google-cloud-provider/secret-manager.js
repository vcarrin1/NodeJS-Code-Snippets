const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const gcpMetadata = require('gcp-metadata');

const client = new SecretManagerServiceClient();

/*
    * Get the latest enabled secret version from Google Cloud Secret Manager
    * @param {string} secretName - The name of the secret
    * @returns {object} - The latest secret version
    * Usage:
    * const latestVersion = await getLastestSecretVersion('secret-name');           
*/
const getLastestSecretVersion = async (secretName) => {
    const isAvailable = await gcpMetadata.isAvailable();
    const projectId = await isAvailable ? await gcpMetadata.project('project-id') : process.env.PROJECT_ID;

    const [versions] = await client.listSecretVersions({
        parent: `projects/${projectId}/secrets/${secretName}`,
    });
    const latestVersion = versions
        .filter(version => version.state === 'ENABLED')
        .sort((a, b) => b.createTime.localeCompare(a.createTime))[0];
    
     return latestVersion;
}

/*
    * Get the secret value from Google Cloud Secret Manager
    * @param {string} secretName - The name of the secret
    * @returns {string} - The secret value
    * Usage: 
    * const secret = await getSecret('secret-name');
*/
module.exports.getSecret = async (secretName) => {

    const lastEnabledVersion = await getLastestSecretVersion(secretName);
    if (lastEnabledVersion) {
        const [version] = await client.accessSecretVersion({
            name: lastEnabledVersion.name
        });

        return version.payload.data.toString('utf8')
    }
}