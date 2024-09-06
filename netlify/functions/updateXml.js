// Import the fetch function from node-fetch
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { stringify } from 'xml2js';

export async function handler(event, context) {
  try {
    // Your function logic here

    // Example of fetching data from GitHub
    const response = await fetch('https://api.github.com/repos/abdelmoez/step2/contents/data.xml', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    const data = await response.json();
    const xmlContent = Buffer.from(data.content, 'base64').toString();

    // Parse and modify XML
    const result = await parseStringPromise(xmlContent);
    // Modify XML here
    const updatedXml = ...; // Your logic to update the XML

    // Convert updated XML back to string
    const xmlString = await stringify(updatedXml);

    // Upload updated XML back to GitHub
    await fetch('https://api.github.com/repos/abdelmoez/step2/contents/data.xml', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update data.xml',
        content: Buffer.from(xmlString).toString('base64'),
        sha: data.sha
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'XML updated successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update XML' }),
    };
  }
}
