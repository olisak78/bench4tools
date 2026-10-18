import { ToolPageLayout } from '../components/ToolPageLayout'
import { getTool } from '../data/tools'
import { Base64Tool } from '../tools/Base64Tool'

const tool = getTool('base64')!

export function Base64Page() {
  return (
    <ToolPageLayout tool={tool} wide>
      <Base64Tool />
    </ToolPageLayout>
  )
}
