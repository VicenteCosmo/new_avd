import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'
import CardContents from './CardsContents'

const ModuleCard = ({ 
  title, 
  description,
  imageSrc, link
} : {title: any, description: any, imageSrc: any, link: any}) => (
  <Card className="mt-10 w-96 h-120 shadow-2xl rounded-2xl"
    placeholder={undefined} 
    onPointerEnterCapture={undefined} 
    onPointerLeaveCapture={undefined}>
    
    <CardHeader className="relative h-56 rounded-2xl flex"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Image 
        src={imageSrc} 
        alt={title} 
        width={320} 
        height={224} 
        className="w-80 h-50 mx-auto object-contain "
      />
    </CardHeader>

    <CardBody
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Typography
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
        variant="h4" 
        className="mb-2 text-black px-5"
        placeholder={undefined}>
        {title}
      </Typography>

      <Typography
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
        className="mb-2 px-5 text-black mt-5 whitespace-pre-line"
        placeholder={undefined}>
        {description}
      </Typography>
    </CardBody>

    <CardFooter className="pt-0 px-5 mt-3"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}>
      <Button
        className="bg-black py-3 px-7 mb-2 rounded-2xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        >
            
        <Link href={link} >Saiba mais</Link>
      </Button>
    </CardFooter>
  </Card>
)

export default ModuleCard