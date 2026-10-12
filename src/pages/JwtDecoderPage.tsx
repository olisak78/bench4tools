import { ComingSoon } from '../components/ComingSoon'
import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'

const tool = getTool('jwt-decoder')!

export function JwtDecoderPage() {
  return (
    <ToolPageLayout tool={tool}>
      <ComingSoon tool={tool} />
    </ToolPageLayout>
  )
}
