# Flow.js
A Webhook-featured workflow automation framework.

## Samples
Create a workflow for employees to apply for expenditure.
```js
var flow = new Flow();
flow.setup('/expenditure')
    .if(data => { return isLevelOneEmployee(data.from) })
      .trigger('level-2@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-2@samples.com' })
      .trigger('level-3@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-3@samples.com' })
      .trigger('level-4@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-4@samples.com' })
      .trigger(data.applicant, 'got-approval.html')
      .trigger('secretary@samples.com', 'got-approval.html');
```
