# finalize feature submission version 01

## Tasks 01 - Adjust yjs-server

- [x] Create `TemplateStrategy` and `SubmissionStrategy`, which handle save, load document of `yjs`

## Tasks 02 - Save submission value to server

- [x] Finalize flow: [yjs-server] when submission has changes -> get `values` and `clock` (lock version of key) -> Send to amqp -> On [server] save to entity

## Tasks 03 - Mapping to SubmissionSearchDoc

- [x] On [server], when amqp has event from [yjs-server], convert it to `SubmissionSearchDoc`
- Format:

```ts
interface SubmissionSearchDoc {
  id: docId,
  tags: [
    `<key>:<value>`
  ],
  date: [
    { key: <key-value>, value: <timestamp> }
  ]
  text: [
    { key: <key-value>, value: <string-value> }
  ]
}
```

- [x] Setup `docker-compose` for `MeiliSearch`
- [x] Send `SubmissionSearchDoc` to `MeiliSearch`
- [ ] Submission filter using `POST` with `PrismaFilter` -> Send to [server] -> server convert to `MeiliSearch` query -> Get result -> return submission found
- [ ] Filter base on `display-type`
  - Entity (user, options, radio, ...) -> extract match on `tags`
  - Date (date, time, datetime) -> extract match on range on `date`
  - Text (text, text-area) ->fuzzy match on `text`
