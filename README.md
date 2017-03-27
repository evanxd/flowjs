# Flow.js
A Webhook-featured workflow automation framework.

## Samples
Create a workflow for employees to apply for expenditure.
```js
var flow = new Flow();
flow.setup('/expenditure-application-workflow')
    .if(data => { return data.from === 'director@samples.com' })
      .trigger(data.applicant, 'got-approval.html')
      .trigger('secretary@samples.com', 'got-approval.html')
      .end()
    .if(data => { return true })
      .trigger(getManagerEmail(data.from), 'ask-approval.html')
```
