# DO NOT USE YET

this is a work in progress

## CLI commands, stuff that works currently

- install this tool with `npm i -g @seagull-js/seagull`
- create a new app with `seagull MyApp`
- (change into directory with `cd MyApp`)
- add some backend logic `seagull add api --name hello --path '/'`
- compile the app with `seagull build`
- start a devserver with `seagull serve` and point your browser to `http://localhost:3000/`

## Roadmap

- [x] set up CLI tool with configuration / dependencies
- [x] add "new" command with local template
- [x] add "add api" command after APIs are defined in framework core
- [x] add "build" command and provide outsourced tooling for apps
- [x] add "serve" command which wraps up backend handlers into localhost:3000
- [ ] add livereload to "serve" command for developer ergonomics
- [ ] add "deploy" command to push app to AWS
- [ ] add "add view" command after SPA-framework is integrated in seagull
- [ ] add "add store" command after views are working
- [ ] integrate transparent SSR backend handler into core
- [ ] make dev server as fast and efficient as possible (no macbook battery drain pls)
- [ ] refactor all features fully into CLI commands and polish them visually
- [ ] define some sort of plugins for core and add CLI command "add plugin"
- [ ] write some docs and quickstart guides
- [ ] polish github repositories and website
- [ ] official release