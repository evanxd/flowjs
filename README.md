# webhook
A Webhook-featured workflow automation framework.

## Samples
Create a workflow for employees to apply for expenditure.
```js
var hook = new Webhook();
hook.hook('/expenditure')
    .if(data => { return employee.isLevelOne(data.from) })
      .trigger(data.applicant, 'application.html')
      .trigger('level-2@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-2@samples.com' })
      .trigger(data.applicant, 'application.html')
      .trigger('level-3@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-3@samples.com' })
      .trigger(data.applicant, 'application.html')
      .trigger('level-4@samples.com', 'ask-approval.html')
    .if(data => { return data.from === 'level-4@samples.com' })
      .trigger(data.applicant, 'got-approval.html');
      .trigger('secretary@samples.com', 'got-approval.html')
```