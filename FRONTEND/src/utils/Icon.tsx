import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface IconProps {
  icon: IconDefinition
  css: string
  size?: SizeProp
}

export const Icon = ({ icon, css, size = 'lg' }: IconProps) => {
  return <FontAwesomeIcon className={css} icon={icon} size={size}/>
}
