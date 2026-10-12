import { ComingSoon } from '../components/ComingSoon'
import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'

const tool = getTool('base64')!

export function Base64Page() {
  return (
    <ToolPageLayout tool={tool}>
      <ComingSoon tool={tool} />
    </ToolPageLayout>
  )
}
