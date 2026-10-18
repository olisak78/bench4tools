import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'
import { JwtDecoder } from '../tools/JwtDecoder'

const tool = getTool('jwt-decoder')!

export function JwtDecoderPage() {
  return (
    <ToolPageLayout tool={tool} wide>
      <JwtDecoder />
    </ToolPageLayout>
  )
}
