import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'
import { JsonFormatter } from '../tools/JsonFormatter'

const tool = getTool('json-formatter')!

export function JsonFormatterPage() {
  return (
    <ToolPageLayout tool={tool} wide>
      <JsonFormatter />
    </ToolPageLayout>
  )
}
