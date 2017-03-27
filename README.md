# Flow.js
A Webhook-featured workflow automation framework.

## Samples
Create a workflow for employees to apply for expenditure.
```js
var flowjs = require('node-flowjs');
var flow = new flowjs.Flow();
var team = new flowjs.Team();
flow.setup('/expenditure-application-workflow')
    .if(data => { return data.from === 'director@samples.com' })
      .trigger(data.applicant, 'got-approval.html')
      .trigger('secretary@samples.com', 'got-approval.html')
      .end()
    .if(data => { return true })
      .trigger(team.findManager(data.from).email, 'ask-approval.html')
```
