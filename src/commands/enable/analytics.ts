import { Command, command, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { generateAPI } from '../../lib/codegen'
import { log } from '../../lib/logger'

@command({ description: 'scaffold a new api handler' })
export default class extends Command {
  execute(
    @param({
      description: 'google analytics id, looks like "UA-XXXXXX-X"',
      required: true,
    })
    id: string
  ) {
    // create API handler
    const body = `
      // tslint:disable-next-line
      console.log(request.body)
      return this.text('ok')
    `
    const gen = generateAPI('Track', { path: '/track', method: 'POST', body })
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `Track.ts`)
    gen.toFile(dest)
    log(`created backend tracking api in: ${dest}`)

    // modify layout.tsx
    const layout = join(pwd, 'frontend', 'layout.tsx')
    const scripts = `<script>{'window.analytics = true;'}</script>
    <script
          dangerouslySetInnerHTML={{
            __html: \`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', '${id}', 'auto');\`,
          }}
        />
    </head>`
    // tslint:disable-next-line:no-console
    console.log('modified layout file: ', layout)
    shell.sed('-i', /<\/head>/, scripts, layout)
  }
}
