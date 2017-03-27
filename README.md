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
      .trigger(`mailto:${data.applicant}`, './got-approval.html')
      .mail('mailto:secretary@samples.com', './got-approval.html')
    .if(data => { return true })
      .mail(`mailto:${team.findManager(data.from).email}`, './ask-approval.html');
```
