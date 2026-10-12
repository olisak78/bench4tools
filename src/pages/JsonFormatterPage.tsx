import { ComingSoon } from '../components/ComingSoon'
import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'

const tool = getTool('json-formatter')!

export function JsonFormatterPage() {
  return (
    <ToolPageLayout tool={tool}>
      <ComingSoon tool={tool} />
    </ToolPageLayout>
  )
}
