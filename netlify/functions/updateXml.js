const fetch = require('node-fetch'); // Make sure to install this package

exports.handler = async (event) => {
  const repoOwner = 'abdelmoez';
  const repoName = 'step2';
  const workflowId = 'update-xml.yml'; // Your workflow file name
  const githubToken = process.env.GITHUB_TOKEN;

  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/dispatches`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${githubToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: 'main' // or the branch you want to run the workflow on
    }),
  });

  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Workflow triggered successfully!' }),
    };
  } else {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'Failed to trigger workflow' }),
    };
  }
};
